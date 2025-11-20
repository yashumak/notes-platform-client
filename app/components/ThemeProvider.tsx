"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="fixed bottom-5 right-5 p-3 rounded-full bg-gray-200 dark:bg-gray-700 shadow-lg transition"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {children}
    </>
  );
}
