import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

const routing = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/todo", element: <TodoList /> },
      { path: "/deploy-checklist", element: <DeployChecklist /> },
      { path: "/code-snippets", element: <CodeSnippets /> },
      { path: "/lofi", element: <LofiMusic /> },
      { path: "/pomodoro", element: <Pomodoro /> },
      { path: "/search", element: <QuickSearch /> },
      { path: "/internet-search", element: <InternetSearch /> },
      { path: "/water-reminder", element: <WaterReminder /> },
      { path: "/fake-data", element: <FakeData /> },
      { path: "/json-formatter", element: <JsonFormatter /> },
      { path: "/donation", element: <Donation /> },
      { path: "/tech-news", element: <TechNews /> },
      { path: "/ai-tools", element: <AITools /> },
      { path: "/currency-converter", element: <CurrencyConverter /> },
      { path: "/notepad", element: <Notepad /> },
      { path: "/youtube-player", element: <YouTubePlayer /> },
      { path: "/kanban", element: <Kanban /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={routing} />;
}
