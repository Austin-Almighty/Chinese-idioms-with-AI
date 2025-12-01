import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getApiKey } from '../services/gemini';
import SettingsModal from './SettingsModal';

const DifficultyScreen = ({ onSelect, onBack }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const difficulties = [
        { id: 'easy', label: "簡單 (Easy)", subtitle: "拒絕詞窮 · 輕鬆上手", color: "from-emerald-400 to-teal-500", icon: "📖" },
        { id: 'medium', label: "中等 (Medium)", subtitle: "社畜生存 · 升職秘笈", color: "from-blue-400 to-indigo-500", icon: "🤝" },
        { id: 'hard', label: "困難 (Hard)", subtitle: "燒腦對決 · 智商壓制", color: "from-purple-400 to-pink-500", icon: "🧠" }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    const handleSelect = (difficultyId) => {
        const apiKey = getApiKey();
        if (!apiKey) {
            setIsSettingsOpen(true);
        } else {
            onSelect(difficultyId);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20 }}
            variants={container}
            className="flex-1 flex flex-col h-full w-full relative overflow-hidden"
        >
            <div className="absolute top-6 left-6 z-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">返回主選單</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <motion.h2 variants={item} className="text-4xl font-bold text-white mb-3 font-serif drop-shadow-lg text-center">
                    選擇學習情境
                </motion.h2>
                <motion.p variants={item} className="text-slate-300 mb-12 text-center text-lg max-w-2xl font-light">
                    每個難度都代表著不同的人生階段與挑戰。<br />準備好測試你的成語智慧了嗎？
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                    {difficulties.map(diff => (
                        <motion.button
                            key={diff.id}
                            variants={item}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect(diff.id)}
                            className="group relative p-8 rounded-3xl glass-panel text-left transition-all duration-300 hover:bg-white/15 hover:border-white/40 overflow-hidden flex flex-col h-full"
                        >
                            {/* Gradient Bar */}
                            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${diff.color}`} />

                            {/* Background Glow */}
                            <div className={`absolute -right-20 -bottom-20 w-48 h-48 bg-gradient-to-br ${diff.color} opacity-10 rounded-full blur-3xl group-hover:scale-150 group-hover:opacity-20 transition-all duration-500`} />

                            <div className="mb-6 relative">
                                <span className="text-6xl filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300 inline-block">{diff.icon}</span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 transition-all">
                                {diff.label}
                            </h3>

                            <p className="text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed text-sm font-light">
                                {diff.subtitle}
                            </p>

                            <div className="mt-auto pt-6 flex items-center text-sm font-bold text-slate-500 group-hover:text-white transition-colors">
                                <span className="uppercase tracking-widest">Start Challenge</span>
                                <span className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </motion.div>
    );
};

export default DifficultyScreen;
