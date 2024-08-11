"use client";

import { getLocalToken } from "@/app/(auth)/sign-up/page";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for client-side navigation

export function PopOverComponent() {
  const router = useRouter();
  const token = getLocalToken();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await fetch("/api/user/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  return (
    <Popover className="relative">
      <PopoverButton className="text-sm outline-none">
        <CircleUser size={30} className="dark:text-white text-black" />
      </PopoverButton>
      <PopoverPanel className="flex flex-col py-4 lg:w-[6vw] px-4 mt-2 absolute right-0 rounded bg-white dark:bg-[#151312] text-sm">
        {token ? (
          <>
            <span onClick={handleLogout} className="cursor-pointer">
              Logout
            </span>
            <div className="border my-2" />
            <Link href="/profile" className="text-blue-500 hover:underline">
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
            <div className="border my-2" />
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
}
