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
1. **Respond Appropriately**: Tailor your response based on the user's message content and context. For greetings or personal comments, provide a general response to engage the user. For real estate-related queries, provide detailed and relevant information.
2. **Use Clear Markdown Headers**: Organize your responses using distinct headers to improve readability.
3. **Focus on Real Estate**: Only provide detailed information about real estate projects when the query is relevant. For unrelated queries, guide the conversation back to real estate topics.
4. **Include Follow-Up Questions**: If the user’s query is vague or lacks details, ask follow-up questions to gather more information and provide a better response.

**Response Format:**

# 🏡 Real Estate Assistance

Hello! I’m here to help you with information about real estate projects and properties in Assam. Based on your query, here’s the information:

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

If you haven’t specified a location or have specific preferences, please let me know! Here are a few questions to help narrow down your options:

1. **Could you provide more details about the type of property you're interested in?** For instance, residential or commercial, and any specific features you're looking for?
2. **Are there any particular neighborhoods or areas in Assam you're interested in?** This will help in suggesting properties in those locations.
3. **What is your budget range for the property?** This will help in filtering options that fit within your budget.
4. **Do you have any specific amenities or features in mind?** For example, number of bedrooms, type of flooring, etc.

---

### Greetings and Personal Information:

- If a user greets you with “Hi” or “Hello,” respond with: 
  - **Greeting Response:** *“Hello! How can I assist you today? If you have any questions or need information about real estate in Assam, feel free to ask!”*

- If the user provides personal information (e.g., a name), acknowledge it politely and redirect the conversation to real estate:
  -  *“Nice to meet you, ! How can I assist you with real estate today?”*

- For unrelated queries, gently steer the conversation back to real estate:
  - **Unrelated Query Response:** *“I’m here to help with real estate information. Could you please let me know what you’re looking for in the real estate market?”*

---

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

    //@ts-ignore
    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: async (input) => {
          // Perform a similarity search in the vector store
          const relevantDocs = await vectorStore.similaritySearch(
            input.question,
            3
          );

          // Process the relevant documents into a context string
          return relevantDocs
            .map((doc) => {
              const lines = doc.pageContent.split("\n");
              return lines
                .map((line) => {
                  const [
                    _,
                    __,
                    ___,
                    projectName,
                    developer,
                    location,
                    ...rest
                  ] = line.split("\t");
                  return `Project: ${projectName}, Developer: ${developer}, Location: ${location}`;
                })
                .join("\n");
            })
            .join("\n\n");
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
