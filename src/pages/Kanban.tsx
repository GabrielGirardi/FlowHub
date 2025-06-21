import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mimic } from "@/lib/mimic";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  MoreVertical,
  Plus,
  Save,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const Kanban = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    const savedTasks = localStorage.getItem("kanban-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [newTask, setNewTask] = useState<Partial<KanbanTask>>({
    title: "",
    description: "",
    priority: "medium",
    column: "todo",
    dueDate: "",
  });
  const [collapsedColumns, setCollapsedColumns] = useState<
    Record<string, boolean>
  >({});

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title?.trim()) {
      toast({
        title: "Título necessário",
        description: "Por favor, forneça um título para a tarefa.",
        variant: "destructive",
      });
      return;
    }

    const task: KanbanTask = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description?.trim() || "",
      priority: (newTask.priority as TaskPriority) || "medium",
      column: (newTask.column as KanbanColumn) || "todo",
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || undefined,
    };

    setTasks([...tasks, task]);
    setIsAddDialogOpen(false);
    resetNewTask();

    toast({
      title: "Tarefa adicionada",
      description: "Sua tarefa foi criada com sucesso.",
    });
  };

  const updateTask = () => {
    if (!selectedTask) return;

    if (!newTask.title?.trim()) {
      toast({
        title: "Título necessário",
        description: "Por favor, forneça um título para a tarefa.",
        variant: "destructive",
      });
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === selectedTask.id) {
        return {
          ...task,
          title: newTask.title?.trim() || task.title,
          description: newTask.description?.trim() || task.description,
          priority: (newTask.priority as TaskPriority) || task.priority,
          dueDate: newTask.dueDate || task.dueDate,
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setIsEditDialogOpen(false);
    setSelectedTask(null);

    toast({
      title: "Tarefa atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setSelectedTask(null);
    setIsEditDialogOpen(false);

    toast({
      title: "Tarefa removida",
      description: "A tarefa foi excluída com sucesso.",
    });
  };

  const moveTask = (taskId: string, targetColumn: KanbanColumn) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, column: targetColumn };
      }
      return task;
    });

    setTasks(updatedTasks);

    toast({
      title: "Tarefa movida",
      description: `A tarefa foi movida para ${
        mimic.pages.kanban.columnsConfig.find((col) => col.id === targetColumn)
          ?.title
      }.`,
    });
  };

  const resetNewTask = () => {
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      column: "todo",
      dueDate: "",
    });
  };

  const openEditDialog = (task: KanbanTask) => {
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      column: task.column,
      dueDate: task.dueDate || "",
    });
    setIsEditDialogOpen(true);
  };

  const toggleColumnCollapse = (columnId: KanbanColumn) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const tasksByColumn = mimic.pages.kanban.columnsConfig.reduce<
    Record<string, KanbanTask[]>
  >((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.column === column.id);
    return acc;
  }, {});

  // Cálculo de estatísticas
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.column === "done").length;
  const inProgressTasks = tasks.filter(
    (task) => task.column === "inProgress"
  ).length;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high" && task.column !== "done"
  ).length;
  const completionRate =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header com efeito parallax */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative container mx-auto max-w-7xl px-4 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
              <BarChart3 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-4">
              Quadro Kanban
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Gerencie suas tarefas de forma visual e organizada com nosso
              sistema Kanban intuitivo
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto max-w-7xl px-4 -mt-8">
        {/* Cards de Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Total de Tarefas
                  </p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {totalTasks}
                  </p>
                </div>
                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Concluídas
                  </p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {doneTasks}
                  </p>
                </div>
                <div className="p-3 bg-green-200 dark:bg-green-800 rounded-full">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                    Em Progresso
                  </p>
                  <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                    {inProgressTasks}
                  </p>
                </div>
                <div className="p-3 bg-yellow-200 dark:bg-yellow-800 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Taxa de Conclusão
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {completionRate}%
                  </p>
                </div>
                <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botão de Nova Tarefa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-2xl font-semibold">Quadro de Tarefas</h2>
            <p className="text-muted-foreground">
              Arraste e solte as tarefas entre as colunas
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
          >
            <Plus size={18} className="mr-2" /> Nova Tarefa
          </Button>
        </motion.div>

        {/* Colunas do Kanban */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {mimic.pages.kanban.columnsConfig.map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <Card className="h-full flex flex-col border-0 shadow-lg overflow-hidden">
                <CardHeader className={`${column.bgColor} border-b`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-md bg-white/50 dark:bg-black/20 mr-3`}
                      >
                        <column.icon className={`h-5 w-5 ${column.color}`} />
                      </div>
                      <div>
                        <CardTitle className={`text-lg ${column.color}`}>
                          {column.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {tasksByColumn[column.id]?.length || 0} tarefas
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleColumnCollapse(column.id)}
                    >
                      {collapsedColumns[column.id] ? (
                        <ChevronDown size={16} className={column.color} />
                      ) : (
                        <ChevronUp size={16} className={column.color} />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {!collapsedColumns[column.id] && (
                  <CardContent
                    className="flex-grow overflow-y-auto p-4"
                    style={{ maxHeight: "calc(100vh - 400px)" }}
                  >
                    <div className="space-y-3">
                      {tasksByColumn[column.id]?.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center"
                        >
                          <div
                            className={`inline-flex p-3 rounded-full ${column.bgColor} mb-3`}
                          >
                            <column.icon
                              className={`h-6 w-6 ${column.color}`}
                            />
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Nenhuma tarefa nesta coluna
                          </p>
                        </motion.div>
                      ) : (
                        tasksByColumn[column.id]?.map((task, taskIndex) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: taskIndex * 0.05,
                            }}
                          >
                            <KanbanTaskCard
                              task={task}
                              onEdit={() => openEditDialog(task)}
                              onDelete={() => deleteTask(task.id)}
                              onMove={(columnId) => moveTask(task.id, columnId)}
                            />
                          </motion.div>
                        ))
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-4 border-2 border-dashed border-muted-foreground/20 text-muted-foreground hover:border-primary/50 hover:text-primary"
                      onClick={() => {
                        resetNewTask();
                        setNewTask((prev) => ({ ...prev, column: column.id }));
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Plus size={16} className="mr-2" /> Adicionar Tarefa
                    </Button>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ... keep existing code (dialogs) */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px] text-primary">
            <DialogHeader>
              <DialogTitle>Adicionar nova tarefa</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da tarefa. Clique em salvar quando
                terminar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título
                </label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Título da tarefa"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Descreva a tarefa..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Prioridade
                  </label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        priority: value as TaskPriority,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="column" className="text-sm font-medium">
                    Coluna
                  </label>
                  <Select
                    value={newTask.column}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, column: value as KanbanColumn })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {mimic.pages.kanban.columnsConfig.map((column) => (
                        <SelectItem key={column.id} value={column.id}>
                          {column.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Data de entrega (opcional)
                </label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetNewTask();
                }}
              >
                Cancelar
              </Button>
              <Button onClick={addTask}>
                <Save size={16} className="mr-2" /> Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] text-primary">
            <DialogHeader>
              <DialogTitle>Editar tarefa</DialogTitle>
              <DialogDescription>
                Edite os detalhes da tarefa. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Título
                </label>
                <Input
                  id="edit-title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Título da tarefa"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="edit-description"
                  className="text-sm font-medium"
                >
                  Descrição
                </label>
                <Textarea
                  id="edit-description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Descreva a tarefa..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="edit-priority"
                    className="text-sm font-medium"
                  >
                    Prioridade
                  </label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        priority: value as TaskPriority,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-dueDate" className="text-sm font-medium">
                    Data de entrega
                  </label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <div className="flex w-full justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} className="mr-2" /> Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Esta tarefa será
                        permanentemente excluída.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          selectedTask && deleteTask(selectedTask.id)
                        }
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setSelectedTask(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={updateTask}>
                    <Save size={16} className="mr-2" /> Salvar
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface KanbanTaskCardProps {
  task: KanbanTask;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (columnId: KanbanColumn) => void;
}

const KanbanTaskCard = ({
  task,
  onEdit,
  onDelete,
  onMove,
}: KanbanTaskCardProps) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.column !== "done";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${
          isOverdue
            ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
            : "hover:border-primary/20"
        }`}
        onClick={onEdit}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit size={14} className="mr-2" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={task.column === "todo"}
                    onClick={() => onMove("todo")}
                  >
                    <ArrowLeft size={14} className="mr-2" /> Mover para A Fazer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={task.column === "inProgress"}
                    onClick={() => onMove("inProgress")}
                  >
                    <Clock size={14} className="mr-2" /> Mover para Em Progresso
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={task.column === "review"}
                    onClick={() => onMove("review")}
                  >
                    <Edit size={14} className="mr-2" /> Mover para Em Revisão
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={task.column === "done"}
                    onClick={() => onMove("done")}
                  >
                    <Target size={14} className="mr-2" /> Mover para Concluído
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 size={14} className="mr-2" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex justify-between items-center">
            <Badge
              variant="outline"
              className={`text-xs font-medium ${
                mimic.pages.kanban.priorityConfig[task.priority].color
              }`}
            >
              {mimic.pages.kanban.priorityConfig[task.priority].label}
            </Badge>

            {task.dueDate && (
              <div
                className={`text-xs flex items-center ${
                  isOverdue
                    ? "text-red-600 font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <Calendar size={12} className="mr-1" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Kanban;
