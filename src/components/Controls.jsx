import React from 'react';
import { Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const ControlButton = ({ icon: Icon, onClick, active }) => (
    <button
        onClick={onClick}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${active ? 'bg-emerald-500 text-slate-900 scale-105' : 'bg-slate-800 text-slate-400'}`}
    >
        <Icon size={24} className="sm:w-[28px] sm:h-[28px]" strokeWidth={3} />
    </button>
);

const Controls = ({ direction, status, difficulty, onDirectionChange, onTogglePause }) => {
    return (
        <>
            {/* Mobile Controls */}
            <div className="flex flex-col gap-4 sm:gap-6 md:hidden">
                {/* Virtual D-Pad */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-[160px] sm:max-w-[180px] mx-auto">
                    <div />
                    <ControlButton icon={ChevronUp} onClick={() => onDirectionChange('UP')} active={direction === 'UP'} />
                    <div />
                    <ControlButton icon={ChevronLeft} onClick={() => onDirectionChange('LEFT')} active={direction === 'LEFT'} />
                    <ControlButton icon={ChevronDown} onClick={() => onDirectionChange('DOWN')} active={direction === 'DOWN'} />
                    <ControlButton icon={ChevronRight} onClick={() => onDirectionChange('RIGHT')} active={direction === 'RIGHT'} />
                </div>

                <button
                    onClick={onTogglePause}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 font-bold transition-all text-sm sm:text-base ${status === 'PLAYING' ? 'border-amber-500/50 text-amber-500 bg-amber-500/10' : 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10'}`}
                >
                    {status === 'PLAYING' ? <><Pause size={16} /> PAUSE</> : <><Play size={16} /> RESUME</>}
                </button>
            </div>

            {/* Desktop Help */}
            <div className="hidden md:flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-800 pt-4 mt-6">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">WASD</kbd> Move</span>
                    <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">P</kbd> Pause</span>
                    <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Space</kbd> Start / Restart</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap size={12} className="text-amber-500" />
                    Mode: {difficulty}
                </div>
            </div>
        </>
    );
};

export default Controls;
