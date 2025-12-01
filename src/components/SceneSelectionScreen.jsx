import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';

const SceneSelectionScreen = ({ difficulty, onSelect, onBack }) => {
    let filteredScenarios = SCENARIOS.filter(s => s.difficulty === difficulty);
    if (difficulty === 'hard') {
        filteredScenarios = filteredScenarios.sort((a, b) => (a.id === 'red_chamber_poison' ? -1 : 1));
    }

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden h-full w-full"
        >
            <header className="p-6 border-b border-white/10 flex justify-between items-center z-10 bg-black/20 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className={`w-2 h-8 rounded-full bg-gradient-to-b ${difficulty === 'easy' ? 'from-emerald-400 to-teal-500' :
                            difficulty === 'medium' ? 'from-blue-400 to-indigo-500' :
                                'from-purple-400 to-pink-500'
                        }`} />
                    選擇劇本 ({difficulty.toUpperCase()})
                </h2>
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
                    <ArrowLeft className="w-4 h-4" /> 返回
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredScenarios.map(scene => (
                        <motion.div
                            key={scene.id}
                            variants={item}
                            whileHover={{ y: -5 }}
                            onClick={() => onSelect(scene)}
                            className={`group glass-panel rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10 ${scene.id === 'red_chamber_poison' ? 'ring-2 ring-amber-500/50' : ''}`}
                        >
                            <div className="h-40 w-full overflow-hidden relative bg-slate-800">
                                <img
                                    src={scene.imageUrl || `https://placehold.co/600x400/${scene.imageColor}/1e293b?text=${encodeURIComponent(scene.title.split('：')[0])}`}
                                    alt={scene.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                                {scene.id === 'red_chamber_poison' && (
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        精選推薦
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gemini-accent transition-colors">
                                    {scene.title.split('：')[1]}
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed group-hover:text-slate-300">
                                    {scene.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SceneSelectionScreen;
