import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Radio, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type LiveStream = {
  id: string;
  name: string;
  url: string;
  description: string;
}

const liveStreams: LiveStream[] = [
  {
    id: "chillhop",
    name: "Chillhop Radio",
    url: "https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/",
    description: "Lo-fi hip hop beats to relax/study to",
  },
  {
    id: "lofi-girl",
    name: "Lo-Fi Cafe",
    url: "https://streams.fluxfm.de/Lounge/mp3-320/streams.fluxfm.de/",
    description: "Peaceful coffee shop ambience",
  },
  {
    id: "study-beats",
    name: "Study Beats",
    url: "https://streams.fluxfm.de/Chillout/mp3-320/streams.fluxfm.de/",
    description: "Perfect for concentration and focus",
  },
  {
    id: "ambient-sounds",
    name: "Ambient Sounds",
    url: "https://streams.fluxfm.de/Ambient/mp3-320/streams.fluxfm.de/",
    description: "Relaxing ambient soundscapes",
  },
  {
    id: "nature-sounds",
    name: "Nature Sounds",
    url: "https://streams.fluxfm.de/Nature/mp3-320/streams.fluxfm.de/",
    description: "Soothing nature sounds for relaxation",
  }
];

const LiveStreamPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStream, setCurrentStream] = useState(liveStreams[0]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedVolume = localStorage.getItem("liveStreamVolume");
    const savedMuted = localStorage.getItem("liveStreamMuted");
    const savedStream = localStorage.getItem("currentStream");

    if (savedVolume) {
      setVolume(Number.parseInt(savedVolume));
    }
    if (savedMuted) {
      setIsMuted(JSON.parse(savedMuted));
    }
    if (savedStream) {
      const stream = liveStreams.find((s) => s.id === savedStream);
      if (stream) {
        setCurrentStream(stream);
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("liveStreamVolume", volume.toString());
  }, [volume])

  useEffect(() => {
    localStorage.setItem("liveStreamMuted", JSON.stringify(isMuted));
  }, [isMuted])

  useEffect(() => {
    localStorage.setItem("currentStream", currentStream.id);
  }, [currentStream])

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;
    audio.src = currentStream.url;
    audio.volume = volume / 100;
    audio.muted = isMuted;

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log(`Stream ${currentStream.name} pronto para reprodução`);
    }

    const handleError = (e: Event) => {
      console.error(`Erro no stream ${currentStream.name}:`, e);
      setIsPlaying(false);
      setIsConnected(false);
      setIsLoading(false);
      toast({
        title: "Erro de Conexão",
        description: `Não foi possível conectar à ${currentStream.name}. Tente outra estação.`,
        variant: "destructive",
      });
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
    }
  }, [currentStream, volume, isMuted, toast]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    setIsLoading(true);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsConnected(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsConnected(true);
        toast({
          title: "Conectado!",
          description: `Reproduzindo ${currentStream.name}`,
        });
      }
    } catch (error) {
      console.error("Erro ao reproduzir stream:", error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar à transmissão ao vivo.",
        variant: "destructive",
      });
      setIsPlaying(false);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  }

  const switchStream = (stream: LiveStream) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsConnected(false);
    }
    setCurrentStream(stream);
    toast({
      title: "Estação Alterada",
      description: `Selecionado: ${stream.name}`,
    });
  }

  return (
    <section className="flex item-center justify-between gap-6 mx-auto">
      <Card className="w-1/3 border-none p-2 bg-gradient-to-r from-red-500 to-indigo-600 gap-2 filter">
        <CardHeader className="bg-secondary py-4 rounded-t-lg bg-white/40 dark:bg-slate-800/50 rounded-t-lg">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Radio className="text-white" size={24} />
            Live Lo-Fi Radio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 bg-secondary py-6 rounded-b-lg bg-white/40 dark:bg-slate-800/50">
          <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              {isConnected ? (
                <Wifi className="text-green-500" size={16} />
              ) : (
                <WifiOff className="text-gray-400" size={16} />
              )}
              <span className={`text-sm font-medium ${isConnected ? "text-green-600" : "text-gray-500"}`}>
                {isConnected ? "LIVE" : "OFFLINE"}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{currentStream.name}</h3>
            <p className="text-sm text-muted-foreground">{currentStream.description}</p>
          </div>

          <div className="flex justify-center">
            <Button
              variant="default"
              size="icon"
              className="h-16 w-16 rounded-full shadow-lg cursor-pointer"
              onClick={handlePlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
            <Slider value={[isMuted ? 0 : volume]} min={0} max={100} step={1} onValueChange={handleVolumeChange} />
            <span className="text-sm font-mono w-12 text-right">{volume}%</span>
          </div>
        </CardContent>
      </Card>
      <div className="w-2/3 space-y-2">
        <h4 className="font-medium text-center mb-3 bg-secondary p-1 rounded-md">Estações Disponíveis</h4>
        {liveStreams.map((stream) => (
          <button
            key={stream.id}
            onClick={() => switchStream(stream)}
            className={`w-full p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
              currentStream.id === stream.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80"
            }`}
          >
            <div className="font-medium">{stream.name}</div>
            <div className="text-sm opacity-75">{stream.description}</div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default LiveStreamPlayer;