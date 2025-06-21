import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    Play,
    Heart,
    Clock,
    Trash2,
    Youtube,
    Star,
    ExternalLink,
    History,
    X,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

interface YouTubeVideo {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    publishedAt: string;
}

interface SavedVideo {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    savedAt: string;
}

interface WatchHistory {
    id: string;
    title: string;
    watchedAt: string;
}

const YoutubePlayer = () => {
    const [videoUrl, setVideoUrl] = useState("");
    const [videoId, setVideoId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
    const [savedVideos, setSavedVideos] = useState<SavedVideo[]>(() => {
        const saved = localStorage.getItem('saved-youtube-videos');
        return saved ? JSON.parse(saved) : [];
    });
    const [watchHistory, setWatchHistory] = useState<WatchHistory[]>(() => {
        const saved = localStorage.getItem('youtube-watch-history');
        return saved ? JSON.parse(saved) : [];
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        localStorage.setItem('saved-youtube-videos', JSON.stringify(savedVideos));
        localStorage.setItem('youtube-watch-history', JSON.stringify(watchHistory));
    }, [savedVideos, watchHistory]);

    const sampleVideos: YouTubeVideo[] = [
        {
            id: "dQw4w9WgXcQ",
            title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
            channelTitle: "Rick Astley",
            thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            publishedAt: "2009-10-25T06:57:33Z"
        },
        {
            id: "5qap5aO4i9A",
            title: "lofi hip hop radio - beats to relax/study to",
            channelTitle: "Lofi Girl",
            thumbnailUrl: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
            publishedAt: "2020-02-22T19:51:37Z"
        },
        {
            id: "jfKfPfyJRdk",
            title: "lofi hip hop radio - beats to sleep/chill to",
            channelTitle: "Lofi Girl",
            thumbnailUrl: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
            publishedAt: "2021-02-19T01:13:14Z"
        },
        {
            id: "hFDOGYEPZ8E",
            title: "Novo Feat e Técnica de Programação que Está Revolucionando o Dev JavaScript",
            channelTitle: "Filipe Deschamps",
            thumbnailUrl: "https://i.ytimg.com/vi/hFDOGYEPZ8E/hqdefault.jpg",
            publishedAt: "2023-08-09T21:12:37Z"
        },
        {
            id: "BrnMl1R4sKA",
            title: "MIT: Introduction to Deep Learning",
            channelTitle: "Alexander Amini",
            thumbnailUrl: "https://i.ytimg.com/vi/BrnMl1R4sKA/hqdefault.jpg",
            publishedAt: "2023-01-09T15:47:22Z"
        }
    ];

    const extractVideoIdFromUrl = (url: string): string | null => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        return match ? match[1] : null;
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const extractedId = extractVideoIdFromUrl(videoUrl);

        if (!extractedId) {
            toast({
                title: "URL inválida",
                description: "Por favor, insira uma URL válida do YouTube.",
                variant: "destructive"
            });
            return;
        }

        setVideoId(extractedId);
        addToWatchHistory(extractedId);
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            toast({
                title: "Termo de busca inválido",
                description: "Por favor, digite algo para buscar.",
                variant: "destructive"
            });
            return;
        }

        const results = sampleVideos.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.channelTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(results);
        setIsSearchOpen(true);
    };

    const playVideo = (id: string, title?: string) => {
        setVideoId(id);
        setVideoUrl(`https://www.youtube.com/watch?v=${id}`);
        addToWatchHistory(id, title);
    };

    const addToWatchHistory = (id: string, title?: string) => {
        const videoTitle = title || sampleVideos.find(v => v.id === id)?.title || savedVideos.find(v => v.id === id)?.title || "Video desconhecido";

        const historyEntry: WatchHistory = {
            id,
            title: videoTitle,
            watchedAt: new Date().toISOString()
        };

        setWatchHistory(prev => {
            const filtered = prev.filter(item => item.id !== id);
            return [historyEntry, ...filtered].slice(0, 20);
        });
    };

    const toggleSaveVideo = (video: YouTubeVideo) => {
        const isAlreadySaved = savedVideos.some(v => v.id === video.id);

        if (isAlreadySaved) {
            setSavedVideos(savedVideos.filter(v => v.id !== video.id));
            toast({
                title: "Vídeo removido",
                description: "O vídeo foi removido dos favoritos.",
            });
        } else {
            const savedVideo: SavedVideo = {
                id: video.id,
                title: video.title,
                channelTitle: video.channelTitle,
                thumbnailUrl: video.thumbnailUrl,
                savedAt: new Date().toISOString()
            };

            setSavedVideos([...savedVideos, savedVideo]);
            toast({
                title: "Vídeo salvo",
                description: "O vídeo foi adicionado aos favoritos.",
            });
        }
    };

    const clearHistory = () => {
        setWatchHistory([]);
        toast({
            title: "Histórico limpo",
            description: "Seu histórico de visualização foi apagado.",
        });
    };

    const clearSavedVideos = () => {
        setSavedVideos([]);
        toast({
            title: "Favoritos limpos",
            description: "Todos os vídeos favoritos foram removidos.",
        });
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent mb-4">
                        YouTube Player
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Descubra e reproduza vídeos do YouTube com uma experiência moderna e intuitiva
                    </p>
                </motion.div>

                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <Card className="border-border backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-foreground text-2xl">Reprodutor de Vídeos</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Cole um link do YouTube ou pesquise vídeos para assistir
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleUrlSubmit} className="flex gap-3">
                                <Input
                                    placeholder="Cole um link do YouTube (ex: https://youtube.com/watch?v=...)"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="flex-1 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring"
                                />
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Reproduzir
                                </Button>
                            </form>

                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        placeholder="Pesquisar vídeos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        }}
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Search className="w-4 h-4 mr-2" />
                                    Pesquisar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Video Player */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8"
                >
                    {videoId ? (
                        <Card className="border-border backdrop-blur-sm overflow-hidden">
                            <div className="aspect-video relative">
                                <iframe
                                    ref={iframeRef}
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        </Card>
                    ) : (
                        <Card className="border-border backdrop-blur-sm">
                            <div className="aspect-video flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                                        <Youtube size={48} className="text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground text-lg">
                                        Nenhum vídeo carregado. Cole um link do YouTube ou pesquise vídeos acima.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </motion.div>

                {/* Categories Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            variant="ghost"
                            className="w-full h-auto p-6 bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all group"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                                        <Search className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-foreground font-medium">Resultados da Pesquisa</h3>
                                        <p className="text-muted-foreground text-sm">{searchResults.length} vídeos encontrados</p>
                                    </div>
                                </div>
                                {isSearchOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                            </div>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Button
                            onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                            variant="ghost"
                            className="w-full h-auto p-6 bg-card border border-border hover:bg-accent hover:border-yellow-500/50 transition-all group"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-foreground font-medium">Vídeos Favoritos</h3>
                                        <p className="text-muted-foreground text-sm">{savedVideos.length} vídeos salvos</p>
                                    </div>
                                </div>
                                {isFavoritesOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                            </div>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Button
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            variant="ghost"
                            className="w-full h-auto p-6 bg-card border border-border hover:bg-accent hover:border-purple-500/50 transition-all group"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                        <History className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-foreground font-medium">Histórico</h3>
                                        <p className="text-muted-foreground text-sm">{watchHistory.length} vídeos assistidos</p>
                                    </div>
                                </div>
                                {isHistoryOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                            </div>
                        </Button>
                    </motion.div>
                </div>

                {/* Search Results */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8"
                        >
                            <Card className="border-border backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-foreground flex items-center">
                                            <Search className="w-5 h-5 mr-2 text-primary" />
                                            Resultados da Pesquisa
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {searchResults.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">Nenhum resultado encontrado. Tente outros termos de pesquisa.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {searchResults.map((video, index) => (
                                                <motion.div
                                                    key={video.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                                >
                                                    <Card className="bg-card border-border overflow-hidden hover:bg-accent/50 transition-all group cursor-pointer">
                                                        <div className="relative">
                                                            <img
                                                                src={video.thumbnailUrl}
                                                                alt={video.title}
                                                                className="w-full aspect-video object-cover"
                                                            />
                                                            <div
                                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                                onClick={() => playVideo(video.id, video.title)}
                                                            >
                                                                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                                                    <Play className="w-8 h-8 text-white" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <CardContent className="p-4">
                                                            <h3
                                                                className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-2"
                                                                onClick={() => playVideo(video.id, video.title)}
                                                            >
                                                                {video.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground mb-3">{video.channelTitle}</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center text-xs text-muted-foreground">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {formatDate(video.publishedAt)}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant={savedVideos.some(v => v.id === video.id) ? "default" : "outline"}
                                                                        size="sm"
                                                                        className="h-8 px-3"
                                                                        onClick={() => toggleSaveVideo(video)}
                                                                    >
                                                                        <Heart className="w-3 h-3 mr-1" />
                                                                        {savedVideos.some(v => v.id === video.id) ? "Salvo" : "Salvar"}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Favorites */}
                <AnimatePresence>
                    {isFavoritesOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8"
                        >
                            <Card className="border-border backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-foreground flex items-center">
                                            <Star className="w-5 h-5 mr-2 text-yellow-500" />
                                            Vídeos Favoritos
                                        </CardTitle>
                                        {savedVideos.length > 0 && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Limpar
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-card border-border">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-foreground">Limpar favoritos</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-muted-foreground">
                                                            Tem certeza que deseja remover todos os vídeos favoritos?
                                                            Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="bg-secondary text-secondary-foreground border-border">Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={clearSavedVideos} className="bg-destructive hover:bg-destructive/90">Limpar</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {savedVideos.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground mb-2">Você não tem vídeos favoritos ainda.</p>
                                            <p className="text-muted-foreground/75 text-sm">Use o botão "Salvar" nos resultados da pesquisa.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            <AnimatePresence>
                                                {savedVideos.map((video, index) => (
                                                    <motion.div
                                                        key={video.id}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        layout
                                                    >
                                                        <Card className="bg-card border-border overflow-hidden hover:bg-accent/50 transition-all group">
                                                            <div className="relative">
                                                                <img
                                                                    src={video.thumbnailUrl}
                                                                    alt={video.title}
                                                                    className="w-full aspect-video object-cover"
                                                                />
                                                                <div
                                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                                                    onClick={() => playVideo(video.id, video.title)}
                                                                >
                                                                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                                                        <Play className="w-6 h-6 text-white" />
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-all"
                                                                    onClick={() => toggleSaveVideo({
                                                                        id: video.id,
                                                                        title: video.title,
                                                                        channelTitle: video.channelTitle,
                                                                        thumbnailUrl: video.thumbnailUrl,
                                                                        publishedAt: video.savedAt
                                                                    })}
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                            <CardContent className="p-4">
                                                                <h3
                                                                    className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-2"
                                                                    onClick={() => playVideo(video.id, video.title)}
                                                                >
                                                                    {video.title}
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground mb-3">{video.channelTitle}</p>
                                                                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                                                                    <Star className="w-3 h-3 mr-1" />
                                                                    Favorito
                                                                </Badge>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isHistoryOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8"
                        >
                            <Card className="border-border backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-foreground flex items-center">
                                            <History className="w-5 h-5 mr-2 text-purple-500" />
                                            Histórico de Reprodução
                                        </CardTitle>
                                        {watchHistory.length > 0 && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Limpar
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-card border-border">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-foreground">Limpar histórico</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-muted-foreground">
                                                            Tem certeza que deseja limpar todo o histórico de reprodução?
                                                            Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="bg-secondary text-secondary-foreground border-border">Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={clearHistory} className="bg-destructive hover:bg-destructive/90">Limpar</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {watchHistory.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground mb-2">Seu histórico de reprodução está vazio.</p>
                                            <p className="text-muted-foreground/75 text-sm">Reproduza alguns vídeos para ver seu histórico aqui.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {watchHistory.map((item, index) => (
                                                <motion.div
                                                    key={`${item.id}-${item.watchedAt}`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-accent/50 transition-all group cursor-pointer"
                                                    onClick={() => playVideo(item.id, item.title)}
                                                >
                                                    <div className="flex items-center flex-1 min-w-0">
                                                        <div className="p-2 bg-purple-500/20 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
                                                            <Play className="w-4 h-4 text-purple-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
                                                                {item.title}
                                                            </h4>
                                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {formatDate(item.watchedAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <a
                                                            href={`https://www.youtube.com/watch?v=${item.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-muted-foreground hover:text-foreground"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default YoutubePlayer;