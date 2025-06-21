import CodeHighlighter from "@/components/syntax-highlighter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mimic } from "@/lib/mimic";
import { motion } from "framer-motion";
import {
  Clipboard,
  Code,
  FileText,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

type CodeSnippet = {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
};

const CodeSnippets = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    const savedSnippets = localStorage.getItem("codeSnippets");
    if (savedSnippets) {
      return JSON.parse(savedSnippets);
    }
    return [
      {
        id: "1",
        title: "Hello World em JavaScript",
        description: "Um simples Hello World em JavaScript",
        code: 'console.log("Hello World!");',
        language: "javascript",
      },
      {
        id: "2",
        title: "Fetch API",
        description: "Exemplo de uso da Fetch API",
        code: `async function fetchData() {
                  try {
                    const response = await fetch('https://api.example.com/data');
                    const data = await response.json();
                    return data;
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
                }`,
        language: "javascript",
      },
    ];
  });

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState("view");
  const [searchTerm, setSearchTerm] = useState("");

  const [newSnippet, setNewSnippet] = useState<Omit<CodeSnippet, "id">>({
    title: "",
    description: "",
    code: "",
    language: "javascript",
  });

  const { toast } = useToast();

  const saveSnippets = (updatedSnippets: CodeSnippet[]) => {
    localStorage.setItem("codeSnippets", JSON.stringify(updatedSnippets));
    setSnippets(updatedSnippets);
  };

  const handleAddSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) {
      toast({
        title: "Campos incompletos",
        description: "Título e código são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      ...newSnippet,
    };

    saveSnippets([...snippets, snippet]);

    setNewSnippet({
      title: "",
      description: "",
      code: "",
      language: "javascript",
    });

    setActiveTab("view");

    toast({
      title: "Snippet adicionado",
      description: "Seu snippet de código foi salvo com sucesso.",
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado!",
      description: "O código foi copiado para a área de transferência.",
    });
  };

  const handleDeleteSnippet = (id: string) => {
    const updatedSnippets = snippets.filter((snippet) => snippet.id !== id);
    saveSnippets(updatedSnippets);

    toast({
      title: "Snippet removido",
      description: "O snippet foi excluído com sucesso.",
    });
  };

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const MotionCard = motion(Card);

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mb-16 text-center"
      >
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 -z-10"
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-5 rounded-3xl blur-3xl"></div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30"></div>
            <div className="relative flex items-center justify-center bg-background rounded-full p-8 border border-border shadow-xl">
              <Code size={48} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
        >
          Code Snippets
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Organize e acesse seus trechos de código mais utilizados
        </motion.p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <Code className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {snippets.length}
              </div>
              <p className="text-sm text-blue-600/80">Total de Snippets</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <Search className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {filteredSnippets.length}
              </div>
              <p className="text-sm text-purple-600/80">Resultados da Busca</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20 border-pink-200 dark:border-pink-800">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-pink-600">
                {new Set(snippets.map((s) => s.language)).size}
              </div>
              <p className="text-sm text-pink-600/80">Linguagens</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="view" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ver Snippets
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Novo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <Card className="border-2 border-primary/20 overflow-hidden bg-card/80 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      Pesquisar Snippets
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="text-xs"
                    >
                      Tema: {theme === "dark" ? "Escuro" : "Claro"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar snippet por título ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border-primary/20 focus-visible:ring-primary/30"
                    />
                  </div>
                </CardContent>
                {searchTerm && (
                  <CardFooter className="py-2 px-6 border-t bg-muted/20 flex justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Filtrando por: "{searchTerm}"
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setSearchTerm("")}
                    >
                      Limpar
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>

            {filteredSnippets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-card/50 rounded-xl border border-border"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl"></div>
                  <div className="relative">
                    <FileText
                      size={64}
                      className="mx-auto text-muted-foreground/50 mb-6"
                    />
                    <h3 className="text-2xl font-semibold mb-2">
                      {searchTerm
                        ? "Nenhum snippet encontrado"
                        : "Nenhum snippet cadastrado"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                      {searchTerm
                        ? `Não encontramos snippets para "${searchTerm}". Tente outros termos ou adicione um novo snippet.`
                        : "Você ainda não tem snippets salvos. Adicione seu primeiro snippet de código."}
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => setActiveTab("add")}
                        size="lg"
                        className="px-8"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Adicionar Snippet
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="grid gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredSnippets.map((snippet) => (
                  <motion.div key={snippet.id} variants={item}>
                    <MotionCard
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30 bg-card/80 backdrop-blur-sm "
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <CardHeader className="pb-3 relative border-b border-border/50">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-2">
                            <CardTitle className="text-xl">
                              {snippet.title}
                            </CardTitle>
                            {snippet.description && (
                              <CardDescription className="text-base">
                                {snippet.description}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Badge
                              variant="outline"
                              className="bg-primary/5 text-primary text-xs px-3 py-1"
                            >
                              {mimic.pages.codeSnippets.languagesOptions.find(
                                (opt) => opt.value === snippet.language
                              )?.label || snippet.language}
                            </Badge>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCopyCode(snippet.code)}
                                className="h-9 w-9 hover:bg-primary/10 hover:border-primary/30"
                              >
                                <Clipboard className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteSnippet(snippet.id)}
                                className="text-muted-foreground hover:text-destructive hover:border-destructive/30 h-9 w-9"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 overflow-hidden max-w-7xl">
                        <div className="relative rounded-md overflow-hidden">
                          <CodeHighlighter
                            code={snippet.code}
                            language={snippet.language}
                            theme={theme}
                          />
                        </div>
                      </CardContent>
                    </MotionCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    Adicionar Novo Snippet
                  </CardTitle>
                  <CardDescription className="text-base">
                    Salve trechos de código para reutilização futura
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        placeholder="Título do snippet"
                        value={newSnippet.title}
                        onChange={(e) =>
                          setNewSnippet({
                            ...newSnippet,
                            title: e.target.value,
                          })
                        }
                        className="border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição (opcional)</Label>
                      <Input
                        id="description"
                        placeholder="Descrição do snippet"
                        value={newSnippet.description}
                        onChange={(e) =>
                          setNewSnippet({
                            ...newSnippet,
                            description: e.target.value,
                          })
                        }
                        className="border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Linguagem</Label>
                      <Select
                        value={newSnippet.language}
                        onValueChange={(value) =>
                          setNewSnippet({
                            ...newSnippet,
                            language: value,
                          })
                        }
                      >
                        <SelectTrigger className="border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Selecione uma linguagem" />
                        </SelectTrigger>
                        <SelectContent>
                          {mimic.pages.codeSnippets.languagesOptions.map(
                            (option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="code">Código</Label>
                      <Textarea
                        id="code"
                        placeholder="Cole seu código aqui"
                        value={newSnippet.code}
                        onChange={(e) =>
                          setNewSnippet({
                            ...newSnippet,
                            code: e.target.value,
                          })
                        }
                        className="font-mono min-h-[200px] border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>

                    {newSnippet.code && (
                      <div className="space-y-2 border-t border-border pt-4 mt-6">
                        <Label>Pré-visualização</Label>
                        <div className="bg-accent/30 rounded-md p-1">
                          <CodeHighlighter
                            code={newSnippet.code}
                            language={newSnippet.language}
                            theme={theme}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pt-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleAddSnippet}
                        className="w-full py-3 text-lg font-medium"
                        size="lg"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Salvar Snippet
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-12 p-8 border border-border rounded-xl bg-card/50 text-center relative overflow-hidden"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-sm opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-3">
            Organize seus códigos favoritos
          </h2>
          <p className="text-muted-foreground">
            Guarde seus snippets de código mais utilizados para reutilizá-los
            facilmente.
            <br />
            <span className="text-sm text-muted-foreground/80">
              Os snippets ficam salvos no armazenamento local do seu navegador.
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeSnippets;
