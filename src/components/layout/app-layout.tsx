import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./app-sidebar";

const Layout = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );
  const isMobile = useIsMobile();

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
          "flex-1 transition-all duration-300 overflow-x-hidden",
          isMobile ? "ml-0" : "ml-64"
        )}
      >
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
