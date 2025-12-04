import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';

const AnalyzingScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center h-full w-full relative overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm z-0 transition-colors duration-300" />

            <div className="relative z-10 flex flex-col items-center text-center p-8">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                        filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="mb-8 relative"
                >
                    <div className="absolute inset-0 bg-blue-400/20 dark:bg-gemini-accent/20 blur-xl rounded-full transition-colors duration-300" />
                    <Brain className="w-20 h-20 text-blue-500 dark:text-gemini-accent relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-colors duration-300" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border-2 border-dashed border-blue-300/20 dark:border-white/20 rounded-full transition-colors duration-300"
                    />
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4 tracking-wide flex items-center gap-3 transition-colors duration-300">
                    <Sparkles className="w-6 h-6 text-pink-500 dark:text-gemini-pink animate-pulse transition-colors duration-300" />
                    成語導師正在評估...
                </h2>

                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md animate-pulse transition-colors duration-300">
                    正在分析您的決策風格與成語運用策略
                </p>

                <div className="mt-12 flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-3 h-3 bg-blue-500 dark:bg-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-colors duration-300"
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyzingScreen;
