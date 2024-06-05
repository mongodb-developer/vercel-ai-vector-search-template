import { StreamingTextResponse, LangChainStream, Message } from 'ai';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage } from 'langchain/schema';

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

const databaseErrorPrompt = async (errorMessage: string, userMessage: string): Promise<string> => {
  const prompt = `You are a very enthusiastic representative who loves to help people! Given the following error from the database, provide assistance in markdown format:
  
  Error: "${errorMessage}"
  
  User's question: "${userMessage}"

  Network issues could be a lack of IP access list entry, incorrect URI, or incorrect username/password. Consider adding 0.0.0.0/0 to the IP access list for testing purposes. 
  If you are unsure and the answer is not explicitly written, say "Sorry, I don't know how to help with that.".

  Mention the "admin" page to upload knowledge as well as verifying the Atlas Vector index is created correctly on db: \`docs\` and collection \`embeddings\` \`\`\`{
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "cosine"
      }
    ]
  }\`\`\`.`;

  return prompt;
};

export async function POST(req: Request) {
  let vectorSearch;
  let messages;

  try {
    const requestBody = await req.json();
    messages = requestBody.messages;
    const currentMessageContent = messages[messages.length - 1].content;
    const llm = new ChatOpenAI({
      modelName: "gpt-4",
      streaming: true,
    });

    vectorSearch = await fetch(getFullUrl("/api/vectorSearch"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: currentMessageContent }),
    }).then((res) => res.json()).catch((error) => {throw new Error(error)});

    if (vectorSearch.ok === 0){
      throw new Error(JSON.stringify(vectorSearch));
    }



    const TEMPLATE = `You are a very enthusiastic representative who loves to help people! Given the following sections from the uploaded docs, answer the question using only that information, outputted in markdown format. If there is no context (empty list) at all mention the "admin" page to upload knowledge as well as verifying the Atlas Vector index is created correctly on db: \`docs\` and collection \`embeddings\` \`\`\`{
      "fields": [
        {
          "type": "vector",
          "path": "embedding",
          "numDimensions": 1536,
          "similarity": "cosine"
        }
      ]
    }\`\`\`. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that.".
    
    Context sections:
    ${JSON.stringify(vectorSearch)}
  
    Question: """
    ${currentMessageContent}
    """
    `;
  
    messages[messages.length - 1].content = TEMPLATE;
  
    const { stream, handlers } = LangChainStream();
  
    llm
      .call(
        (messages as Message[]).map((m) =>
          m.role === "user"
            ? new HumanMessage(m.content)
            : new AIMessage(m.content)
        ),
        {},
        [handlers]
      )
      .catch(console.error);
  
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Database error:', error);
    const userMessage = messages ? messages[messages.length - 1].content : "Unknown";
    let errorMessage = "An unknown error occurred.";

    if (error instanceof Error) {
      const prompt = await databaseErrorPrompt(error.message, userMessage);

      const errorResponseLLM = new ChatOpenAI({
        modelName: "gpt-4",
        streaming: true,
      });

      const { stream: errorStream, handlers: errorHandlers } = LangChainStream();

      errorResponseLLM
        .call(
          [new HumanMessage(prompt)],
          {},
          [errorHandlers]
        )
        .catch(console.error);

      return new StreamingTextResponse(errorStream, { status: 500 });
    } else {
      errorMessage = "An unexpected error occurred.";
    }

    return new Response(errorMessage, { status: 500 });
  }
}