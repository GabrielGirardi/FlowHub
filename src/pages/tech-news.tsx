import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Share2, RefreshCw, Bookmark, TrendingUp, Clock, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
    title: string;
    description?: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    source: {
        name: string;
    };
    category?: string;
    score?: number;
    author?: string;
    id: number;
}

const newsCategories = [
    { id: "top", name: "Top Stories", icon: TrendingUp },
    { id: "new", name: "Mais Recentes", icon: Clock },
    { id: "best", name: "Melhores", icon: Globe },
];

const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const TechNews = () => {
    const [activeCategory, setActiveCategory] = useState<string>("top");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [savedArticles, setSavedArticles] = useState<NewsItem[]>(() => {
        const saved = localStorage.getItem('saved-tech-news');
        return saved ? JSON.parse(saved) : [];
    });

    const { toast } = useToast();

    const fetchHackerNews = async (category: string) => {
        setLoading(true);
        try {
            const categoryMap: Record<string, string> = {
                top: 'topstories',
                new: 'newstories',
                best: 'beststories'
            };

            const response = await fetch(`https://hacker-news.firebaseio.com/v0/${categoryMap[category]}.json`);
            const storyIds = await response.json();

            // Pegar apenas os primeiros 12 stories
            const limitedIds = storyIds.slice(0, 12);

            const stories = await Promise.all(
                limitedIds.map(async (id: number) => {
                    const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                    const story = await storyResponse.json();

                    return {
                        id: story.id,
                        title: story.title,
                        description: story.text ? story.text.slice(0, 200) + '...' : 'Clique para ler o artigo completo',
                        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                        urlToImage: fallbackImage,
                        publishedAt: new Date(story.time * 1000).toISOString(),
                        source: { name: 'Hacker News' },
                        category: category,
                        score: story.score,
                        author: story.by
                    };
                })
            );

            setNews(stories.filter(story => story.title));
        } catch (error) {
            console.error('Error fetching news:', error);
            toast({
                title: "Erro ao carregar notícias",
                description: "Não foi possível carregar as notícias. Tente novamente.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeCategory !== "saved") {
            fetchHackerNews(activeCategory);
        }
    }, [activeCategory]);

    useEffect(() => {
        localStorage.setItem('saved-tech-news', JSON.stringify(savedArticles));
    }, [savedArticles]);

    const handleSaveArticle = (article: NewsItem) => {
        const isAlreadySaved = savedArticles.some(item => item.url === article.url);

        if (isAlreadySaved) {
            setSavedArticles(savedArticles.filter(item => item.url !== article.url));
            toast({
                title: "Artigo removido",
                description: "O artigo foi removido dos favoritos.",
            });
        } else {
            setSavedArticles([...savedArticles, article]);
            toast({
                title: "Artigo salvo",
                description: "O artigo foi adicionado aos favoritos.",
            });
        }
    };

    const handleShareArticle = (article: NewsItem) => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.description,
                url: article.url,
            })
                .then(() => {
                    toast({
                        title: "Compartilhado",
                        description: "Link compartilhado com sucesso!",
                    });
                })
                .catch(error => {
                    console.error("Error sharing:", error);
                });
        } else {
            navigator.clipboard.writeText(article.url).then(() => {
                toast({
                    title: "Link copiado",
                    description: "O link foi copiado para a área de transferência.",
                });
            });
        }
    };

    return (
        <div className="container mx-auto max-w-7xl px-4">
            {/* Header Section */}
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-3 mb-4 p-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                    <Globe className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Tech News Hub
                    </h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Fique por dentro das últimas notícias e tendências do mundo da tecnologia
                </p>
            </motion.div>

            <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="mb-8"
            >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                    <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-4 h-12 p-1 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm border border-border/50">
                        {newsCategories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
                                >
                                    <IconComponent size={16} />
                                    <span className="hidden sm:inline">{category.name}</span>
                                </TabsTrigger>
                            );
                        })}
                        {savedArticles.length > 0 && (
                            <TabsTrigger
                                value="saved"
                                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
                            >
                                <Bookmark size={16} />
                                <span className="hidden sm:inline">Salvos ({savedArticles.length})</span>
                            </TabsTrigger>
                        )}
                    </TabsList>

                    {activeCategory !== "saved" && (
                        <Button
                            variant="outline"
                            onClick={() => fetchHackerNews(activeCategory)}
                            className="h-12 px-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:bg-primary/10 transition-all duration-200"
                            disabled={loading}
                        >
                            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Atualizar
                        </Button>
                    )}
                </div>

                <TabsContent value={activeCategory} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            // Loading skeletons
                            Array(9).fill(null).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden h-full border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                                        <div className="aspect-video w-full">
                                            <Skeleton className="h-full w-full" />
                                        </div>
                                        <CardHeader>
                                            <Skeleton className="h-6 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-11/12" />
                                        </CardContent>
                                        <CardFooter>
                                            <Skeleton className="h-9 w-24" />
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))
                        ) : activeCategory === "saved" ? (
                            savedArticles.length === 0 ? (
                                <motion.div
                                    className="col-span-full text-center py-16"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="p-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                                        <Bookmark size={48} className="text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-2">Nenhum artigo salvo</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Salve artigos interessantes para lê-los mais tarde. Use o botão de bookmark nos artigos!
                                    </p>
                                </motion.div>
                            ) : (
                                savedArticles.map((article, index) => (
                                    <NewsCard
                                        key={article.url}
                                        article={article}
                                        index={index}
                                        isSaved={true}
                                        onSave={handleSaveArticle}
                                        onShare={handleShareArticle}
                                    />
                                ))
                            )
                        ) : news.length === 0 ? (
                            <motion.div
                                className="col-span-full text-center py-16"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="p-8 rounded-full bg-gradient-to-br from-destructive/10 to-destructive/5 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                                    <Globe size={48} className="text-destructive" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">Nenhuma notícia disponível</h3>
                                <p className="text-muted-foreground">
                                    Não foi possível carregar as notícias. Tente atualizar a página.
                                </p>
                            </motion.div>
                        ) : (
                            news.map((article, index) => (
                                <NewsCard
                                    key={article.url}
                                    article={article}
                                    index={index}
                                    isSaved={savedArticles.some(item => item.url === article.url)}
                                    onSave={handleSaveArticle}
                                    onShare={handleShareArticle}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12"
            >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 via-card to-accent/5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50"></div>
                    <CardHeader className="relative z-10">
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Sobre o Tech News Hub
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <p className="text-muted-foreground leading-relaxed">
                            Esta página apresenta as últimas notícias de tecnologia diretamente do Hacker News,
                            uma das maiores comunidades de tecnologia do mundo. Todas as notícias são atualizadas
                            em tempo real e você pode salvar seus artigos favoritos para ler mais tarde.
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                Atualizado em tempo real
                            </span>
                            <span className="flex items-center gap-1">
                                <Bookmark size={14} />
                                Sistema de favoritos
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

interface NewsCardProps {
    article: NewsItem;
    index: number;
    isSaved: boolean;
    onSave: (article: NewsItem) => void;
    onShare: (article: NewsItem) => void;
}

const NewsCard = ({ article, index, isSaved, onSave, onShare }: NewsCardProps) => {
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const publishDate = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Há menos de 1 hora';
        if (diffInHours < 24) return `Há ${diffInHours} horas`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `Há ${diffInDays} dias`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="overflow-hidden h-full flex flex-col border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm group">
                <div className="aspect-video w-full overflow-hidden relative">
                    <img
                        src={article.urlToImage || fallbackImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = fallbackImage;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {article.score && (
                        <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground border-0">
                            <TrendingUp size={12} className="mr-1" />
                            {article.score}
                        </Badge>
                    )}
                </div>

                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                            {article.source.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {getTimeAgo(article.publishedAt)}
                        </span>
                    </div>
                    <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        {article.title}
                    </CardTitle>
                    {article.author && (
                        <p className="text-xs text-muted-foreground">por {article.author}</p>
                    )}
                </CardHeader>

                <CardContent className="flex-grow pb-3">
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {article.description}
                    </p>
                </CardContent>

                <CardFooter className="flex justify-between pt-3 border-t border-border/50">
                    <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary/60 transition-all duration-200"
                    >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} className="mr-1" />
                            Ler mais
                        </a>
                    </Button>

                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onSave(article)}
                            className={`transition-all duration-200 ${
                                isSaved
                                    ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                                    : "hover:bg-primary/5 hover:border-primary/20"
                            }`}
                        >
                            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onShare(article)}
                            className="hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                        >
                            <Share2 size={16} />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default TechNews;
