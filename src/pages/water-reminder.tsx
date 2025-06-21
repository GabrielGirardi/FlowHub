import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
    Droplets,
    Trophy,
    Target,
    TrendingUp,
    Plus,
    RotateCcw,
    Award,
    Calendar,
    Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WaterData {
    consumed: number;
    goal: number;
    streak: number;
    lastUpdateDate: string;
    todayGlasses: number;
}

const WaterReminder = () => {
    const { toast } = useToast();

    const getInitialData = (): WaterData => {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('water-reminder-data');

        if (saved) {
            const data: WaterData = JSON.parse(saved);

            // Se é um novo dia, resetar dados mas manter streak se meta foi atingida
            if (data.lastUpdateDate !== today) {
                const wasGoalMet = data.consumed >= data.goal;
                return {
                    consumed: 0,
                    goal: data.goal,
                    streak: wasGoalMet ? data.streak + 1 : 0,
                    lastUpdateDate: today,
                    todayGlasses: 0
                };
            }
            return data;
        }

        return {
            consumed: 0,
            goal: 2000,
            streak: 0,
            lastUpdateDate: today,
            todayGlasses: 0
        };
    };

    const [waterData, setWaterData] = useState<WaterData>(getInitialData);

    useEffect(() => {
        localStorage.setItem('water-reminder-data', JSON.stringify(waterData));
    }, [waterData]);

    const addWater = (amount: number) => {
        setWaterData(prev => {
            const newConsumed = prev.consumed + amount;
            const newGlasses = prev.todayGlasses + 1;

            // Verificar se atingiu a meta
            if (prev.consumed < prev.goal && newConsumed >= prev.goal) {
                toast({
                    title: "🎉 Meta atingida!",
                    description: "Parabéns! Você atingiu sua meta diária de hidratação!",
                });
            }

            return {
                ...prev,
                consumed: newConsumed,
                todayGlasses: newGlasses
            };
        });
    };

    const resetDaily = () => {
        setWaterData(prev => ({
            ...prev,
            consumed: 0,
            todayGlasses: 0
        }));

        toast({
            title: "Dados resetados",
            description: "Seu progresso do dia foi resetado.",
        });
    };

    const waterSizes = [
        { label: "Copo Pequeno", amount: 200, icon: "🥃" },
        { label: "Copo Médio", amount: 300, icon: "🥤" },
        { label: "Garrafa", amount: 500, icon: "🍼" },
        { label: "Garrafa Grande", amount: 750, icon: "🍶" }
    ];

    const progressPercentage = Math.min((waterData.consumed / waterData.goal) * 100, 100);
    const isGoalReached = waterData.consumed >= waterData.goal;

    const getStreakBadge = () => {
        if (waterData.streak >= 30) return { label: "Lenda", color: "bg-purple-500", icon: "👑" };
        if (waterData.streak >= 21) return { label: "Mestre", color: "bg-yellow-500", icon: "🏆" };
        if (waterData.streak >= 14) return { label: "Expert", color: "bg-blue-500", icon: "💎" };
        if (waterData.streak >= 7) return { label: "Consistente", color: "bg-green-500", icon: "🔥" };
        if (waterData.streak >= 3) return { label: "Iniciante", color: "bg-orange-500", icon: "⭐" };
        return { label: "Novato", color: "bg-gray-500", icon: "🌱" };
    };

    const streakBadge = getStreakBadge();

    return (
        <div className="min-h-screen p-6">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        💧 Lembrete de Hidratação
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Mantenha-se hidratado e saudável com nosso sistema de acompanhamento diário
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Copo de Água Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full">
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Droplets className="w-6 h-6 text-blue-500" />
                                    Progresso do Dia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                {/* Copo Visual */}
                                <div className="relative w-32 h-48 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-blue-200 rounded-b-3xl rounded-t-lg"></div>
                                    <motion.div
                                        className="absolute bottom-0 left-1 right-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-b-3xl"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${progressPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    >
                                        <motion.div
                                            className="absolute top-0 left-0 right-0 h-2 bg-blue-200 opacity-50"
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>

                                    {/* Indicadores de nível */}
                                    <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-2">
                                        {[100, 75, 50, 25].map((level) => (
                                            <div key={level} className="flex items-center">
                                                <div className="w-2 h-px bg-gray-300 mr-1"></div>
                                                <span className="text-xs text-muted-foreground">{level}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center w-full">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {waterData.consumed}ml
                                    </div>
                                    <div className="text-muted-foreground mb-4">
                                        de {waterData.goal}ml
                                    </div>
                                    <Progress value={progressPercentage} className="w-full mb-4" />
                                    <div className="text-sm text-muted-foreground">
                                        {progressPercentage.toFixed(1)}% da meta diária
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Botões de Adicionar Água */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Plus className="w-6 h-6 text-green-500" />
                                    Adicionar Água
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Escolha o tamanho do copo ou garrafa
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {waterSizes.map((size, index) => (
                                        <motion.div
                                            key={size.amount}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={() => addWater(size.amount)}
                                                variant="outline"
                                                className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                            >
                                                <span className="text-2xl">{size.icon}</span>
                                                <div className="text-center">
                                                    <div className="text-sm font-medium">{size.label}</div>
                                                    <div className="text-xs text-muted-foreground">{size.amount}ml</div>
                                                </div>
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t">
                                    <Button
                                        onClick={resetDaily}
                                        variant="ghost"
                                        className="w-full h-12 flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Resetar Dia
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Estatísticas e Conquistas */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Status da Meta */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Target className="w-6 h-6 text-green-500" />
                                    Status da Meta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <AnimatePresence mode="wait">
                                    {isGoalReached ? (
                                        <motion.div
                                            key="completed"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="space-y-3"
                                        >
                                            <div className="text-6xl">🎉</div>
                                            <div className="text-green-600 font-bold text-lg">Meta Atingida!</div>
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                Parabéns!
                                            </Badge>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="progress"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="space-y-3"
                                        >
                                            <div className="text-4xl">💪</div>
                                            <div className="text-muted-foreground">
                                                Faltam <span className="font-bold text-blue-600">
                                                    {waterData.goal - waterData.consumed}ml
                                                </span>
                                            </div>
                                            <Badge variant="outline">
                                                Continue Bebendo!
                                            </Badge>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>

                        {/* Streak e Conquistas */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Trophy className="w-6 h-6 text-yellow-500" />
                                    Conquistas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">{streakBadge.icon}</div>
                                    <Badge className={`${streakBadge.color} text-white border-0 mb-2`}>
                                        {streakBadge.label}
                                    </Badge>
                                    <div className="text-2xl font-bold text-foreground">
                                        {waterData.streak} dias
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        sequência atual
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">Hoje</span>
                                        </div>
                                        <Badge variant="outline">
                                            {waterData.todayGlasses} copos
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">Última atualização</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date().toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Dicas de Hidratação */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                <TrendingUp className="w-6 h-6 text-blue-500" />
                                Dicas de Hidratação
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="space-y-2">
                                    <div className="text-3xl">🌅</div>
                                    <h3 className="font-semibold">Comece o dia</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Beba um copo de água logo ao acordar
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl">⏰</div>
                                    <h3 className="font-semibold">Intervalos regulares</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Beba água a cada 2 horas durante o dia
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl">🍽️</div>
                                    <h3 className="font-semibold">Antes das refeições</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Um copo 30 minutos antes de comer
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default WaterReminder;