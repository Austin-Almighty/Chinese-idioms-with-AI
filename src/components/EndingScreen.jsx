import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, Brain, Zap, AlertTriangle } from 'lucide-react';

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
            className="flex-1 overflow-y-auto p-8 flex flex-col items-center h-full w-full custom-scrollbar"
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-4xl w-full glass-panel rounded-3xl overflow-hidden border border-white/20"
            >
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center relative overflow-hidden border-b border-white/10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="relative z-10"
                    >
                        <div className="text-xs text-gemini-accent font-bold uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                            <Trophy className="w-4 h-4" /> Wisdom Acquired
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
                            {result.title}
                        </h2>

                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center group">
                                <div className="text-3xl font-bold text-gemini-pink mb-1 group-hover:scale-110 transition-transform">{result.stats.aggressive}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1"><Zap className="w-3 h-3" /> 果斷</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-3xl font-bold text-gemini-accent mb-1 group-hover:scale-110 transition-transform">{result.stats.conservative}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1"><Brain className="w-3 h-3" /> 深思</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-3xl font-bold text-slate-500 mb-1 group-hover:scale-110 transition-transform">{result.stats.negative}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> 誤用</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900/50">
                    <motion.div variants={item}>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gemini-accent rounded-full shadow-[0_0_10px_#3b82f6]"></span>
                            成語導師點評
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg mb-6 text-justify font-light">
                            {result.evaluation}
                        </p>
                        <div className="bg-amber-900/20 p-5 rounded-xl border border-amber-500/20">
                            <h4 className="font-bold text-amber-400 mb-2 text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> 學習筆記
                            </h4>
                            <p className="text-amber-200/80 text-sm leading-relaxed">
                                這次冒險中，你學會了運用成語來解決實際問題。下次遇到類似情境時，試著回想這些成語的策略含義。
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={item}>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-slate-500 rounded-full"></span>
                            決策回顧
                        </h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {storyLog.filter(l => l.type === 'user').map((log, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-slate-600 rounded-full mt-2 group-hover:bg-gemini-accent transition-colors shadow-[0_0_5px_rgba(255,255,255,0.1)]"></div>
                                        <div className="w-0.5 flex-1 bg-slate-700 my-1 group-hover:bg-slate-600"></div>
                                    </div>
                                    <div className="pb-4 flex-1">
                                        <div className="text-xs text-slate-500 mb-1 font-mono">TURN {idx + 1}</div>
                                        <div className="bg-slate-800 p-3 rounded-lg text-sm text-slate-300 border border-white/5 group-hover:border-white/10 transition-colors">
                                            {log.text.split('\n')[0]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="p-6 border-t border-white/10 flex justify-center bg-slate-900/80">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRestart}
                        className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition shadow-lg flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" /> 返回主選單
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EndingScreen;
