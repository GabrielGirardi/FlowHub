"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Cloud, Music2, Waves, Coffee, TreePine, Volume2, VolumeX, Power } from "lucide-react"

type SoundType = {
    id: string
    name: string
    icon: typeof Cloud
    color: string
    audio?: HTMLAudioElement
    url: string
}

const sounds: SoundType[] = [
    {
        id: "rain",
        name: "Rain",
        icon: Cloud,
        color: "text-blue-500",
        url: "https://www.soundjay.com/misc/sounds/rain-01.wav",
    },
    {
        id: "beats",
        name: "Lo-Fi Beats",
        icon: Music2,
        color: "text-purple-500",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
        id: "ocean",
        name: "Ocean Waves",
        icon: Waves,
        color: "text-cyan-500",
        url: "https://www.soundjay.com/misc/sounds/water-01.wav",
    },
    {
        id: "cafe",
        name: "Coffee Shop",
        icon: Coffee,
        color: "text-amber-500",
        url: "https://www.soundjay.com/misc/sounds/coffee-shop-01.wav",
    },
    {
        id: "forest",
        name: "Forest",
        icon: TreePine,
        color: "text-green-500",
        url: "https://www.soundjay.com/misc/sounds/forest-01.wav",
    },
]

const SoundMixer = () => {
    const [soundLevels, setSoundLevels] = useState<Record<string, number>>({
        rain: 0,
        beats: 0,
        ocean: 0,
        cafe: 0,
        forest: 0,
    })

    const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({
        rain: false,
        beats: false,
        ocean: false,
        cafe: false,
        forest: false,
    })

    const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

    useEffect(() => {
        const savedLevels = localStorage.getItem("soundLevels")
        const savedActive = localStorage.getItem("activeSounds")

        if (savedLevels) {
            setSoundLevels(JSON.parse(savedLevels))
        }
        if (savedActive) {
            setActiveSounds(JSON.parse(savedActive))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("soundLevels", JSON.stringify(soundLevels))
    }, [soundLevels])

    useEffect(() => {
        localStorage.setItem("activeSounds", JSON.stringify(activeSounds))
    }, [activeSounds])

    useEffect(() => {
        const alternativeUrls: Record<string, string[]> = {
            rain: [
                "https://www.soundjay.com/misc/sounds/rain-01.wav",
                "https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg",
                "https://freesound.org/data/previews/316/316847_5123451-lq.mp3",
            ],
            beats: [
                "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
                "https://freesound.org/data/previews/316/316847_5123451-lq.mp3",
            ],
            ocean: [
                "https://www.soundjay.com/misc/sounds/water-01.wav",
                "https://actions.google.com/sounds/v1/water/waves_crashing_on_rocks.ogg",
                "https://freesound.org/data/previews/316/316847_5123451-lq.mp3",
            ],
            cafe: [
                "https://www.soundjay.com/misc/sounds/coffee-shop-01.wav",
                "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
                "https://freesound.org/data/previews/316/316847_5123451-lq.mp3",
            ],
            forest: [
                "https://www.soundjay.com/misc/sounds/forest-01.wav",
                "https://actions.google.com/sounds/v1/ambiences/forest_birds.ogg",
                "https://freesound.org/data/previews/316/316847_5123451-lq.mp3",
            ],
        }

        sounds.forEach((sound) => {
            if (!audioRefs.current[sound.id]) {
                const audio = new Audio()
                const urls = alternativeUrls[sound.id] || [sound.url]
                let currentUrlIndex = 0

                const tryNextUrl = () => {
                    if (currentUrlIndex < urls.length) {
                        audio.src = urls[currentUrlIndex]
                        audio.load()
                        currentUrlIndex++
                    } else {
                        console.error(`Todos os URLs falharam para ${sound.name}`)
                    }
                }

                audio.loop = true
                audio.preload = "auto"
                audio.crossOrigin = "anonymous"

                audio.addEventListener("error", (e) => {
                    console.warn(`Erro ao carregar áudio ${sound.name} (URL ${currentUrlIndex}):`, e)
                    tryNextUrl()
                })

                audio.addEventListener("canplaythrough", () => {
                    console.log(`Áudio ${sound.name} carregado com sucesso`)
                })

                tryNextUrl()
                audioRefs.current[sound.id] = audio
            }
        })

        return () => {
            Object.values(audioRefs.current).forEach((audio) => {
                audio.pause()
                audio.src = ""
            })
        }
    }, [])

    useEffect(() => {
        sounds.forEach((sound) => {
            const audio = audioRefs.current[sound.id]
            if (audio) {
                const isActive = activeSounds[sound.id]
                const volume = soundLevels[sound.id]

                audio.volume = volume / 100

                if (isActive && volume > 0) {
                    const playPromise = audio.play()
                    if (playPromise !== undefined) {
                        playPromise.catch((error) => {
                            console.error(`Erro ao reproduzir ${sound.name}:`, error)
                            // Reset the active state if playback fails
                            setActiveSounds((prev) => ({ ...prev, [sound.id]: false }))
                        })
                    }
                } else {
                    audio.pause()
                }
            }
        })
    }, [activeSounds, soundLevels])

    const handleVolumeChange = (soundId: string, value: number[]) => {
        const newLevel = value[0]
        setSoundLevels((prev) => ({ ...prev, [soundId]: newLevel }))

        if (newLevel > 0 && !activeSounds[soundId]) {
            setActiveSounds((prev) => ({ ...prev, [soundId]: true }))
        } else if (newLevel === 0 && activeSounds[soundId]) {
            setActiveSounds((prev) => ({ ...prev, [soundId]: false }))
        }
    }

    const toggleSound = (soundId: string) => {
        setActiveSounds((prev) => {
            const newState = !prev[soundId]
            if (!newState) {
                setSoundLevels((prevLevels) => ({ ...prevLevels, [soundId]: 0 }))
            } else if (soundLevels[soundId] === 0) {
                setSoundLevels((prevLevels) => ({ ...prevLevels, [soundId]: 50 }))
            }
            return { ...prev, [soundId]: newState }
        })
    }

    return (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Sound Mixer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {sounds.map((sound) => {
                    const IconComponent = sound.icon
                    const isActive = activeSounds[sound.id]
                    const volume = soundLevels[sound.id]

                    return (
                        <div
                            key={sound.id}
                            className={`p-4 rounded-lg border transition-all duration-300 ${
                                isActive
                                    ? "bg-white dark:bg-slate-800 shadow-lg border-primary/50"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant={isActive ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => toggleSound(sound.id)}
                                        className={`transition-all duration-300 ${isActive ? "shadow-lg" : ""}`}
                                    >
                                        {isActive ? <Power size={18} /> : <IconComponent size={18} className={sound.color} />}
                                    </Button>
                                    <span className={`font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                        {sound.name}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {volume > 0 ? (
                                        <Volume2 size={16} className="text-primary" />
                                    ) : (
                                        <VolumeX size={16} className="text-muted-foreground" />
                                    )}
                                    <span className="text-sm font-mono w-8 text-right">{volume}%</span>
                                </div>
                            </div>

                            <Slider
                                value={[volume]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={(value) => handleVolumeChange(sound.id, value)}
                                className={`transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}
                            />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default SoundMixer;