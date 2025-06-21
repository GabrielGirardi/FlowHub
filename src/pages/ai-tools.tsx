import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, Search, BookOpen, Code, MessageSquare, Image, Film, Music, Users, Bot, Sparkles, Heart, ArrowLeft, Timer } from "lucide-react";

type AITool = {
    id: string;
    name: string;
    description: string;
    url: string;
    image: string;
    category: string[];
    tags: string[];
    pricing: "Free" | "Freemium" | "Paid" | "Free Trial";
    rating?: number;
    featured?: boolean;
};

const aiTools: AITool[] = [
    {
        id: "chatgpt",
        name: "ChatGPT",
        description: "Assistente de IA conversacional avançado capaz de responder perguntas, auxiliar na escrita, explicar conceitos e muito mais.",
        url: "https://chat.openai.com/",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
        category: ["Chatbots", "Escrita", "Produtividade"],
        tags: ["IA Conversacional", "GPT", "OpenAI"],
        pricing: "Freemium",
        rating: 4.8,
        featured: true
    },
    {
        id: "lovable",
        name: "Lovable",
        description: "Plataforma que permite criar aplicativos web completos conversando com uma IA. Ideal para prototipar e desenvolver projetos rapidamente.",
        url: "https://lovable.dev",
        image: "https://cdn.lovable.dev/assets/lovable-icon.png",
        category: ["Desenvolvimento", "Design"],
        tags: ["Desenvolvimento Web", "No-Code", "Low-Code"],
        pricing: "Freemium",
        rating: 4.7,
        featured: true
    },
    {
        id: "midjourney",
        name: "Midjourney",
        description: "Ferramenta de geração de imagens por IA que cria ilustrações de alta qualidade a partir de descrições textuais.",
        url: "https://www.midjourney.com/",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
        category: ["Imagens", "Design"],
        tags: ["Geração de Imagens", "Arte Digital"],
        pricing: "Paid",
        rating: 4.9,
        featured: true
    },
    {
        id: "copilot",
        name: "GitHub Copilot",
        description: "Assistente de programação baseado em IA que ajuda a escrever código sugerindo linhas ou funções completas direto no seu editor.",
        url: "https://github.com/features/copilot",
        image: "https://github.gallerycdn.vsassets.io/extensions/github/copilot/1.143.0/1700156764630/Microsoft.VisualStudio.Services.Icons.Default",
        category: ["Desenvolvimento", "Produtividade"],
        tags: ["Assistente de Código", "GitHub", "Programação"],
        pricing: "Paid",
        rating: 4.8
    },
    {
        id: "perplexity",
        name: "Perplexity AI",
        description: "Mecanismo de pesquisa impulsionado por IA que fornece respostas detalhadas com citações de fontes, ideal para pesquisas aprofundadas.",
        url: "https://www.perplexity.ai/",
        image: "https://cdn.sanity.io/images/u0v1th4q/production/67045586fd9115ccb804bc7d6bee5ad2acf885c3-512x512.png",
        category: ["Pesquisa", "Conhecimento"],
        tags: ["Mecanismo de Busca", "Pesquisa IA"],
        pricing: "Freemium",
        rating: 4.6
    },
    {
        id: "claude",
        name: "Claude AI",
        description: "Assistente de IA da Anthropic que se destaca por respostas detalhadas, nuancadas e por seguir instruções complexas.",
        url: "https://claude.ai/",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_of_Claude_%28AI%29.svg/2048px-Logo_of_Claude_%28AI%29.svg.png",
        category: ["Chatbots", "Escrita", "Produtividade"],
        tags: ["IA Conversacional", "Anthropic"],
        pricing: "Freemium",
        rating: 4.7
    },
    {
        id: "v0",
        name: "v0.dev",
        description: "Ferramenta de geração de interfaces por IA que cria código React e Tailwind a partir de descrições textuais.",
        url: "https://v0.dev/",
        image: "https://v0.dev/apple-icon.png",
        category: ["Desenvolvimento", "Design"],
        tags: ["UI/UX", "React", "Tailwind"],
        pricing: "Free",
        rating: 4.5
    },
    {
        id: "dalle",
        name: "DALL-E",
        description: "Sistema de geração de imagens da OpenAI que cria imagens realistas e artísticas a partir de descrições textuais.",
        url: "https://openai.com/dall-e-3",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/DALL-E_Logo.png/800px-DALL-E_Logo.png",
        category: ["Imagens", "Design"],
        tags: ["Geração de Imagens", "OpenAI"],
        pricing: "Paid",
        rating: 4.8
    },
    {
        id: "huggingface",
        name: "Hugging Face",
        description: "Plataforma que oferece acesso a milhares de modelos de IA de código aberto para várias tarefas como NLP, visão computacional e mais.",
        url: "https://huggingface.co/",
        image: "https://avatars.githubusercontent.com/u/25720743?s=200&v=4",
        category: ["Desenvolvimento", "Pesquisa"],
        tags: ["Modelos de IA", "Open-Source", "NLP"],
        pricing: "Freemium",
        rating: 4.6
    },
    {
        id: "zapier",
        name: "Zapier AI",
        description: "Automatize tarefas com IA integrando centenas de aplicativos e criando fluxos de trabalho personalizados.",
        url: "https://zapier.com/ai",
        image: "https://cdn.sanity.io/images/ornj730p/production/e98e7e338de006d698f1094ebcac8a598f9d92bc-512x512.png",
        category: ["Automação", "Produtividade"],
        tags: ["Automação", "Integração"],
        pricing: "Freemium",
        rating: 4.5
    },
    {
        id: "codeium",
        name: "Codeium",
        description: "Alternativa gratuita ao GitHub Copilot, oferece autocompletar de código em vários editores e linguagens de programação.",
        url: "https://codeium.com/",
        image: "https://codeium.com/favicon.ico",
        category: ["Desenvolvimento"],
        tags: ["Assistente de Código", "IA para Programação"],
        pricing: "Free",
        rating: 4.4
    },
    {
        id: "elevenlabs",
        name: "ElevenLabs",
        description: "Plataforma de síntese de voz com IA que gera vozes humanas realistas em vários idiomas e estilos emocionais.",
        url: "https://elevenlabs.io/",
        image: "https://avatars.githubusercontent.com/u/121858069?s=200&v=4",
        category: ["Áudio", "Conteúdo"],
        tags: ["Síntese de Voz", "Text-to-Speech"],
        pricing: "Freemium",
        rating: 4.7
    }
];

const categories = [
    { id: "all", name: "Todos", icon: Sparkles },
    { id: "chatbots", name: "Chatbots", icon: MessageSquare },
    { id: "development", name: "Desenvolvimento", icon: Code },
    { id: "images", name: "Imagens", icon: Image },
    { id: "productivity", name: "Produtividade", icon: Users },
    { id: "research", name: "Pesquisa", icon: BookOpen },
    { id: "audio", name: "Áudio", icon: Music },
    { id: "video", name: "Vídeo", icon: Film }
];

const categoryMap: Record<string, string> = {
    all: "Todos",
    chatbots: "Chatbots",
    development: "Desenvolvimento",
    images: "Imagens",
    productivity: "Produtividade",
    research: "Pesquisa",
    audio: "Áudio",
    video: "Vídeo",
    favorites: "Favoritos"
};

const AITools = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [favoriteTools, setFavoriteTools] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('favorite-ai-tools');
        if (saved) {
            setFavoriteTools(JSON.parse(saved));
        }
    }, []);

    const saveFavorites = (favorites: string[]) => {
        setFavoriteTools(favorites);
        localStorage.setItem('favorite-ai-tools', JSON.stringify(favorites));
    };

    const handleToggleFavorite = (id: string) => {
        const newFavorites = favoriteTools.includes(id)
            ? favoriteTools.filter(toolId => toolId !== id)
            : [...favoriteTools, id];
        saveFavorites(newFavorites);
    };

    const filteredTools = aiTools.filter(tool => {
        const matchesSearch = searchTerm === "" ||
            tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
            activeCategory === "all" ||
            (activeCategory === "favorites" && favoriteTools.includes(tool.id)) ||
            tool.category.some(
                cat => cat.toLowerCase() === categoryMap[activeCategory]?.toLowerCase()
            );

        return matchesSearch && matchesCategory;
    });

    const featuredTools = filteredTools.filter(tool => tool.featured);
    const regularTools = filteredTools.filter(tool => !tool.featured);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/">
                                <ArrowLeft size={16} className="mr-2" />
                                Início
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/pomodoro">
                                <Timer size={16} className="mr-2" />
                                Pomodoro
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
                            Ferramentas de IA
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Descubra as melhores ferramentas de inteligência artificial para potencializar sua produtividade
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8 relative max-w-md mx-auto"
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Pesquisar ferramentas de IA..."
                        className="pl-10 h-12 text-base shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                        <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-center bg-muted/50 p-1 rounded-xl">
                            {categories.map(category => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                >
                                    <category.icon size={16} />
                                    <span className="whitespace-nowrap">{category.name}</span>
                                </TabsTrigger>
                            ))}
                            {favoriteTools.length > 0 && (
                                <TabsTrigger
                                    value="favorites"
                                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                >
                                    <Heart size={16} />
                                    <span className="whitespace-nowrap">Favoritos ({favoriteTools.length})</span>
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value={activeCategory} className="mt-8">
                            <AnimatePresence mode="wait">
                                {filteredTools.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-center py-16"
                                    >
                                        <div className="bg-muted/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                            <Bot size={48} className="text-muted-foreground/40" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Nenhuma ferramenta encontrada</h3>
                                        <p className="text-muted-foreground">
                                            {searchTerm
                                                ? "Tente ajustar sua pesquisa ou explorar outras categorias"
                                                : "Nenhuma ferramenta nesta categoria no momento"
                                            }
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-8">
                                        {featuredTools.length > 0 && activeCategory === "all" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                            >
                                                <div className="flex items-center gap-2 mb-6">
                                                    <Sparkles className="text-yellow-500" size={24} />
                                                    <h2 className="text-2xl font-bold">Em Destaque</h2>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                                    {featuredTools.map((tool, index) => (
                                                        <AIToolCard
                                                            key={tool.id}
                                                            tool={tool}
                                                            index={index}
                                                            isFavorite={favoriteTools.includes(tool.id)}
                                                            onToggleFavorite={() => handleToggleFavorite(tool.id)}
                                                            featured
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {(activeCategory !== "all" ? filteredTools : regularTools).length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.4 }}
                                            >
                                                {activeCategory === "all" && featuredTools.length > 0 && (
                                                    <h2 className="text-2xl font-bold mb-6">Todas as Ferramentas</h2>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                    {(activeCategory !== "all" ? filteredTools : regularTools).map((tool, index) => (
                                                        <AIToolCard
                                                            key={tool.id}
                                                            tool={tool}
                                                            index={index + (featuredTools.length || 0)}
                                                            isFavorite={favoriteTools.includes(tool.id)}
                                                            onToggleFavorite={() => handleToggleFavorite(tool.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </AnimatePresence>
                        </TabsContent>
                    </Tabs>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-16"
                >
                    <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="text-primary" size={24} />
                                Sobre as Ferramentas de IA
                            </CardTitle>
                            <CardDescription>
                                Conheça e acesse rapidamente as ferramentas de IA mais úteis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Esta página reúne uma curadoria das melhores ferramentas de inteligência artificial disponíveis atualmente.
                                Você pode filtrar por categoria, pesquisar por nome ou descrição, e favoritar suas ferramentas preferidas para acesso rápido.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Funcionalidades:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Filtros por categoria</li>
                                        <li>• Sistema de favoritos</li>
                                        <li>• Busca inteligente</li>
                                        <li>• Links diretos para as ferramentas</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Informações dos Cards:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Nome e descrição detalhada</li>
                                        <li>• Categorias e tags relacionadas</li>
                                        <li>• Modelo de preço e avaliações</li>
                                        <li>• Acesso direto às ferramentas</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

interface AIToolCardProps {
    tool: AITool;
    index: number;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    featured?: boolean;
}

const AIToolCard = ({ tool, index, isFavorite, onToggleFavorite, featured = false }: AIToolCardProps) => {
    const getPricingColor = (pricing: AITool['pricing']) => {
        switch (pricing) {
            case "Free": return "bg-green-500/10 text-green-600 border-green-500/20";
            case "Freemium": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "Paid": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
            case "Free Trial": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
            default: return "";
        }
    };

    const renderStars = (rating?: number) => {
        if (!rating) return null;
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" size={12} className="fill-yellow-400/50 text-yellow-400" />);
        }
        return (
            <div className="flex items-center gap-1">
                <div className="flex">{stars}</div>
                <span className="text-xs text-muted-foreground ml-1">{rating}</span>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Card className={`h-full flex flex-col group hover:shadow-lg transition-all duration-300 ${
                featured ? 'ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent' : ''
            }`}>
                {featured && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles size={10} />
                        Destaque
                    </div>
                )}

                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-background shadow-sm ring-1 ring-border">
                                <img
                                    src={tool.image}
                                    alt={tool.name}
                                    className="h-full w-full object-contain p-1"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
                                    }}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {tool.name}
                                </CardTitle>
                                {tool.rating && renderStars(tool.rating)}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleFavorite}
                            className={`shrink-0 transition-all duration-200 ${
                                isFavorite
                                    ? "text-red-500 hover:text-red-600"
                                    : "text-muted-foreground hover:text-red-500"
                            }`}
                        >
                            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="flex-grow pb-0 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {tool.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                        {tool.category.slice(0, 2).map(category => (
                            <Badge key={category} variant="outline" className="text-xs">
                                {category}
                            </Badge>
                        ))}
                        <Badge className={`text-xs border ${getPricingColor(tool.pricing)}`}>
                            {tool.pricing}
                        </Badge>
                    </div>
                </CardContent>

                <CardFooter className="pt-4">
                    <Button asChild className="w-full group/btn">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} className="mr-2 group-hover/btn:rotate-12 transition-transform" />
                            Abrir Ferramenta
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default AITools;