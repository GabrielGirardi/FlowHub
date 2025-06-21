import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./app-sidebar";

const Layout = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <main
        className={cn(
          "flex-1 transition-all duration-300 w-full overflow-x-hidden"
        )}
      >
        <div className="w-full mx-auto md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
