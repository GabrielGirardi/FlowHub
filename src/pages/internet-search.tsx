import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, ExternalLink, Search as SearchIcon, ArrowRight, Sparkles, Clock, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

type SearchResult = {
    title: string;
    url: string;
    description: string;
    type?: string;
    favicon?: string;
    timeAgo?: string;
};

const InternetSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setSearchPerformed(true);

        setTimeout(() => {
            const demoResults: SearchResult[] = [
                {
                    title: `${searchQuery} - Wikipedia`,
                    url: `https://en.wikipedia.org/wiki/${searchQuery.replace(/\s+/g, '_')}`,
                    description: `Informações completas sobre ${searchQuery} da enciclopédia livre. Artigos detalhados e bem documentados.`,
                    type: 'enciclopédia',
                    timeAgo: '2 min atrás'
                },
                {
                    title: `${searchQuery} - Resultados de pesquisa`,
                    url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
                    description: `Encontre os melhores recursos, tutoriais e informações sobre ${searchQuery} na web.`,
                    type: 'pesquisa',
                    timeAgo: '1 min atrás'
                },
                {
                    title: `Aprenda sobre ${searchQuery}`,
                    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
                    description: `Vídeos tutoriais, explicações e conteúdo educativo sobre ${searchQuery}.`,
                    type: 'vídeos',
                    timeAgo: '5 min atrás'
                },
                {
                    title: `Imagens de ${searchQuery}`,
                    url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`,
                    description: `Explore uma galeria de imagens relacionadas a ${searchQuery}.`,
                    type: 'imagens',
                    timeAgo: '3 min atrás'
                },
                {
                    title: `GitHub - ${searchQuery}`,
                    url: `https://github.com/search?q=${encodeURIComponent(searchQuery)}`,
                    description: `Repositórios, projetos open source e código relacionados a ${searchQuery}.`,
                    type: 'código',
                    timeAgo: '7 min atrás'
                }
            ];

            setSearchResults(demoResults);
            setIsLoading(false);
        }, 800);
    };

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

    const getTypeColor = (type?: string) => {
        const colors = {
            'enciclopédia': 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-700',
            'pesquisa': 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-700',
            'vídeos': 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-700',
            'imagens': 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-700',
            'código': 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-700'
        };
        return colors[type as keyof typeof colors] || 'from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-700';
    };

    const MotionCard = motion(Card);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 p-8 border border-blue-200/30"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
                <div className="absolute top-4 right-4 opacity-10">
                    <Sparkles size={60} />
                </div>

                <div className="relative flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                        <Globe size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Pesquisa na Internet
                        </h1>
                        <p className="text-lg text-muted-foreground mt-1">
                            Explore a web e encontre exatamente o que você precisa
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                                <SearchIcon size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Motor de Busca Inteligente</CardTitle>
                                <CardDescription className="text-base">
                                    Digite sua pesquisa e encontre os melhores resultados da web
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch}>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="O que você gostaria de descobrir hoje?"
                                        className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-400 rounded-xl transition-all duration-300"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    size="lg"
                                    className="h-12 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Pesquisando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Pesquisar
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-lg font-medium">Pesquisando na web...</p>
                        <p className="text-muted-foreground">Encontrando os melhores resultados para você</p>
                    </div>
                </div>
            ) : searchResults.length > 0 ? (
                <motion.div
                    className="space-y-4"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-medium">
                            Encontramos <span className="text-blue-600">{searchResults.length} resultados</span> para "{searchQuery}"
                        </p>
                    </div>

                    {searchResults.map((result, index) => (
                        <motion.div key={index} variants={item}>
                            <MotionCard
                                className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30"
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            >
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-semibold text-blue-600 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-1">
                                                    {result.title}
                                                </h3>
                                                {result.type && (
                                                    <Badge
                                                        className={`px-3 py-1 text-xs font-medium border bg-gradient-to-r ${getTypeColor(result.type)} backdrop-blur-sm`}
                                                    >
                                                        {result.type}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {result.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {result.timeAgo}
                                                </div>
                                                <a
                                                    href={result.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    {result.url.length > 60 ? result.url.substring(0, 60) + '...' : result.url}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                                            >
                                                <Bookmark className="h-3 w-3 mr-1" />
                                                Salvar
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </MotionCard>
                        </motion.div>
                    ))}
                </motion.div>
            ) : searchPerformed ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl border border-gray-200/50"
                >
                    <SearchIcon size={60} className="mx-auto text-muted-foreground/40 mb-6" />
                    <div className="space-y-3">
                        <p className="text-xl font-semibold">
                            Nenhum resultado encontrado
                        </p>
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Não encontramos resultados para "<span className="font-medium">{searchQuery}</span>".
                            Tente termos diferentes ou mais específicos.
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center py-16 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-2xl border border-blue-200/30"
                >
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                        <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white">
                            <Globe size={48} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-xl font-semibold">
                            Pronto para explorar a web?
                        </p>
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Digite sua pesquisa na barra acima e descubra informações incríveis sobre qualquer assunto.
                        </p>
                    </div>
                </motion.div>
            )}

            <motion.div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-red-50/50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-red-950/20 p-6 border border-amber-200/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-red-500/5"></div>
                <div className="absolute top-4 right-4 opacity-10">
                    <Sparkles size={40} />
                </div>

                <div className="relative text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-amber-600">
                        <Sparkles size={20} />
                        <span className="font-semibold">Demonstração</span>
                    </div>
                    <p className="text-muted-foreground">
                        Esta ferramenta permite pesquisar na internet sem sair do FlowHub.
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                        Os resultados são simulados para demonstração. Em uma versão completa,
                        seria integrado com APIs reais de busca como Google, Bing ou DuckDuckGo.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default InternetSearch;