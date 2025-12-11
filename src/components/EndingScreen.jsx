import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, Brain, Zap, AlertTriangle, Languages, Check, X, Minus, ExternalLink } from 'lucide-react';
import IdiomPopup from './IdiomPopup';

const EndingScreen = ({ result, storyLog, difficulty, onRestart }) => {
    const [isEnglish, setIsEnglish] = useState(false);
    const [selectedIdiomName, setSelectedIdiomName] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [idiomCache, setIdiomCache] = useState(new Map()); // Cache for idiom explanations

    if (!result) return null;

    // Handle idiom click
    const handleIdiomClick = (idiomName) => {
        setSelectedIdiomName(idiomName);
        setShowPopup(true);
    };

    // Close popup
    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedIdiomName(null);
    };

    // Cache idiom data when fetched
    const handleIdiomDataFetched = (idiomName, data) => {
        setIdiomCache(prev => {
            const newCache = new Map(prev);
            newCache.set(idiomName, data);
            return newCache;
        });
    };

    // ESC key to close popup
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && showPopup) {
                handleClosePopup();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showPopup]);

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

    // Get verdict icon and color
    const getVerdictStyle = (verdict) => {
        if (verdict === '好' || verdict?.toLowerCase() === 'good') {
            return { icon: Check, color: 'text-green-500', bg: 'bg-green-500/10' };
        } else if (verdict === '不當' || verdict?.toLowerCase() === 'bad') {
            return { icon: X, color: 'text-red-500', bg: 'bg-red-500/10' };
        }
        return { icon: Minus, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center h-full w-full custom-scrollbar"
            >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="max-w-4xl w-full glass-panel rounded-3xl overflow-hidden border border-white/20 dark:border-white/20 transition-colors duration-300 flex flex-col flex-1 min-h-0"
                >
                    {/* Header with Title, Stats and Back Button */}
                    <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 p-6 text-center relative overflow-hidden border-b border-slate-200 dark:border-white/10 transition-colors duration-300 flex-shrink-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10" />

                        {/* Back to Menu Button - Top Left */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onRestart}
                            className="absolute top-4 left-4 z-20 px-4 py-2 bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white font-medium rounded-full hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm border border-slate-200 dark:border-white/10 flex items-center gap-2 text-sm"
                        >
                            <RotateCcw className="w-4 h-4" />
                            {isEnglish ? 'Menu' : '返回'}
                        </motion.button>

                        {/* Language Toggle */}
                        <div className="absolute top-4 right-4 z-20">
                            <button
                                onClick={() => setIsEnglish(!isEnglish)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${isEnglish
                                    ? 'bg-blue-500 dark:bg-gemini-accent text-white border-transparent'
                                    : 'bg-white/80 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/20'
                                    }`}
                            >
                                <Languages className="w-4 h-4" />
                                {isEnglish ? 'EN' : '中'}
                            </button>
                        </div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="relative z-10"
                        >
                            <div className="text-xs text-blue-600 dark:text-gemini-accent font-bold uppercase tracking-[0.3em] mb-3 flex items-center justify-center gap-2">
                                <Trophy className="w-4 h-4" /> {isEnglish ? 'Wisdom Acquired' : '智慧獲得'}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 drop-shadow-sm">
                                {isEnglish ? (result.titleEn || result.title) : result.title}
                            </h2>

                            <div className="flex justify-center gap-8 mt-6">
                                <div className="text-center group">
                                    <div className="text-2xl font-bold text-pink-500 dark:text-gemini-pink mb-1 group-hover:scale-110 transition-transform">{result.stats?.aggressive || 0}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Zap className="w-3 h-3" /> {isEnglish ? 'Bold' : '果斷'}</div>
                                </div>
                                <div className="text-center group">
                                    <div className="text-2xl font-bold text-blue-500 dark:text-gemini-accent mb-1 group-hover:scale-110 transition-transform">{result.stats?.conservative || 0}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Brain className="w-3 h-3" /> {isEnglish ? 'Thoughtful' : '深思'}</div>
                                </div>
                                <div className="text-center group">
                                    <div className="text-2xl font-bold text-slate-600 dark:text-slate-500 mb-1 group-hover:scale-110 transition-transform">{result.stats?.negative || 0}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {isEnglish ? 'Misuse' : '誤用'}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content Grid - Fills remaining space */}
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 dark:bg-slate-900/50 transition-colors duration-300 flex-1 min-h-0 overflow-hidden">
                        {/* Left Column: Story Summary + Advice */}
                        <motion.div variants={item} className="flex flex-col min-h-0 overflow-hidden">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 flex-shrink-0">
                                <span className="w-1 h-6 bg-blue-500 dark:bg-gemini-accent rounded-full shadow-[0_0_10px_#3b82f6]"></span>
                                {isEnglish ? 'Story Summary' : '故事摘要'}
                            </h3>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="pb-8">
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6 text-justify font-light">
                                        {isEnglish
                                            ? (result.storySummaryEn || result.storySummary || result.evaluation)
                                            : (result.storySummary || result.evaluation)}
                                    </p>

                                    {/* Advice Box */}
                                    {(result.advice || result.adviceEn) && (
                                        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 mt-4">
                                            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
                                                {isEnglish ? '💡 Advice' : '💡 建議'}
                                            </h4>
                                            <p className="text-slate-700 dark:text-slate-200 text-base">
                                                {isEnglish ? (result.adviceEn || result.advice) : result.advice}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Idiom Analysis */}
                        <motion.div variants={item} className="flex flex-col min-h-0 overflow-hidden">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 flex-shrink-0">
                                <span className="w-1 h-6 bg-purple-500 dark:bg-gemini-purple rounded-full"></span>
                                {isEnglish ? 'Idiom Analysis' : '成語分析'}
                            </h3>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-4 pb-8">
                                    {result.idiomAnalysis?.map((analysis, idx) => {
                                        const style = getVerdictStyle(analysis.verdict);
                                        const VerdictIcon = style.icon;
                                        return (
                                            <div key={idx} className={`${style.bg} border border-slate-200/50 dark:border-white/5 rounded-xl p-4 group hover:shadow-md transition-all`}>
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 ${style.color}`}>
                                                        <VerdictIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <button
                                                                onClick={() => handleIdiomClick(analysis.idiom)}
                                                                className="font-bold text-slate-800 dark:text-white text-lg hover:text-purple-600 dark:hover:text-gemini-purple transition-colors cursor-pointer underline decoration-dotted underline-offset-2 hover:decoration-solid"
                                                            >
                                                                {analysis.idiom}
                                                            </button>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.color} font-medium`}>
                                                                {analysis.verdict}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                                                            {isEnglish ? (analysis.commentEn || analysis.comment) : analysis.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Fallback: Show decision log if no idiomAnalysis */}
                                    {!result.idiomAnalysis && storyLog.filter(l => l.type === 'user').map((log, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 bg-slate-400 dark:bg-slate-600 rounded-full mt-2 group-hover:bg-blue-500 dark:group-hover:bg-gemini-accent transition-colors shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:shadow-[0_0_5px_rgba(255,255,255,0.1)]"></div>
                                                <div className="w-0.5 flex-1 bg-slate-300 dark:bg-slate-700 my-1 group-hover:bg-slate-400 dark:group-hover:bg-slate-600"></div>
                                            </div>
                                            <div className="pb-4 flex-1">
                                                <div className="text-xs text-slate-500 mb-1 font-mono">{isEnglish ? `TURN ${idx + 1}` : `回合 ${idx + 1}`}</div>
                                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 group-hover:border-blue-300 dark:group-hover:border-white/10 transition-colors shadow-sm">
                                                    {log.text.split('\n')[0]}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Questionnaire CTA */}
                    <motion.div
                        variants={item}
                        className="border-t border-slate-200 dark:border-white/10 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 flex-shrink-0"
                    >
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLScp80QTCz8GCcYPeH1ESNA0UMr2m92NZL-GTxn9kGzePl37cQ/viewform"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-600 dark:from-gemini-purple dark:to-gemini-accent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 dark:hover:shadow-gemini-purple/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span>幫助我們改進！填寫 30 秒問卷 📝</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </motion.div>

                </motion.div>
            </motion.div>

            {/* Idiom Popup */}
            {showPopup && selectedIdiomName && (
                <IdiomPopup
                    idiomName={selectedIdiomName}
                    difficulty={difficulty}
                    cachedData={idiomCache.get(selectedIdiomName)}
                    onDataFetched={handleIdiomDataFetched}
                    onClose={handleClosePopup}
                />
            )}
        </>
    );
};

export default EndingScreen;
