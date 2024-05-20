"use client";

import { useChat } from "ai/react";
import Link from 'next/link';
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto">
        <Link href="/admin" className="text-xl font-bold hover:underline">
            Go to Admin Page for Context Upload
          </Link>
        </div>
      </header>
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <b>{m.role === "user" ? "User: " : "AI: "}</b>
              <ReactMarkdown>{m.content}</ReactMarkdown>
              <hr/>
            </div>
          ))
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
    </div>
  );
}
