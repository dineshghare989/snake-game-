import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GameBoard = ({ snake, food, gridSize, status, score, difficulty, direction, onStart, onPause, onResume, onDifficultyChange, onDirectionChange, touchStartRef, touchEndRef }) => {

    const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

    return (
        <div
            className="relative aspect-square w-full bg-slate-900 rounded-2xl border-2 sm:border-4 border-slate-800 shadow-2xl overflow-hidden group mx-auto"
            onTouchStart={touchStartRef}
            onTouchEnd={touchEndRef}
        >
            {/* Animated Board Border */}
            <div className={`absolute inset-0 border-2 transition-opacity duration-500 rounded-xl pointer-events-none z-20 ${status === 'PLAYING' ? 'border-emerald-500/40 opacity-100 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]' : 'border-transparent opacity-0'}`} />

            {/* Grid Layout */}
            <div
                className="grid w-full h-full p-1"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`
                }}
            >
                {[...Array(gridSize * gridSize)].map((_, i) => {
                    const x = i % gridSize;
                    const y = Math.floor(i / gridSize);
                    const isFood = food.x === x && food.y === y;
                    const snakeIndex = snake.findIndex(seg => seg.x === x && seg.y === y);
                    const isHead = snakeIndex === 0;
                    const isBody = snakeIndex > 0;

                    return (
                        <div key={i} className="relative flex items-center justify-center p-[0.5px] sm:p-[1px]">
                            {isFood && (
                                <div className="w-full h-full rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-bounce" />
                            )}
                            {isHead && (
                                <div className="w-full h-full rounded-sm bg-emerald-400 z-10 shadow-[0_0_10px_rgba(52,211,153,0.8)] flex items-center justify-center transition-all duration-150">
                                    <div className={`flex gap-[1px] sm:gap-1 ${['UP', 'DOWN'].includes(direction) ? 'flex-row' : 'flex-col'}`}>
                                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-slate-900 rounded-full" />
                                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-slate-900 rounded-full" />
                                    </div>
                                </div>
                            )}
                            {isBody && (
                                <div
                                    className="w-full h-full rounded-sm bg-emerald-600/80 transition-all duration-200"
                                    style={{
                                        opacity: 1 - (snakeIndex / snake.length) * 0.6,
                                        transform: `scale(${1 - (snakeIndex / snake.length) * 0.2})`
                                    }}
                                />
                            )}
                            {/* Subtle Grid Lines */}
                            <div className="absolute inset-0 border-[0.5px] border-slate-800/30 pointer-events-none" />
                        </div>
                    );
                })}
            </div>

            {/* Overlays */}
            {status !== 'PLAYING' && (
                <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm bg-slate-900/60 p-4 sm:p-6">
                    {status === 'IDLE' && (
                        <div className="text-center animate-in fade-in zoom-in duration-300">
                            <Play className="mx-auto text-emerald-400 mb-2 sm:mb-4 animate-pulse w-12 h-12 sm:w-16 sm:h-16" />
                            <h2 className="text-3xl sm:text-4xl font-black mb-1 sm:mb-2 tracking-tight uppercase">READY</h2>
                            <p className="text-slate-400 mb-6 sm:mb-8 text-xs sm:text-sm font-medium">Use Arrows or Swipe to control</p>

                            <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex justify-center gap-2 p-1 bg-slate-800 rounded-lg">
                                    {DIFFICULTIES.map(d => (
                                        <button
                                            key={d}
                                            onClick={() => onDifficultyChange(d)}
                                            className={`px-3 sm:px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${difficulty === d ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={onStart}
                                    className="w-full py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
                                >
                                    START GAME
                                </button>
                                <p className="hidden sm:block text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Press Space to Start</p>
                            </div>
                        </div>
                    )}

                    {status === 'PAUSED' && (
                        <div className="text-center">
                            <Pause className="mx-auto text-cyan-400 mb-4 w-12 h-12 sm:w-16 sm:h-16" />
                            <h2 className="text-3xl sm:text-4xl font-black mb-6">SYSTEM PAUSED</h2>
                            <button
                                onClick={onResume}
                                className="px-8 sm:px-12 py-3 sm:py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black rounded-xl transition-all shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
                            >
                                RESUME
                            </button>
                        </div>
                    )}

                    {status === 'GAME_OVER' && (
                        <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <RotateCcw className="mx-auto text-rose-500 mb-2 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16" />
                            <h2 className="text-3xl sm:text-4xl font-black text-rose-500 mb-1 sm:mb-2 tracking-tighter italic uppercase">GAME OVER</h2>
                            <p className="text-slate-400 text-xs sm:text-sm mb-6">Terminal sequence complete at {score} pts.</p>
                            <button
                                onClick={onStart}
                                className="w-full py-3 sm:py-4 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(244,63,94,0.3)] mb-4"
                            >
                                RESTART GAME
                            </button>
                            {/* Intentionally removed back to menu button here as we don't have back to idle behavior mapped easily */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GameBoard;
