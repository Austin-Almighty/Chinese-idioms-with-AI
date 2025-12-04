import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Typewriter from './Typewriter';

const GameScreen = ({ scene, storyLog, options, isLoading, onChoice, onBack, isGameOver, onViewSummary }) => {
    const logEndRef = useRef(null);
    const [areOptionsVisible, setAreOptionsVisible] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [storyLog]);

    // Shuffle options when they change to prevent position-based gaming
    useEffect(() => {
        if (options.length > 0) {
            const shuffled = [...options];
            // Fisher-Yates shuffle algorithm
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            setShuffledOptions(shuffled);
        }
    }, [options]);

    // Reset options visibility when a new system message appears or updates
    useEffect(() => {
        const lastLog = storyLog[storyLog.length - 1];
        if (lastLog?.type === 'system') {
            setAreOptionsVisible(false);
        }
    }, [storyLog]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full relative w-full overflow-hidden"
        >
            <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 z-20 bg-white/40 dark:bg-black/20 backdrop-blur-md border-b border-white/20 dark:border-white/10 transition-colors duration-300">
                <button onClick={onBack} className="flex items-center gap-1 sm:gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/20 dark:hover:bg-white/5">
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">返回列表</span><span className="sm:hidden">返回</span>
                </button>
                <span className="text-sm sm:text-lg font-bold tracking-wide text-slate-800 dark:text-white drop-shadow-sm dark:drop-shadow-md line-clamp-1">{scene.title}</span>
                <div className="w-8 sm:w-10"></div>
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
                            <div className={`max-w-[90%] md:max-w-[75%] p-6 rounded-2xl shadow-lg leading-relaxed text-base md:text-lg whitespace-pre-wrap backdrop-blur-sm border transition-colors duration-300 ${log.type === 'user'
                                ? 'bg-gradient-to-br from-blue-500/90 to-purple-600/90 dark:from-gemini-accent/80 dark:to-gemini-purple/80 text-white rounded-br-none border-white/20'
                                : 'bg-white/60 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border-white/40 dark:border-white/10 rounded-bl-none'
                                }`}>
                                {log.type === 'system' && (
                                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-gemini-accent mb-3 font-bold tracking-wider uppercase">
                                        <Sparkles className="w-3 h-3" /> 說書人
                                    </div>
                                )}
                                {log.type === 'system' && index === storyLog.length - 1 ? (
                                    <Typewriter
                                        text={log.text}
                                        speed={20}
                                        onComplete={() => setAreOptionsVisible(true)}
                                        onType={() => logEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                                    />
                                ) : (
                                    log.text
                                )}
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
                        <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm text-sm text-slate-500 dark:text-slate-400 italic flex items-center gap-2 backdrop-blur-sm transition-colors duration-300">
                            <div className="flex gap-1">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-blue-500 dark:bg-gemini-accent rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-blue-500 dark:bg-gemini-accent rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-blue-500 dark:bg-gemini-accent rounded-full" />
                            </div>
                            正在分析決策後果...
                        </div>
                    </motion.div>
                )}
                <div ref={logEndRef} />
            </div>

            <div className="p-3 sm:p-6 border-t border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl z-20 min-h-[140px] sm:min-h-[160px] transition-colors duration-300">
                <AnimatePresence>
                    {isGameOver && areOptionsVisible ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="flex items-center justify-center h-full">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onViewSummary}
                                disabled={isLoading}
                                className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gemini-accent dark:to-gemini-purple text-white text-lg sm:text-xl font-bold rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                                <span className="relative z-10 flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                                    查看導師評價
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        </motion.div>
                    ) : shuffledOptions.length > 0 && areOptionsVisible ? (
                        <motion.div
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            variants={{
                                hidden: { opacity: 0 },
                                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                            {shuffledOptions.map((option, idx) => (
                                <motion.button
                                    key={option.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20, scale: 0.95 },
                                        show: { opacity: 1, y: 0, scale: 1 }
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onChoice(option)}
                                    disabled={isLoading}
                                    className={`group text-left px-3 sm:px-4 pb-3 sm:pb-4 pt-3 sm:pt-4 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-start h-full ${isLoading
                                        ? 'opacity-50 cursor-not-allowed bg-slate-100/50 dark:bg-slate-800/50 border-white/20 dark:border-white/5'
                                        : 'glass-btn border-white/20 dark:border-white/10 hover:border-blue-400/50 dark:hover:border-gemini-accent/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        }`}>
                                    <div className="relative z-10">
                                        <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-gemini-accent transition-colors">{option.idiom}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 group-hover:text-slate-600 dark:group-hover:text-slate-300">{option.literal}</div>
                                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium pl-2 border-l-2 border-purple-400/50 dark:border-gemini-purple/50 group-hover:border-blue-500 dark:group-hover:border-gemini-accent transition-colors">{option.strategy}</div>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default GameScreen;
