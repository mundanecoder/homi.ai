// Dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getLocalToken } from "@/utils/auth";

import { User } from "@/types";
import BuilderDashboard from "./component/BuilderDashboard";
import UserDashboard from "./component/UserDashboard";
import { User2 } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const token = getLocalToken() || null;

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get<{ user: User }>("/api/user/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    getUser();
  }, [token]);

  return (
    <section className="min-h-screen w-full bg-gradient-to-br bg-gray-300 dark:bg-black  p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <header className="bg-gradient-to-r from-teal-300 to-indigo-300 dark:from-teal-500 dark:to-indigo-500 p-6">
          <div className="flex justify-between items-center">
            <div className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {user ? `Welcome, ${user.name}` : "Loading..."}
            </div>
            <div className="p-2 rounded-full bg-white text-teal-600 dark:bg-gray-800 dark:text-teal-400">
              <User2 className="w-6 h-6" />
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8">
          {user?.isBuilder ? (
            <BuilderDashboard token={token ?? ""} userId={user.id} />
          ) : (
            <div className="flex flex-col gap-2">
              <UserDashboard token={token ?? ""} />
              <BuilderDashboard token={token ?? ""} userId={user?.id ?? ""} />
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
