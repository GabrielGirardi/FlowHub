import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, CheckCircle, ListTodo, Target, Trophy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            return JSON.parse(savedTodos);
        }
        return [];
    });
    const [newTodo, setNewTodo] = useState('');
    const { toast } = useToast();

    const saveTodos = (updatedTodos: Todo[]) => {
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
        setTodos(updatedTodos);
    };

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim() === '') return;

        const todo = {
            id: Date.now().toString(),
            text: newTodo.trim(),
            completed: false
        };

        const updatedTodos = [...todos, todo];
        saveTodos(updatedTodos);
        setNewTodo('');

        toast({
            title: "Tarefa adicionada",
            description: "Nova tarefa criada com sucesso.",
        });
    };

    const toggleTodo = (id: string) => {
        const updatedTodos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveTodos(updatedTodos);
    };

    const deleteTodo = (id: string) => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        saveTodos(updatedTodos);

        toast({
            title: "Tarefa removida",
            description: "A tarefa foi excluída com sucesso.",
        });
    };

    const completedTodos = todos.filter(todo => todo.completed);
    const pendingTodos = todos.filter(todo => !todo.completed);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    const todoItem = {
        hidden: { x: -20, opacity: 0 },
        show: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 }
    };

    return (
        <div className="py-8 px-4 max-w-6xl mx-auto">
            <motion.div
                className="relative text-center mb-16 py-20 rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-3xl blur-sm opacity-50"></div>

                <div className="relative z-10">
                    <motion.div
                        className="mb-6 flex justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    >
                        <div className="relative inline-block">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-md opacity-75"></div>
                            <div className="relative flex items-center justify-center bg-background rounded-full p-6 border border-border shadow-md">
                                <ListTodo size={48} className="text-primary" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Lista de Tarefas
                    </motion.h1>

                    <motion.p
                        className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Organize suas tarefas de forma simples e eficiente.
                        Mantenha o foco no que realmente importa.
                    </motion.p>

                    {/* Stats Cards */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                            <div className="text-2xl font-bold text-primary">{todos.length}</div>
                            <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                            <div className="text-2xl font-bold text-orange-500">{pendingTodos.length}</div>
                            <div className="text-sm text-muted-foreground">Pendentes</div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                            <div className="text-2xl font-bold text-green-500">{completedTodos.length}</div>
                            <div className="text-sm text-muted-foreground">Concluídas</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="show"
                variants={container}
                className="space-y-8"
            >
                {/* Add Todo Card */}
                <motion.div variants={item}>
                    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-card/80 to-card">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle className="flex items-center text-foreground">
                                <div className="p-2 rounded-md bg-primary/10 text-primary mr-3">
                                    <Plus size={20} />
                                </div>
                                Nova Tarefa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={addTodo} className="flex gap-3">
                                <Input
                                    placeholder="Digite sua tarefa aqui..."
                                    value={newTodo}
                                    onChange={(e) => setNewTodo(e.target.value)}
                                    className="flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                />
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Adicionar
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <motion.div variants={item}>
                        <Card className="overflow-hidden border-0 shadow-lg h-full">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-md bg-orange-500/10 text-orange-500 mr-3">
                                            <Target size={20} />
                                        </div>
                                        <span>Tarefas Pendentes</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                                        {pendingTodos.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <AnimatePresence>
                                    {pendingTodos.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12"
                                        >
                                            <CheckCircle size={64} className="mx-auto text-green-400 mb-4 opacity-50" />
                                            <p className="text-muted-foreground text-lg">Nenhuma tarefa pendente!</p>
                                            <p className="text-muted-foreground/70 text-sm mt-2">Que tal adicionar uma nova tarefa?</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div className="space-y-3" variants={container}>
                                            {pendingTodos.map(todo => (
                                                <motion.div
                                                    key={todo.id}
                                                    variants={todoItem}
                                                    initial="hidden"
                                                    animate="show"
                                                    exit="exit"
                                                    layout
                                                    className="group"
                                                >
                                                    <div className="flex items-center justify-between p-4 border border-orange-500/10 rounded-xl hover:bg-orange-500/5 transition-all duration-200 hover:border-orange-500/20 hover:shadow-md">
                                                        <div className="flex items-center space-x-3 flex-1">
                                                            <Checkbox
                                                                id={`todo-${todo.id}`}
                                                                checked={todo.completed}
                                                                onCheckedChange={() => toggleTodo(todo.id)}
                                                                className="border-orange-300 data-[state=checked]:bg-orange-500"
                                                            />
                                                            <Label
                                                                htmlFor={`todo-${todo.id}`}
                                                                className="cursor-pointer flex-1 font-medium group-hover:text-orange-600 transition-colors"
                                                            >
                                                                {todo.text}
                                                            </Label>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteTodo(todo.id)}
                                                            className="text-red-400 hover:text-red-600 hover:bg-red-50/50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="overflow-hidden border-0 shadow-lg h-full">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-md bg-green-500/10 text-green-500 mr-3">
                                            <Trophy size={20} />
                                        </div>
                                        <span>Tarefas Concluídas</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                                        {completedTodos.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <AnimatePresence>
                                    {completedTodos.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12"
                                        >
                                            <Trophy size={64} className="mx-auto text-muted-foreground/30 mb-4" />
                                            <p className="text-muted-foreground text-lg">Nenhuma tarefa concluída ainda</p>
                                            <p className="text-muted-foreground/70 text-sm mt-2">Complete suas tarefas para vê-las aqui!</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div className="space-y-3" variants={container}>
                                            {completedTodos.map(todo => (
                                                <motion.div
                                                    key={todo.id}
                                                    variants={todoItem}
                                                    initial="hidden"
                                                    animate="show"
                                                    exit="exit"
                                                    layout
                                                    className="group"
                                                >
                                                    <div className="flex items-center justify-between p-4 border border-green-500/10 rounded-xl bg-green-500/5 hover:bg-green-500/10 transition-all duration-200 hover:border-green-500/20 hover:shadow-md">
                                                        <div className="flex items-center space-x-3 flex-1">
                                                            <Checkbox
                                                                id={`todo-${todo.id}`}
                                                                checked={todo.completed}
                                                                onCheckedChange={() => toggleTodo(todo.id)}
                                                                className="border-green-300 data-[state=checked]:bg-green-500"
                                                            />
                                                            <Label
                                                                htmlFor={`todo-${todo.id}`}
                                                                className="line-through text-muted-foreground cursor-pointer flex-1"
                                                            >
                                                                {todo.text}
                                                            </Label>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteTodo(todo.id)}
                                                            className="text-red-400 hover:text-red-600 hover:bg-red-50/50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default TodoList;