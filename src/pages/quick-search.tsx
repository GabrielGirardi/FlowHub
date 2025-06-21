import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    StickyNote,
    CheckSquare,
    Link,
    Calendar,
    Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchItem {
    id: string;
    title: string;
    content: string;
    type: "note" | "task" | "link";
    tags: string[];
    created: string;
    updated: string;
    priority?: "low" | "medium" | "high";
    completed?: boolean;
}

const STORAGE_KEY = "quick-search-items";

const QuickSearch = () => {
    const [items, setItems] = useState<SearchItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState<SearchItem | null>(null);
    const [newItem, setNewItem] = useState({
        title: "",
        content: "",
        type: "note" as SearchItem["type"],
        tags: "",
        priority: "medium" as SearchItem["priority"]
    });
    const { toast } = useToast();

    useEffect(() => {
        console.log("Carregando dados do localStorage...");
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY);
            if (savedItems) {
                const parsedItems = JSON.parse(savedItems);
                console.log("Dados carregados:", parsedItems);
                setItems(parsedItems);
            } else {
                console.log("Nenhum dado encontrado no localStorage");
            }
        } catch (error) {
            console.error("Erro ao carregar dados do localStorage:", error);
        }
    }, []);

    useEffect(() => {
        console.log("Salvando dados no localStorage:", items);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
        }
    }, [items]);

    const filteredItems = items.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.title.toLowerCase().includes(searchLower) ||
            item.content.toLowerCase().includes(searchLower) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    });

    const addItem = () => {
        if (!newItem.title.trim()) {
            toast({
                title: "Erro",
                description: "O título é obrigatório",
                variant: "destructive"
            });
            return;
        }

        const item: SearchItem = {
            id: Date.now().toString(),
            title: newItem.title.trim(),
            content: newItem.content.trim(),
            type: newItem.type,
            tags: newItem.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            priority: newItem.priority,
            completed: newItem.type === "task" ? false : undefined
        };

        console.log("Adicionando novo item:", item);
        setItems(prev => [...prev, item]);
        setNewItem({
            title: "",
            content: "",
            type: "note",
            tags: "",
            priority: "medium"
        });
        setShowAddForm(false);

        toast({
            title: "Item adicionado!",
            description: `${item.type === "note" ? "Nota" : item.type === "task" ? "Tarefa" : "Link"} criado com sucesso.`
        });
    };

    const startEdit = (item: SearchItem) => {
        console.log("Iniciando edição do item:", item);
        setEditingItem({ ...item });
    };

    const saveEdit = () => {
        if (!editingItem || !editingItem.title.trim()) {
            toast({
                title: "Erro",
                description: "O título é obrigatório",
                variant: "destructive"
            });
            return;
        }

        const updatedItem = {
            ...editingItem,
            title: editingItem.title.trim(),
            content: editingItem.content.trim(),
            tags: typeof editingItem.tags === 'string'
                // @ts-ignore
                ? editingItem.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
                : editingItem.tags,
            updated: new Date().toISOString()
        };

        console.log("Salvando edição:", updatedItem);
        setItems(prev => prev.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        ));
        setEditingItem(null);

        toast({
            title: "Item atualizado!",
            description: "Suas alterações foram salvas."
        });
    };

    const cancelEdit = () => {
        setEditingItem(null);
    };

    const deleteItem = (id: string) => {
        console.log("Deletando item:", id);
        setItems(prev => prev.filter(item => item.id !== id));
        toast({
            title: "Item removido",
            description: "O item foi excluído com sucesso."
        });
    };

    const toggleTaskComplete = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id && item.type === "task"
                ? { ...item, completed: !item.completed, updated: new Date().toISOString() }
                : item
        ));
    };

    const getTypeIcon = (type: SearchItem["type"]) => {
        switch (type) {
            case "note": return <StickyNote className="h-4 w-4" />;
            case "task": return <CheckSquare className="h-4 w-4" />;
            case "link": return <Link className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
            case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                            <Search size={32} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Busca Pessoal
                            </h1>
                            <p className="text-muted-foreground text-lg mt-2">
                                Organize suas notas, tarefas e links importantes
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar em suas notas, tarefas e links..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 text-lg bg-gradient-to-r from-background to-muted/20 border-border/50"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Item
                    </Button>
                </motion.div>

                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6"
                        >
                            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                                <CardHeader>
                                    <CardTitle>Adicionar Novo Item</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Título"
                                            value={newItem.title}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                                        />
                                        <select
                                            value={newItem.type}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as SearchItem["type"] }))}
                                            className="px-3 py-2 border border-border rounded-md bg-background"
                                        >
                                            <option value="note">Nota</option>
                                            <option value="task">Tarefa</option>
                                            <option value="link">Link</option>
                                        </select>
                                    </div>
                                    <Textarea
                                        placeholder="Conteúdo"
                                        value={newItem.content}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                                        rows={3}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Tags (separadas por vírgula)"
                                            value={newItem.tags}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
                                        />
                                        <select
                                            value={newItem.priority}
                                            onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as SearchItem["priority"] }))}
                                            className="px-3 py-2 border border-border rounded-md bg-background"
                                        >
                                            <option value="low">Baixa Prioridade</option>
                                            <option value="medium">Média Prioridade</option>
                                            <option value="high">Alta Prioridade</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" onClick={() => setShowAddForm(false)}>
                                            <X className="mr-2 h-4 w-4" />
                                            Cancelar
                                        </Button>
                                        <Button onClick={addItem}>
                                            <Save className="mr-2 h-4 w-4" />
                                            Salvar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                layout
                            >
                                <Card className="bg-gradient-to-br from-card to-card/30 border-border/50 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-6">
                                        {editingItem?.id === item.id ? (
                                            <div className="space-y-4">
                                                <Input
                                                    value={editingItem.title}
                                                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                                                    className="font-semibold"
                                                />
                                                <Textarea
                                                    value={editingItem.content}
                                                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, content: e.target.value } : null)}
                                                    rows={3}
                                                />
                                                <Input
                                                    value={Array.isArray(editingItem.tags) ? editingItem.tags.join(", ") : editingItem.tags}
                                                    // @ts-ignore
                                                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, tags: e.target.value } : null)}
                                                    placeholder="Tags (separadas por vírgula)"
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                                                        <X className="mr-2 h-4 w-4" />
                                                        Cancelar
                                                    </Button>
                                                    <Button size="sm" onClick={saveEdit}>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Salvar
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${
                                                            item.type === "note" ? "bg-blue-500/20 text-blue-400" :
                                                                item.type === "task" ? "bg-green-500/20 text-green-400" :
                                                                    "bg-purple-500/20 text-purple-400"
                                                        }`}>
                                                            {getTypeIcon(item.type)}
                                                        </div>
                                                        <div>
                                                            <h3 className={`text-lg font-semibold ${
                                                                item.type === "task" && item.completed ? "line-through text-muted-foreground" : ""
                                                            }`}>
                                                                {item.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(item.created).toLocaleDateString()}
                                                                {item.priority && (
                                                                    <>
                                                                        <Star className="h-3 w-3" />
                                                                        <Badge className={getPriorityColor(item.priority)}>
                                                                            {item.priority === "high" ? "Alta" : item.priority === "medium" ? "Média" : "Baixa"}
                                                                        </Badge>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {item.type === "task" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleTaskComplete(item.id)}
                                                                className={item.completed ? "text-green-500" : ""}
                                                            >
                                                                <CheckSquare className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => startEdit(item)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteItem(item.id)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {item.content && (
                                                    <p className="text-muted-foreground mb-3 whitespace-pre-wrap">
                                                        {item.content}
                                                    </p>
                                                )}

                                                {item.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.tags.map((tag, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {searchTerm ? "Nenhum resultado encontrado" : "Nenhum item ainda"}
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? "Tente usar outros termos de busca" : "Adicione sua primeira nota, tarefa ou link para começar"}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default QuickSearch;