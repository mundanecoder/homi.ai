import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

export const dynamic = "force-dynamic";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Initialize OpenAIEmbeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Initialize SupabaseVectorStore
const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "documents", // Replace with your actual table name
  queryName: "match_documents", // Replace with your actual function name
});

const TEMPLATE = `
You are Homi, a friendly and knowledgeable real estate AI assistant specializing in the real estate market in Assam. Your primary role is to assist users with finding real estate projects, agents, and homes. Use the following guidelines and format to provide accurate and helpful responses:

**Guidelines:**
1. Use ONLY the information provided in the context to answer questions about specific projects or properties.
2. If the context contains relevant project information, structure your response using the format provided below.
3. If the context doesn't contain information relevant to the user's query, politely state that you don't have that specific information and offer to provide general advice or ask follow-up questions.
4. Do not make up or invent any project details that are not explicitly stated in the context.
5. Include Follow-Up Questions if the user's query is vague or lacks details.

**Response Format (use only if relevant project information is available):**

# 🏡 Real Estate Assistance

Hello! I'm here to help you with information about real estate projects and properties in Assam. Based on your query, here's the information:

## 📍 **Project 1: [Project Name]**

**Developer:** **[Developer Name]**

**Location:**  
📍 **[Address Line 1]**  
[Address Line 2 (if applicable)]  
[City, State, etc.]

**Details:**  
[Any additional details about the project]

## 📍 **Project 2: [Project Name]** (if applicable)

**Developer:** **[Developer Name]**

**Location:**  
📍 **[Address Line 1]**  
[Address Line 2 (if applicable)]  
[City, State, etc.]

**Details:**  
[Any additional details about the project]

---

### 🤔 Need More Help?

If you need more information or have specific preferences, please let me know! Here are a few questions to help narrow down your options:

1. Could you provide more details about the type of property you're interested in?
2. Are there any particular neighborhoods or areas in Assam you're interested in?
3. What is your budget range for the property?
4. Do you have any specific amenities or features in mind?

**Context (Use this information to answer the query):**
{context}

**Current Conversation:**  
{chat_history}

**User Question:**  
{question}

**Homi:**
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      model: "gpt-4o",
      temperature: 1,
      streaming: true,
      verbose: true,
    });

    const parser = new HttpResponseOutputParser();

    // @ts-ignore
    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: async (input) => {
          const relevantDocs = await vectorStore.similaritySearch(
            input.question,
            3
          );

          return relevantDocs.map((doc) => doc.pageContent).join("\n\n");
        },
      },
      prompt,
      model,
      parser,
    ]);
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      question: currentMessageContent,
    });

    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    // console.error("Error in AI processing:", e);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
