import { StreamingTextResponse, LangChainStream, Message } from 'ai';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage } from 'langchain/schema';
//import axios from 'axios';

export const runtime = 'edge';

const getFullUrl = (url: string): string => {
  if (typeof window === 'undefined') {
      // Server-side, construct the absolute URL
      const baseUrl = process.env.SITE_BASE_URL || 'http://localhost:3000';
      return `${baseUrl}${url}`;
  }
  // Client-side, use the relative URL directly
  return url;
};

  export async function POST(req: Request) {
    try {
      const { messages } = await req.json();
      const currentMessageContent = messages[messages.length - 1].content;
    
      const vectorSearch = await fetch(getFullUrl("/api/vectorSearch"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: currentMessageContent,
      }).then((res) => res.json());

    //  const vectorSearch = await axios.post(getFullUrl("/api/vectorSearch"), currentMessageContent).then((res) => res.data);
    
      const TEMPLATE = `You are a very enthusiastic representative who loves to help people! Given the following sections from the uploaded docs, answer the question using only that information, outputted in markdown format. If there is no context (empty list) at all mention the  "admin" page to upload knowledge as well as verifying the Atlas Vector index is created correctly on db: \`docs\` and collection \`embeddings\` \`\`\`{
        "fields": [
          {
            "type": "vector",
            "path": "embedding",
            "numDimensions": 1536,
            "similarity": "cosine"
          }
        ]
      }\`\`\` . If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that.".
      
      Context sections:
      ${JSON.stringify(vectorSearch)}
    
      Question: """
      ${currentMessageContent}
      """
      `;
    
      messages[messages.length -1].content = TEMPLATE;
    
      const { stream, handlers } = LangChainStream();
    
      const llm = new ChatOpenAI({
        modelName: "gpt-4",
        streaming: true,
      });
    
      llm
        .call(
          (messages as Message[]).map((m) =>
            m.role == "user"
              ? new HumanMessage(m.content)
              : new AIMessage(m.content)
          ),
          {},
          [handlers]
        )
        .catch(console.error);
    
      return new StreamingTextResponse(stream);
      }
      catch (error) {
        console.error(error);
        return new Response("An error occurred while processing the request.", {
          status: 500,
        });
      }
  }