import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TimerProvider } from "@/context/timer-context";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import GlobalTimerNotification from "../global-timer-notification";
import { Sidebar } from "./app-sidebar";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TimerProvider>
          <GlobalTimerNotification />
          <Toaster />
          <Sonner />
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
        </TimerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Layout;
