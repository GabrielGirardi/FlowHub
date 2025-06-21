import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AddItemFormProps {
    onAddItem: (text: string) => void;
}

const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
    const [newItem, setNewItem] = useState('');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim() === '') return;

        onAddItem(newItem.trim());
        setNewItem('');

        toast({
            title: "✨ Item adicionado!",
            description: "Novo item adicionado à sua checklist de deploy.",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
        >
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-900/80 to-teal-900/80 backdrop-blur-sm border-0 shadow-2xl shadow-emerald-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"></div>

                <CardHeader className="relative z-10 pb-4">
                    <CardTitle className="flex items-center gap-3 text-white">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        Adicionar Novo Item
                    </CardTitle>
                    <p className="text-emerald-200/80 ml-11">
                        Personalize sua checklist com itens específicos do seu projeto
                    </p>
                </CardHeader>

                <CardContent className="relative z-10">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <Input
                            placeholder="Ex: Verificar configurações de produção..."
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            className="flex-1 bg-white/10 border-emerald-400/30 text-white placeholder:text-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400/20 backdrop-blur-sm"
                        />
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium px-6 shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AddItemForm;