import React from 'react';
import { motion } from 'framer-motion';

const DifficultyScreen = ({ onSelect }) => {
    const difficulties = [
        { id: 'easy', label: "生活應用 (Easy)", desc: "校園與日常情境。學習基礎成語的正確用法。", color: "from-emerald-400 to-teal-500", icon: "📖" },
        { id: 'medium', label: "職場應變 (Medium)", desc: "辦公室與人際關係。體會成語中的處世哲學。", color: "from-blue-400 to-indigo-500", icon: "🤝" },
        { id: 'hard', label: "高階博弈 (Hard)", desc: "商戰與權謀。深入理解成語背後的策略思維。", color: "from-purple-400 to-pink-500", icon: "🧠" }
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

    return (
        <motion.div
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20 }}
            variants={container}
            className="flex-1 flex flex-col items-center justify-center p-8 h-full w-full"
        >
            <motion.h2 variants={item} className="text-3xl font-bold text-white mb-2 font-serif drop-shadow-md">
                選擇學習情境
            </motion.h2>
            <motion.p variants={item} className="text-slate-300 mb-12">
                選擇適合你的挑戰難度，開始成語應用之旅
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {difficulties.map(diff => (
                    <motion.button
                        key={diff.id}
                        variants={item}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(diff.id)}
                        className="group relative p-8 rounded-2xl glass-panel text-left transition-all duration-300 hover:bg-white/15 hover:border-white/30 overflow-hidden"
                    >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${diff.color}`} />
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                        <span className="text-5xl mb-6 block filter drop-shadow-lg">{diff.icon}</span>
                        <span className="text-2xl font-bold text-white mb-2 block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                            {diff.label}
                        </span>
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors leading-relaxed block">
                            {diff.desc}
                        </span>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default DifficultyScreen;
