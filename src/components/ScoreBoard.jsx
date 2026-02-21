import React from 'react';
import { Target, Trophy } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm min-w-[80px] sm:min-w-[100px] shadow-lg">
        <div className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1 ${color}`}>
            <Icon size={12} className="sm:w-[14px] sm:h-[14px]" />
            {label}
        </div>
        <div className="text-lg sm:text-2xl font-black text-white">{value}</div>
    </div>
);

const ScoreBoard = ({ score, highScore }) => {
    return (
        <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    NEON SNAKE
                </h1>
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Retro Arcade Revived</p>
            </div>
            <div className="flex gap-2">
                <StatCard icon={Target} label="Score" value={score} color="text-emerald-400" />
                <StatCard icon={Trophy} label="Best" value={highScore} color="text-amber-400" />
            </div>
        </div>
    );
};

export default ScoreBoard;
