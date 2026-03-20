import { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Countdown() {
    const calculateTimeLeft = (): TimeLeft => {
        const targetDate = new Date('2026-06-17T00:00:00');
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        let timeLeft: TimeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-black text-secondary leading-none">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex gap-4 md:gap-4 items-start">
            <TimeUnit value={timeLeft.days} label="Days" />
            <div className="text-primary font-bold text-xl mt-1">:</div>
            <TimeUnit value={timeLeft.hours} label="Hrs" />
            <div className="text-primary font-bold text-xl mt-1">:</div>
            <TimeUnit value={timeLeft.minutes} label="Min" />
            <div className="text-primary font-bold text-xl mt-1">:</div>
            <TimeUnit value={timeLeft.seconds} label="Sec" />
        </div>
    );
}
