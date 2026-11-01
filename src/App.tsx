import React from 'react'
import { I18nextProvider } from "react-i18next";

import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TimerProvider } from '@/contexts/TimerContext'
import Layout from '@/components/layout/Layout'
import GlobalTimerNotification from '@/components/GlobalTimerNotification'

import Home from '@/pages/home'
import TodoList from '@/pages/todoList'
import DeployChecklist from '@/pages/DeployChecklist'
import CodeSnippets from '@/pages/CodeSnippets'
import LofiMusic from '@/pages/LofiMusic'
import Pomodoro from '@/pages/Pomodoro'
import QuickSearch from '@/pages/QuickSearch'
import InternetSearch from '@/pages/InternetSearch'
import WaterReminder from '@/pages/WaterReminder'
import FakeData from '@/pages/FakeData'
import JsonFormatter from '@/pages/JsonFormatter'
import Donation from '@/pages/Donation'
import TechNews from '@/pages/TechNews'
import AITools from '@/pages/AITools'
import CurrencyConverter from '@/pages/CurrencyConverter'
import Notepad from '@/pages/Notepad'
import YouTubePlayer from '@/pages/YoutubePlayer'
import Kanban from '@/pages/Kanban'
import NotFound from '@/pages/NotFound'

import './i18n'
import i18n from '@/i18n'

const queryClient = new QueryClient()

const App = () => (
    <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
            <TooltipProvider>
                <TimerProvider>
                    <GlobalTimerNotification />
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Home />} />
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
                                <Route path="/currency-converter" element={<CurrencyConverter />} />
                                <Route path="/notepad" element={<Notepad />} />
                                <Route path="/youtube-player" element={<YouTubePlayer />} />
                                <Route path="/kanban" element={<Kanban />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </TimerProvider>
            </TooltipProvider>
        </I18nextProvider>
    </QueryClientProvider>
)

export default App