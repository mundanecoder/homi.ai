"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect, FormEvent } from "react";
import ReactMarkdown from "react-markdown";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: "api/ai-bot",
      onError: (e) => {
        console.log(e);
      },
    });
  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [messages]); // Add messages as dependency to update scroll position on new messages

  console.log(messages);
  const dummyQuestions = [
    "What are the current real estate trends in my area?",
    "How can I find the best investment property?",
    "What should I know before buying a house?",
    "What should I do to avoid getting scammed when buying a house?",
    "Find Me Residential flats from Dharapur , Guwahati?",
    "What are the eligibility criteria for obtaining a home loan?",
  ];

  const handleDummyQuestionClick = (question: string) => {
    setInput(question);
    handleSubmit(new Event("submit") as unknown as FormEvent<HTMLFormElement>);
  };

  return (
    <main className="flex items-center justify-center w-full h-[91vh] max-h-dvh bg-gray-100 dark:bg-black dark:text-gray-300">
      <section className="w-full max-w-4xl py-4 h-full flex flex-col">
        <section className="flex-1 flex flex-col bg-white dark:bg-gray-800  border-gray-200 dark:border-gray-900 rounded-lg shadow-lg overflow-hidden">
          <section className="p-4 flex-shrink-0  border-gray-200 dark:border-black">
            <form onSubmit={handleSubmit} className="flex w-full items-center">
              <Input
                className="flex-1 min-h-[40px] border rounded-md"
                placeholder="Type your question here..."
                type="text"
                value={input}
                onChange={handleInputChange}
              />
              <Button className="ml-2" type="submit">
                Submit
              </Button>
            </form>
          </section>
          <ul
            ref={chatParent}
            className="flex-1 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-y-auto flex flex-col gap-4"
            style={{
              scrollbarWidth: "thin",
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <ul className="flex flex-col gap-2 text-sm">
                  {dummyQuestions.map((question, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 border rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => handleDummyQuestionClick(question)}
                    >
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              messages.map((m, index) => (
                <li
                  key={index}
                  className={`flex ${
                    m.role === "user" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`p-3 rounded-md shadow-sm flex-1 ${
                      m.role === "user"
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                        : "bg-blue-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <ReactMarkdown className="text-sm">
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </section>
    </main>
  );
}
