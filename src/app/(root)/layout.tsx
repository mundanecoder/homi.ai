"use client";

import { useEffect } from "react";
import { getLocalToken } from "@/utils/auth";

import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const token = getLocalToken();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  return (
    <main>
      <Navbar />
      <div>{children}</div>
    </main>
  );
}
