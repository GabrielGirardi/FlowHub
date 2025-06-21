import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TimerProvider } from "@/context/timer-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalTimerNotification from "@/components/global-timer-notification";
import Layout from "./components/layout/app-layout";

import AITools from "./pages/ai-tools";
import CodeSnippets from "./pages/code-snippets";
import CurrencyConverter from "./pages/currency-converter";
import DeployChecklist from "./pages/deploy-checklist";
import Donation from "./pages/donation";
import FakeData from "./pages/fake-data";
import Index from "./pages/Index";
import InternetSearch from "./pages/internet-search";
import JsonFormatter from "./pages/json-formatter";
import Kanban from "./pages/kanban";
import LofiMusic from "./pages/lofi-music";
import NotFound from "./pages/not-found";
import Notepad from "./pages/notepad";
import Pomodoro from "./pages/pomodoro";
import QuickSearch from "./pages/quick-search";
import TechNews from "./pages/tech-news";
import TodoList from "./pages/todo-list";
import WaterReminder from "./pages/water-reminder";
import YouTubePlayer from "./pages/youtube-player";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TimerProvider>
        <GlobalTimerNotification />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/todo" element={<TodoList />} />
              <Route path="/deploy-checklist" element={<DeployChecklist />} />
              <Route path="/code-snippets" element={<CodeSnippets />} />
              <Route path="/lofi" element={<LofiMusic />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/search" element={<QuickSearch />} />
              <Route path="/internet-search" element={<InternetSearch />} />
              <Route path="/water-reminder" element={<WaterReminder />} />
              <Route path="/fake-data" element={<FakeData />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="/tech-news" element={<TechNews />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route
                path="/currency-converter"
                element={<CurrencyConverter />}
              />
              <Route path="/notepad" element={<Notepad />} />
              <Route path="/youtube-player" element={<YouTubePlayer />} />
              <Route path="/kanban" element={<Kanban />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TimerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
