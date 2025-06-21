import { useTimer } from "@/context/timer-context";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const GlobalTimerNotification = () => {
  const { activeTab, isRunning, timeRemaining, registerCompletionCallback } =
    useTimer();
  const { toast } = useToast();

  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(timeRemaining)} - FlowHub ${
        activeTab === "pomodoro" ? "Foco" : "Pausa"
      }`;
    } else {
      document.title = "FlowHub";
    }
  }, [isRunning, timeRemaining, activeTab]);

  useEffect(() => {
    registerCompletionCallback(() => {
      if (activeTab === "pomodoro") {
        toast({
          title: "Pomodoro concluído!",
          description: "Hora de fazer uma pausa.",
        });
      } else {
        toast({
          title: "Pausa concluída!",
          description: "Hora de voltar ao trabalho.",
        });
      }
    });
  }, [activeTab, registerCompletionCallback, toast]);

  return null;
};

export default GlobalTimerNotification;
