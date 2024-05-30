import { NextRequest, NextResponse } from 'next/server';

import {
  SupportedTextSplitterLanguages,
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import mongoClientPromise from '@/app/lib/mongodb';
import 'dotenv/config';
import { put } from '@vercel/blob'; // Import Vercel Blob

export const runtime = 'nodejs';

interface FileData {
  name : string;
  mimetype: string;
}

const authenticateAdmin = (req: Request): boolean => {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === process.env.ADMIN_API_KEY;
};

const processPDF = async (url: string) => {

  const blob = await fetch(url).then((res) => res.blob());
  
  const loader = new WebPDFLoader(blob);

  const docs = await loader.load();

  return docs;

};

const processMD = async (url: string) => {

  const text = await fetch(url).then((res) => res.text());

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
    chunkSize: 500,
    chunkOverlap: 0,
  });
  const docs = await splitter.createDocuments([text]);

  return docs;

}


export async function PUT(request: Request) {
  if (!authenticateAdmin(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file') as File;
  if (!file) {
    console.error('No file uploaded.');
    return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
  }

  // Upload the file to Vercel Blob and get the blob URL
  const blob = await put(file.name, file, { access: 'public' });

  console.log('File type:', file.type);

  console.log('File uploaded:', blob.url);

  // Fetch the uploaded file as a buffer
  const fileData: FileData = { mimetype: file.type, name : file.name };

  let docs;
  try {
    if (fileData.mimetype === 'application/pdf') {
      console.log('Processing PDF file...');
      docs = await processPDF(blob.url);
    }
    else if (fileData.mimetype === 'application/octet-stream') {
      console.log('Processing Markdown file...');
      docs = await processMD(blob.url);
    }
     else {
      return NextResponse.json({ message: 'Unsupported file type.' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error processing file.' }, { status: 500 });
  }

  try {
    const client = await mongoClientPromise;
    const dbName = 'docs';
    const collectionName = 'embeddings';
    const collection = client.db(dbName).collection(collectionName);

    await MongoDBAtlasVectorSearch.fromDocuments(docs, new OpenAIEmbeddings(), {
      collection,
      indexName: 'vector_index',
      textKey: 'text',
      embeddingKey: 'embedding',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving documents.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Documents uploaded successfully.', blob }, { status: 200 });
}