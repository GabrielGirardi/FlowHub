import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

const LOFI_STATIONS = [
    {
        name: "ChilledCow Radio",
        url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0&loop=1",
        description: "24/7 lofi hip hop radio"
    },
    {
        name: "Lofi Girl Study",
        url: "https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&controls=0&loop=1",
        description: "Perfect for studying"
    },
    {
        name: "Jazz Lofi",
        url: "https://www.youtube.com/embed/Dx5qFachd3A?autoplay=1&controls=0&loop=1",
        description: "Jazzy lofi beats"
    }
];

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStation, setCurrentStation] = useState(0);
    const [showPlayer, setShowPlayer] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const togglePlay = () => {
        if (isPlaying) {
            setShowPlayer(false);
            setIsPlaying(false);
        } else {
            setShowPlayer(true);
            setIsPlaying(true);
        }
    };

    const changeStation = (index: number) => {
        setCurrentStation(index);
        if (isPlaying) {
            setShowPlayer(false);
            setTimeout(() => setShowPlayer(true), 100);
        }
    };

    return (
        <Card className="bg-gray-800/80 border-gray-400 dark:border-gray-700 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    🎵 Música Lofi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-500/30">
                        <div className="text-lg font-semibold text-pink-400 mb-1">
                            {LOFI_STATIONS[currentStation].name}
                        </div>
                        <div className="text-sm text-gray-400">
                            {LOFI_STATIONS[currentStation].description}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Button
                            onClick={togglePlay}
                            size="lg"
                            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all transform hover:scale-105"
                        >
                            {isPlaying ? (
                                <>
                                    <Pause size={20} className="mr-2" /> Pausar
                                </>
                            ) : (
                                <>
                                    <Play size={20} className="mr-2" /> Play
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-400 font-medium">Estações:</p>
                        {LOFI_STATIONS.map((station, index) => (
                            <button
                                key={index}
                                onClick={() => changeStation(index)}
                                className={`w-full text-left p-3 rounded-lg transition-all ${
                                    currentStation === index
                                        ? "bg-pink-500/20 border border-pink-500/50 text-pink-400"
                                        : "bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600/50"
                                }`}
                            >
                                <div className="font-medium">{station.name}</div>
                                <div className="text-xs text-gray-400">{station.description}</div>
                            </button>
                        ))}
                    </div>

                    {showPlayer && (
                        <div className="hidden">
                            <iframe
                                ref={iframeRef}
                                src={LOFI_STATIONS[currentStation].url}
                                title="Lofi Music Player"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{ display: 'none' }}
                            />
                        </div>
                    )}

                    <div className="text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            isPlaying
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
                            {isPlaying ? "Tocando" : "Parado"}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MusicPlayer;