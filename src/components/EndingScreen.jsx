import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, Brain, Zap, AlertTriangle, Sparkles } from 'lucide-react';

const EndingScreen = ({ result, storyLog, onRestart }) => {
    if (!result) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto p-8 pb-32 flex flex-col items-center h-full w-full custom-scrollbar"
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-4xl w-full glass-panel rounded-3xl overflow-hidden border border-white/20 dark:border-white/20 transition-colors duration-300"
            >
                <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 p-6 text-center relative overflow-hidden border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10" />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="relative z-10"
                    >
                        <div className="text-xs text-blue-600 dark:text-gemini-accent font-bold uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                            <Trophy className="w-4 h-4" /> Wisdom Acquired
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 drop-shadow-sm">
                            {result.title}
                        </h2>

                        <div className="flex justify-center gap-8 mt-6">
                            <div className="text-center group">
                                <div className="text-2xl font-bold text-pink-500 dark:text-gemini-pink mb-1 group-hover:scale-110 transition-transform">{result.stats.aggressive}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Zap className="w-3 h-3" /> 果斷</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-2xl font-bold text-blue-500 dark:text-gemini-accent mb-1 group-hover:scale-110 transition-transform">{result.stats.conservative}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Brain className="w-3 h-3" /> 深思</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-2xl font-bold text-slate-600 dark:text-slate-500 mb-1 group-hover:scale-110 transition-transform">{result.stats.negative}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> 誤用</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/40 dark:bg-slate-900/50 transition-colors duration-300">
                    <motion.div variants={item} className="flex flex-col h-full">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 flex-shrink-0">
                            <span className="w-1 h-6 bg-blue-500 dark:bg-gemini-accent rounded-full shadow-[0_0_10px_#3b82f6]"></span>
                            成語導師點評
                        </h3>
                        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="pb-48">
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6 text-justify font-light">
                                    {result.evaluation}
                                </p>
                                <div className="h-8 w-full" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="flex flex-col h-full">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 flex-shrink-0">
                            <span className="w-1 h-6 bg-slate-400 dark:bg-slate-500 rounded-full"></span>
                            決策回顧
                        </h3>
                        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-4 pb-48">
                                {storyLog.filter(l => l.type === 'user').map((log, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 bg-slate-400 dark:bg-slate-600 rounded-full mt-2 group-hover:bg-blue-500 dark:group-hover:bg-gemini-accent transition-colors shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:shadow-[0_0_5px_rgba(255,255,255,0.1)]"></div>
                                            <div className="w-0.5 flex-1 bg-slate-300 dark:bg-slate-700 my-1 group-hover:bg-slate-400 dark:group-hover:bg-slate-600"></div>
                                        </div>
                                        <div className="pb-4 flex-1">
                                            <div className="text-xs text-slate-500 mb-1 font-mono">TURN {idx + 1}</div>
                                            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 group-hover:border-blue-300 dark:group-hover:border-white/10 transition-colors shadow-sm">
                                                {log.text.split('\n')[0]}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="h-8 w-full" />
                            </div>
                        </div>
                    </motion.div>
                </div>

            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRestart}
                    className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 border-4 border-slate-100 dark:border-slate-900/50 backdrop-blur-md"
                >
                    <RotateCcw className="w-4 h-4" /> 返回主選單
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default EndingScreen;
