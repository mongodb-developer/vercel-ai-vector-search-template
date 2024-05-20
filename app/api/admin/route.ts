import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp, createWriteStream } from 'fs';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import mongoClientPromise from '@/app/lib/mongodb';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import Busboy from 'busboy';
import 'dotenv/config';

export const config = {
  api: {
    bodyParser: false,
  },
};



const authenticateAdmin = (req: NextRequest): boolean => {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === process.env.ADMIN_API_KEY;
};

const processPDF = async (filePath: string) => {
  const loader = new PDFLoader(filePath);
  const data = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });
  return await textSplitter.splitDocuments(data);
};

const processCSV = async (filePath: string) => {
  const loader = new CSVLoader(filePath);

  const data = await loader.load();

  return data;
};

const processJSON = async (filePath: string) => {
  
  const loader = new JSONLoader(filePath);
  const data = await loader.load();
  return data;
};

export async function POST(req: NextRequest) {
  if (!authenticateAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || '';
  const busboy = Busboy({ headers: { 'content-type': contentType } });
  let fileData: { filePath: string, mimetype: string } | null = null;

  const uploadDir = './uploads';
  await fsp.mkdir(uploadDir, { recursive: true });

  const buffer = await req.arrayBuffer();
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    },
  });

  const stream = readableStream.getReader();
  const promise = new Promise<void>((resolve, reject) => {
    busboy.on('file', (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
      console.log('File uploaded:', JSON.stringify(filename.filename));
      console.log('MIME type:',filename.mimeType);
      console.log('Encoding:', filename.encoding);

      const filePath = `${uploadDir}/${filename.filename}`;
      const writeStream = createWriteStream(filePath);
      fileData = { filePath : filePath, "mimetype" : filename.mimeType };
      file.pipe(writeStream);
      writeStream.on('finish', () => {
        console.log('in File written');
        console.log(`File written to ${JSON.stringify(filePath)}`);
        
        resolve();
      });
      writeStream.on('error', (error) => {
        console.error('Error writing file:', error);
        reject(error);
      });
    });

    busboy.on('finish', () => {
      console.log('Busboy finished parsing the form');
      resolve();
    });

    busboy.on('error', (error) => {
      console.error('Busboy error:', error);
      reject(error);
    });

    (async () => {
      while (true) {
        const { done, value } = await stream.read();
        if (done) break;
        busboy.write(Buffer.from(value));
      }
      busboy.end();
    })();
  });

  await promise;

  if (!fileData) {
    console.error('No file uploaded.');
    return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
  }

  let docs;
  try {
    console.log('File data:', JSON.stringify(fileData));
    if (fileData.mimetype === 'application/pdf') {
      console.log('Processing PDF');
      docs = await processPDF(`${uploadDir}/test.pdf`);
    } else if (fileData.mimetype === 'text/csv') {
      console.log('Processing CSV');
      docs = await processCSV(fileData.filePath);
    } else if (fileData.mimetype === 'application/json') {
      console.log('Processing JSON');
      docs = await processJSON(fileData.filePath);
    } else {
      console.error('Unsupported file type:', fileData.mimetype);
      return NextResponse.json({ message: 'Unsupported file type.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing file:', error);
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
    console.error('Error saving documents to MongoDB:', error);
    return NextResponse.json({ message: 'Error saving documents.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Documents uploaded successfully.' }, { status: 200 });
}
