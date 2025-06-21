import MusicPlayer from "@/components/music-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTimer } from "@/context/timer-context";
import {
  Brain,
  Clock,
  Coffee,
  Pause,
  Play,
  RotateCcw,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";

type TimerSettings = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStart: boolean;
};

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const Pomodoro = () => {
  const {
    activeTab,
    isRunning,
    timeRemaining,
    sessionsCompleted,
    settings,
    dailyStats,
    startPauseTimer,
    resetTimer,
    changeMode,
    updateSettings,
  } = useTimer();

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [editableSettings, setEditableSettings] =
    useState<TimerSettings>(settings);

  useEffect(() => {
    setEditableSettings(settings);
  }, [settings]);

  const saveSettings = () => {
    const newSettings = {
      ...editableSettings,
      pomodoro: Math.max(1, Math.min(60, editableSettings.pomodoro)),
      shortBreak: Math.max(1, Math.min(30, editableSettings.shortBreak)),
      longBreak: Math.max(1, Math.min(60, editableSettings.longBreak)),
    };

    updateSettings(newSettings);
    setIsSettingsOpen(false);
  };

  const totalSeconds = settings[activeTab] * 60;
  const progressPercent = ((totalSeconds - timeRemaining) / totalSeconds) * 100;

  const getThemeColors = () => {
    switch (activeTab) {
      case "pomodoro":
        return {
          primary: "bg-gradient-to-br from-blue-500 to-blue-600",
          accent: "text-blue-400",
          button: "bg-blue-500 hover:bg-blue-600",
          icon: "text-blue-400",
          progress: "stroke-blue-400",
          glow: "shadow-blue-500/25",
        };
      case "shortBreak":
        return {
          primary: "bg-gradient-to-br from-green-500 to-green-600",
          accent: "text-green-400",
          button: "bg-green-500 hover:bg-green-600",
          icon: "text-green-400",
          progress: "stroke-green-400",
          glow: "shadow-green-500/25",
        };
      case "longBreak":
        return {
          primary: "bg-gradient-to-br from-purple-500 to-purple-600",
          accent: "text-purple-400",
          button: "bg-purple-500 hover:bg-purple-600",
          icon: "text-purple-400",
          progress: "stroke-purple-400",
          glow: "shadow-purple-500/25",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="min-h-screen text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-2">
            Pomodoro Timer
          </h1>
          <p className="text-gray-400 text-lg">
            Técnica comprovada para aumentar sua produtividade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Sessões Hoje</p>
                  <p className="text-2xl font-bold">{dailyStats.sessions}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-none text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Tempo Focado</p>
                  <p className="text-2xl font-bold">
                    {dailyStats.totalFocusTime}min
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-none text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Status</p>
                  <p className="text-2xl font-bold">
                    {isRunning ? "Ativo" : "Pausado"}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-none text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Modo Atual</p>
                  <p className="text-2xl font-bold">
                    {activeTab === "pomodoro" ? "Foco" : "Pausa"}
                  </p>
                </div>
                <div className="w-8 h-8">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full text-purple-200"
                  >
                    <path
                      fill="currentColor"
                      d="M16,21L12,19L8,21V7H16M16,5H8A2,2 0 0,0 6,7V21L12,18L18,21V7A2,2 0 0,0 16,5Z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/70 border-gray-400 dark:border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className={colors.icon} size={24} />
                    Timer Ativo
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Settings size={18} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => changeMode(value as any)}
                  className="mb-8"
                >
                  <TabsList className="grid grid-cols-3 mb-8 bg-gray-700 border-gray-600">
                    <TabsTrigger
                      value="pomodoro"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
                    >
                      <Brain size={16} />
                      Foco
                    </TabsTrigger>
                    <TabsTrigger
                      value="shortBreak"
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
                    >
                      <Coffee size={16} />
                      Pausa Curta
                    </TabsTrigger>
                    <TabsTrigger
                      value="longBreak"
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
                    >
                      <Coffee size={16} />
                      Pausa Longa
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pomodoro">
                    <div className="text-center mb-4">
                      <p className="text-gray-400 text-lg">
                        🍅 Tempo de foco e concentração total
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="shortBreak">
                    <div className="text-center mb-4">
                      <p className="text-gray-400 text-lg">
                        ☕ Pausa rápida para relaxar
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="longBreak">
                    <div className="text-center mb-4">
                      <p className="text-gray-400 text-lg">
                        🌟 Pausa longa para recarregar
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="relative mb-8 flex justify-center">
                  <div className="relative w-80 h-80">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-600"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 45 * (1 - progressPercent / 100)
                        }`}
                        className={`${colors.progress} transition-all duration-1000`}
                        filter="drop-shadow(0 0 8px currentColor)"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                      <span
                        className={`text-6xl font-bold ${colors.accent} mb-2`}
                      >
                        {formatTime(timeRemaining)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {activeTab === "pomodoro" ? "Trabalho" : "Pausa"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={startPauseTimer}
                    size="lg"
                    className={`w-40 ${colors.button} text-white font-semibold py-3 px-6 rounded-xl cursor-pointer shadow-lg ${colors.glow} shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105`}
                  >
                    {isRunning ? (
                      <>
                        <Pause size={20} className="mr-2" /> Pausar
                      </>
                    ) : (
                      <>
                        <Play size={20} className="mr-2" /> Iniciar
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="lg"
                    disabled={isRunning}
                    className="w-16 bg-gray-700 border-gray-600 text-gray-300 cursor-pointer hover:bg-gray-700 hover:text-white"
                  >
                    <RotateCcw size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <MusicPlayer />
            <Card className="bg-gray-800/90 border-gray-400 dark:border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="text-purple-400" size={20} />
                  Estatísticas de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                    <div className="text-3xl font-bold text-purple-400">
                      {dailyStats.sessions}
                    </div>
                    <div className="text-sm text-gray-400">
                      Sessões concluídas hoje
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-3xl font-bold text-blue-400">
                      {dailyStats.totalFocusTime}min
                    </div>
                    <div className="text-sm text-gray-400">
                      Tempo total focado
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-blue-500/20 rounded border border-blue-500/30">
                      <div className="font-semibold text-blue-400">
                        {settings.pomodoro}min
                      </div>
                      <div className="text-xs text-gray-400">Foco</div>
                    </div>
                    <div className="text-center p-2 bg-green-500/20 rounded border border-green-500/30">
                      <div className="font-semibold text-green-400">
                        {settings.shortBreak}min
                      </div>
                      <div className="text-xs text-gray-400">Pausa</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {isSettingsOpen && (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="text-blue-400" size={20} />
                    Configurações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="pomodoro"
                        className="text-sm font-medium text-gray-300"
                      >
                        Duração do Pomodoro (min)
                      </Label>
                      <Input
                        id="pomodoro"
                        type="number"
                        min={1}
                        max={60}
                        value={editableSettings.pomodoro}
                        onChange={(e) =>
                          setEditableSettings({
                            ...editableSettings,
                            pomodoro: Number(e.target.value),
                          })
                        }
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="shortBreak"
                        className="text-sm font-medium text-gray-300"
                      >
                        Duração da Pausa Curta (min)
                      </Label>
                      <Input
                        id="shortBreak"
                        type="number"
                        min={1}
                        max={30}
                        value={editableSettings.shortBreak}
                        onChange={(e) =>
                          setEditableSettings({
                            ...editableSettings,
                            shortBreak: Number(e.target.value),
                          })
                        }
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="longBreak"
                        className="text-sm font-medium text-gray-300"
                      >
                        Duração da Pausa Longa (min)
                      </Label>
                      <Input
                        id="longBreak"
                        type="number"
                        min={1}
                        max={60}
                        value={editableSettings.longBreak}
                        onChange={(e) =>
                          setEditableSettings({
                            ...editableSettings,
                            longBreak: Number(e.target.value),
                          })
                        }
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoStart"
                        checked={editableSettings.autoStart}
                        onCheckedChange={(checked) =>
                          setEditableSettings({
                            ...editableSettings,
                            autoStart: checked === true,
                          })
                        }
                      />
                      <Label
                        htmlFor="autoStart"
                        className="text-sm text-gray-300"
                      >
                        Iniciar automaticamente
                      </Label>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsSettingsOpen(false)}
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={saveSettings}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
