import React from 'react'
import {
    CheckSquare,
    ListTodo,
    FileText,
    Music,
    Clock,
    Search,
    Droplet,
    Database,
    FileJson,
    Newspaper,
    Bot,
    DollarSign,
    Scroll,
    Youtube,
    Trello
} from 'lucide-react'

import { useTranslator } from '@/hooks/useTranslate'

type Tool = {
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>;
    path: string
    category: string
    highlight?: boolean
}

export function useToolsData(): Tool[] {
    const { t } = useTranslator("home")

    return [
      {
        name: t("tools.todo.title"),
        description: t("tools.todo.description"),
        icon: ListTodo,
        path: "/todo",
        category: "productivity",
        highlight: true,
      },
      {
        name: t("tools.kanban.title"),
        description: t("tools.kanban.description"),
        icon: Trello,
        path: "/kanban",
        category: "productivity",
      },
      {
        name: t("tools.pomodoro.title"),
        description: t("tools.pomodoro.description"),
        icon: Clock,
        path: "/pomodoro",
        category: "productivity",
      },
      {
        name: t("tools.notepad.title"),
        description: t("tools.notepad.description"),
        icon: Scroll,
        path: "/notepad",
        category: "productivity",
      },
      {
        name: t("tools.waterReminder.title"),
        description: t("tools.waterReminder.description"),
        icon: Droplet,
        path: "/water-reminder",
        category: "productivity",
      },
      {
        name: t("tools.internetSearch.title"),
        description: t("tools.internetSearch.description"),
        icon: Search,
        path: "/internet-search",
        category: "productivity",
      },
      {
        name: t("tools.aiTools.title"),
        description: t("tools.aiTools.description"),
        icon: Bot,
        path: "/ai-tools",
        category: "development",
      },
      {
        name: t("tools.deployChecklist.title"),
        description: t("tools.deployChecklist.description"),
        icon: CheckSquare,
        path: "/deploy-checklist",
        category: "development",
      },
      {
        name: t("tools.codeSnippets.title"),
        description: t("tools.codeSnippets.description"),
        icon: FileText,
        path: "/code-snippets",
        category: "development",
      },
      {
        name: t("tools.quickSearch.title"),
        description: t("tools.quickSearch.description"),
        icon: Search,
        path: "/search",
        category: "development",
      },
      {
        name: t("tools.fakeData.title"),
        description: t("tools.fakeData.description"),
        icon: Database,
        path: "/fake-data",
        category: "development",
      },
      {
        name: t("tools.jsonFormatter.title"),
        description: t("tools.jsonFormatter.description"),
        icon: FileJson,
        path: "/json-formatter",
        category: "development",
      },
      {
        name: t("tools.currencyConverter.title"),
        description: t("tools.currencyConverter.description"),
        icon: DollarSign,
        path: "/currency-converter",
        category: "utilities",
      },
      {
        name: t("tools.techNews.title"),
        description: t("tools.techNews.description"),
        icon: Newspaper,
        path: "/tech-news",
        category: "utilities",
      },
      {
        name: t("tools.lofi.title"),
        description: t("tools.lofi.description"),
        icon: Music,
        path: "/lofi",
        category: "entertainment",
      },
      {
        name: t("tools.youtube.title"),
        description: t("tools.youtube.description"),
        icon: Youtube,
        path: "/youtube-player",
        category: "entertainment",
        highlight: true,
      },
    ]
  }
