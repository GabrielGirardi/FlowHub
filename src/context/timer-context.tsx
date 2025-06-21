import React, { createContext, useContext, ReactNode } from 'react';
import { useGlobalTimer } from '@/hooks/use-global-timer.ts';

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

type TimerSettings = {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
    autoStart: boolean;
};

type TimerContextType = {
    activeTab: TimerMode;
    isRunning: boolean;
    timeRemaining: number;
    sessionsCompleted: number;
    settings: TimerSettings;
    dailyStats: {
        date: string;
        sessions: number;
        totalFocusTime: number;
    };
    startPauseTimer: () => void;
    resetTimer: () => void;
    changeMode: (mode: TimerMode) => void;
    updateSettings: (settings: TimerSettings) => void;
    registerCompletionCallback: (callback: () => void) => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const timer = useGlobalTimer();

    return (
        <TimerContext.Provider value={timer}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};