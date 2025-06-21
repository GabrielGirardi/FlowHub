import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    FileJson,
    Clipboard,
    Check,
    Indent,
    AlignJustify,
    ArrowRightLeft,
    Code,
    Braces
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const JsonFormatter = () => {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [indent, setIndent] = useState(2);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<"format" | "minify" | "validate">("format");
    const { toast } = useToast();

    const formatJson = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                setError(null);
                return;
            }

            const parsedJson = JSON.parse(input);
            setOutput(JSON.stringify(parsedJson, null, indent));
            setError(null);

            toast({
                title: "JSON formatado com sucesso!",
                description: "Seu código JSON foi formatado corretamente.",
            });
        } catch (err) {
            setError(`Erro ao analisar JSON: ${(err as Error).message}`);
            setOutput("");

            toast({
                title: "Erro ao formatar JSON",
                description: (err as Error).message,
                variant: "destructive",
            });
        }
    };

    const minifyJson = () => {
        try {
            if (!input.trim()) {
                setOutput("");
                setError(null);
                return;
            }

            const parsedJson = JSON.parse(input);
            setOutput(JSON.stringify(parsedJson));
            setError(null);

            toast({
                title: "JSON minificado com sucesso!",
                description: "Seu código JSON foi minificado corretamente.",
            });
        } catch (err) {
            setError(`Erro ao analisar JSON: ${(err as Error).message}`);
            setOutput("");

            toast({
                title: "Erro ao minificar JSON",
                description: (err as Error).message,
                variant: "destructive",
            });
        }
    };

    const validateJson = () => {
        try {
            if (!input.trim()) {
                toast({
                    title: "Entrada vazia",
                    description: "Por favor, insira algum código JSON para validar.",
                    variant: "destructive",
                });
                return;
            }

            JSON.parse(input);
            toast({
                title: "JSON válido!",
                description: "Seu código JSON é válido.",
            });
            setError(null);
        } catch (err) {
            toast({
                title: "JSON inválido",
                description: (err as Error).message,
                variant: "destructive",
            });
            setError(`Erro ao validar JSON: ${(err as Error).message}`);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);

        toast({
            title: "Copiado para a área de transferência",
            description: "O JSON formatado foi copiado.",
        });

        setTimeout(() => setCopied(false), 2000);
    };

    const swapInputOutput = () => {
        if (output) {
            setInput(output);
            setOutput("");
        }
    };

    const loadSampleJson = () => {
        const sample = {
            name: "John Doe",
            age: 30,
            isActive: true,
            address: {
                street: "123 Main St",
                city: "Anytown",
                country: "USA"
            },
            tags: ["developer", "designer", "manager"],
            projects: [
                {
                    id: 1,
                    name: "Website Redesign",
                    completed: true
                },
                {
                    id: 2,
                    name: "Mobile App",
                    completed: false
                }
            ]
        };

        setInput(JSON.stringify(sample, null, 2));
    };

    const handleProcessAction = () => {
        if (activeTab === "format") {
            formatJson();
        } else if (activeTab === "minify") {
            minifyJson();
        } else {
            validateJson();
        }
    };

    // Animations
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

    return (
        <motion.div
            className="max-w-5xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div
                variants={item}
                className="flex items-center gap-3 mb-8"
            >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <FileJson size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Formatador JSON</h1>
                    <p className="text-muted-foreground">Formate, minifique e valide seu código JSON</p>
                </div>
            </motion.div>

            <motion.div variants={item} className="mb-6">
                <Tabs defaultValue="format" className="w-full" onValueChange={(value) => setActiveTab(value as "format" | "minify" | "validate")}>
                    <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="format" className="flex items-center gap-2">
                            <Indent className="h-4 w-4" />
                            <span>Formatar</span>
                        </TabsTrigger>
                        <TabsTrigger value="minify" className="flex items-center gap-2">
                            <AlignJustify className="h-4 w-4" />
                            <span>Minificar</span>
                        </TabsTrigger>
                        <TabsTrigger value="validate" className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            <span>Validar</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={item}>
                    <Card className="border-2 border-primary/20 h-full flex flex-col">
                        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                Entrada JSON
                            </CardTitle>
                            <CardDescription>Cole seu código JSON para processar</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 flex-grow">
                            <div className="space-y-4 h-full flex flex-col">
                                <Textarea
                                    placeholder="Cole seu JSON aqui..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[300px] font-mono text-sm resize-none flex-grow border-primary/20 focus-visible:ring-primary/30"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between border-t pt-4">
                            <Button variant="outline" onClick={loadSampleJson} size="sm">
                                Carregar Exemplo
                            </Button>

                            <Button
                                variant="default"
                                onClick={handleProcessAction}
                                disabled={!input.trim()}
                                size="sm"
                                className="transition-transform hover:scale-105"
                            >
                                {activeTab === "format" && (
                                    <>
                                        <Indent className="mr-2 h-4 w-4" />
                                        Formatar
                                    </>
                                )}
                                {activeTab === "minify" && (
                                    <>
                                        <AlignJustify className="mr-2 h-4 w-4" />
                                        Minificar
                                    </>
                                )}
                                {activeTab === "validate" && (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Validar
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-2 border-primary/20 h-full flex flex-col">
                        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Braces className="h-5 w-5" />
                                        Saída JSON
                                    </CardTitle>
                                    <CardDescription>Resultado do processamento</CardDescription>
                                </div>
                                {output && (
                                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="transition-all hover:bg-primary/10">
                                        {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Clipboard className="h-4 w-4 mr-2" />}
                                        {copied ? "Copiado!" : "Copiar"}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 flex-grow">
                            <div className="relative h-full flex flex-col">
                                <Textarea
                                    value={output}
                                    readOnly
                                    className="min-h-[300px] font-mono text-sm bg-accent/30 resize-none flex-grow"
                                    placeholder="JSON processado aparecerá aqui..."
                                />

                                {error && (
                                    <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
                                        <p className="font-medium mb-1">Erro detectado:</p>
                                        {error}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between border-t pt-4">
                            <Button
                                variant="outline"
                                onClick={swapInputOutput}
                                disabled={!output}
                                size="sm"
                            >
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                Usar como Entrada
                            </Button>

                            <div className="flex space-x-2 items-center">
                                <Badge variant="outline" className="bg-primary/5">
                                    Indentação: {indent} espaços
                                </Badge>

                                <Tabs defaultValue="2" className="inline-flex">
                                    <TabsList className="h-8">
                                        <TabsTrigger value="2" onClick={() => setIndent(2)} className="text-xs px-2 h-8">2</TabsTrigger>
                                        <TabsTrigger value="4" onClick={() => setIndent(4)} className="text-xs px-2 h-8">4</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>

            <motion.div variants={item} className="mt-8">
                <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                        <CardTitle>Sobre o Formatador JSON</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center text-center p-4 hover:bg-accent/20 rounded-lg transition-all">
                                <div className="rounded-full bg-primary/10 p-3 text-primary mb-3">
                                    <Indent className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Formatação</h3>
                                <p className="text-muted-foreground text-sm">
                                    Formata seu JSON com indentação consistente para melhorar a legibilidade.
                                    Escolha entre 2 ou 4 espaços para indentação.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 hover:bg-accent/20 rounded-lg transition-all">
                                <div className="rounded-full bg-primary/10 p-3 text-primary mb-3">
                                    <AlignJustify className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Minificação</h3>
                                <p className="text-muted-foreground text-sm">
                                    Remove todos os espaços em branco desnecessários para reduzir o tamanho do JSON,
                                    ideal para produção ou transferência de dados.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 hover:bg-accent/20 rounded-lg transition-all">
                                <div className="rounded-full bg-primary/10 p-3 text-primary mb-3">
                                    <Check className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Validação</h3>
                                <p className="text-muted-foreground text-sm">
                                    Verifica se seu JSON está sintaticamente correto e identifica erros
                                    específicos para ajudar na depuração.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default JsonFormatter;