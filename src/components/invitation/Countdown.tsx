"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
    targetDate: string | Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex justify-center gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/20 w-16 md:w-20">
                <div className="text-xl md:text-2xl font-black text-white">{timeLeft.days}</div>
                <div className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Hari</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/20 w-16 md:w-20">
                <div className="text-xl md:text-2xl font-black text-white">{timeLeft.hours}</div>
                <div className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Jam</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/20 w-16 md:w-20">
                <div className="text-xl md:text-2xl font-black text-white">{timeLeft.minutes}</div>
                <div className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Menit</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/20 w-16 md:w-20">
                <div className="text-xl md:text-2xl font-black text-white">{timeLeft.seconds}</div>
                <div className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Detik</div>
            </div>
        </div>
    );
}
