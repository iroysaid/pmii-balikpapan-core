"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Music2, Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
    url: string;
}

export default function MusicPlayer({ url }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4;
        }
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => console.log("Audio play blocked", err));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <audio ref={audioRef} src={url} loop />
            <button 
                onClick={togglePlay}
                className={`p-4 rounded-full shadow-2xl transition duration-500 flex items-center justify-center ${isPlaying ? 'bg-white text-primary scale-110' : 'bg-primary text-white scale-100 hover:scale-110'}`}
            >
                {isPlaying ? (
                    <div className="relative">
                        <Volume2 className="w-6 h-6 animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                    </div>
                ) : (
                    <VolumeX className="w-6 h-6 opacity-70" />
                )}
            </button>
        </div>
    );
}
