import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2, CheckCircle } from 'lucide-react';

export interface ChecklistItemType {
    id: string;
    text: string;
    completed: boolean;
}

interface ChecklistItemProps {
    item: ChecklistItemType;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const ChecklistItem = ({ item, onToggle, onDelete }: ChecklistItemProps) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        show: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
    };

    return (
        <motion.li
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-xl border-0 transition-all duration-300 hover:scale-[1.02] ${
                item.completed
                    ? 'bg-gradient-to-r from-green-800/40 to-emerald-800/40 shadow-lg shadow-green-500/10'
                    : 'bg-gradient-to-r from-slate-800/40 to-gray-800/40 hover:from-indigo-800/40 hover:to-purple-800/40 shadow-lg hover:shadow-purple-500/10'
            }`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Checkbox
                            id={`item-${item.id}`}
                            checked={item.completed}
                            onCheckedChange={() => onToggle(item.id)}
                            className="border-2 border-purple-400/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 data-[state=checked]:border-green-500"
                        />
                        {item.completed && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1"
                            >
                                <CheckCircle size={14} className="text-green-400" />
                            </motion.div>
                        )}
                    </div>

                    <Label
                        htmlFor={`item-${item.id}`}
                        className={`${
                            item.completed
                                ? 'line-through text-green-300/70'
                                : 'text-white group-hover:text-purple-200'
                        } 
            transition-all cursor-pointer select-none font-medium text-base`}
                    >
                        {item.text}
                    </Label>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all hover:scale-110 rounded-lg"
                >
                    <Trash2 size={18} />
                </Button>
            </div>

            {item.completed && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400"
                />
            )}
        </motion.li>
    );
};

export default ChecklistItem;