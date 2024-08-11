"use client";

import { PopOverComponent } from "@/components/ui/Popover";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures the component is mounted on the client
  }, []);

  const renderThemeToggle = () => (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full hover:bg-gray-100 border dark:hover:bg-gray-700"
    >
      {theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon className="fill-gray-500" size={20} />
      )}
    </button>
  );

  return (
    <nav className="dark:bg-black/80 bg-white border-b border-gray-850 dark:text-white/80 flex items-center justify-center py-4">
      <div className="flex justify-between w-11/12">
        <div className="text-xl font-bold flex items-center">homi</div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex text-white gap-2 self-start">
            {mounted && renderThemeToggle()}{" "}
            {/* Render toggle only after mount */}
          </div>
          <div className="flex text-white gap-2 self-start">
            <PopOverComponent />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
