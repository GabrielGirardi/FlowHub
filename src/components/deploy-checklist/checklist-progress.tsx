import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target } from 'lucide-react';

interface ChecklistProgressProps {
    completedCount: number;
    totalCount: number;
}

const ChecklistProgress = ({ completedCount, totalCount }: ChecklistProgressProps) => {
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
        >
            <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm border-0 shadow-2xl shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>

                <CardHeader className="relative z-10 pb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-white text-xl">
                                    Progresso do Deploy
                                </CardTitle>
                                <p className="text-purple-200/80 text-sm">
                                    {completedCount} de {totalCount} itens concluídos
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                {Math.round(progress)}%
                            </div>
                            <div className="flex items-center gap-1 text-green-400 text-sm">
                                <Target size={14} />
                                <span>Meta: 100%</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                    <div className="relative w-full h-4 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{
                                type: "spring",
                                stiffness: 50,
                                duration: 1.2,
                                delay: 0.5
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </motion.div>
                    </div>

                    <div className="flex justify-between mt-3 text-sm">
                        <span className="text-purple-300/70">Início</span>
                        <span className="text-green-400 font-medium">
                          {progress === 100 ? "🎉 Pronto para deploy!" : "Em progresso..."}
                        </span>
                        <span className="text-purple-300/70">Deploy</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ChecklistProgress;