import AddItemForm from "@/components/deploy-checklist/add-item-form";
import { ChecklistItemType } from "@/components/deploy-checklist/checklist-item";
import ChecklistItems from "@/components/deploy-checklist/checklist-items";
import ChecklistProgress from "@/components/deploy-checklist/checklist-progress";
import { useLocalStorage } from "@/hooks/use-local-storage.ts";
import { mimic } from "@/lib/mimic";
import { motion } from "framer-motion";
import { CheckSquare, Rocket } from "lucide-react";

const DeployChecklist = () => {
  const [items, setItems] = useLocalStorage<ChecklistItemType[]>(
    "deployChecklist",
    mimic.pages.deployChecklist.defaultItems
  );

  const addItem = (text: string) => {
    const newItem: ChecklistItemType = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const completedCount = items.filter((item) => item.completed).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center rounded-md p-2 gap-4 mb-6 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="relative"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/25">
                <Rocket size={40} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                Deploy Checklist
              </h1>
              <p className="text-xl text-purple-200/80">
                🚀 Prepare seu projeto para o lançamento perfeito
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/50 to-emerald-500/50 backdrop-blur-sm border border-green-400/30 rounded-full text-green-300"
          >
            <CheckSquare size={20} className="text-primary" />
            <span className="font-medium text-primary">
              {completedCount} de {items.length} concluídos
            </span>
          </motion.div>
        </motion.div>

        <ChecklistProgress
          completedCount={completedCount}
          totalCount={items.length}
        />

        <AddItemForm onAddItem={addItem} />

        <ChecklistItems
          items={items}
          onToggleItem={toggleItem}
          onDeleteItem={deleteItem}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-800/80 to-pink-800/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">
                ✨ Dica Pro
              </h3>
              <p className="text-purple-200/90 mb-2 text-lg">
                Mantenha sua checklist sempre atualizada para garantir deploys
                sem surpresas
              </p>
              <p className="text-sm text-purple-300/70">
                💾 Todas as alterações são salvas automaticamente no seu
                navegador
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeployChecklist;
