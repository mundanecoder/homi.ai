"use client";
import { useState } from "react";
import { Chat } from "../components/chat";
import { ArrowBigLeft } from "lucide-react";

export const runtime = "edge";

export default function Page() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-100 dark:bg-black h-[92vh]">
      <aside
        className={`w-[14%] p-4 border bg-gray-200 dark:bg-black  hidden `}
      >
        <div className="flex justify-end">
          <ArrowBigLeft onClick={toggleSidebar} />
        </div>
      </aside>

      {/* Chat Component */}
      <main className="flex-1 p-4 bg-white dark:bg-black">
        <Chat />
      </main>

      {/* Right Sidebar */}
      <aside className={`w-[14%] p-4 bg-gray-200 dark:bg-black border hidden `}>
        <h2 className="text-lg font-semibold">Right Sidebar</h2>
        {/* Add content for right sidebar here */}
      </aside>
    </div>
  );
}
