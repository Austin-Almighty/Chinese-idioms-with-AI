import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

const GameScreen = ({ scene, storyLog, options, isLoading, onChoice, onBack }) => {
    const logEndRef = useRef(null);
    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [storyLog]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full relative w-full overflow-hidden"
        >
            <div className="h-16 flex items-center justify-between px-6 z-20 bg-black/20 backdrop-blur-md border-b border-white/10">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                    <ArrowLeft className="w-4 h-4" /> 返回列表
                </button>
                <span className="text-lg font-bold tracking-wide text-white drop-shadow-md">{scene.title}</span>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar relative">
                <AnimatePresence initial={false}>
                    {storyLog.map((log, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`flex ${log.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[90%] md:max-w-[75%] p-6 rounded-2xl shadow-lg leading-relaxed text-base md:text-lg whitespace-pre-wrap backdrop-blur-sm border ${log.type === 'user'
                                    ? 'bg-gradient-to-br from-gemini-accent/80 to-gemini-purple/80 text-white rounded-br-none border-white/20'
                                    : 'bg-slate-800/80 text-slate-100 border-white/10 rounded-bl-none'
                                }`}>
                                {log.type === 'system' && (
                                    <div className="flex items-center gap-2 text-xs text-gemini-accent mb-3 font-bold tracking-wider uppercase">
                                        <Sparkles className="w-3 h-3" /> 系統 / 導師
                                    </div>
                                )}
                                {log.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 shadow-sm text-sm text-slate-400 italic flex items-center gap-2 backdrop-blur-sm">
                            <div className="flex gap-1">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-gemini-accent rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-gemini-accent rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-gemini-accent rounded-full" />
                            </div>
                            正在分析決策後果...
                        </div>
                    </motion.div>
                )}
                <div ref={logEndRef} />
            </div>

            <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {options.map((option, idx) => (
                        <motion.button
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => onChoice(option)}
                            disabled={isLoading}
                            className={`group text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${isLoading
                                    ? 'opacity-50 cursor-not-allowed bg-slate-800/50 border-white/5'
                                    : 'glass-btn border-white/10 hover:border-gemini-accent/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                }`}
                        >
                            <div className="relative z-10">
                                <div className="text-lg font-bold text-white mb-1 group-hover:text-gemini-accent transition-colors">{option.idiom}</div>
                                <div className="text-xs text-slate-400 mb-2 group-hover:text-slate-300">{option.literal}</div>
                                <div className="text-sm text-slate-300 font-medium pl-2 border-l-2 border-gemini-purple/50 group-hover:border-gemini-accent transition-colors">{option.strategy}</div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default GameScreen;
