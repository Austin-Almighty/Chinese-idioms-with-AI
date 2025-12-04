import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Settings } from 'lucide-react';

const MenuScreen = ({ onStart, onOpenSettings }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden h-full w-full p-4 sm:p-8">
        {/* Decorative Elements - Hidden on small screens */}
        <div className="absolute top-10 left-10 text-white/5 text-6xl sm:text-9xl font-serif select-none pointer-events-none hidden sm:block">知</div>
        <div className="absolute bottom-10 right-10 text-white/5 text-6xl sm:text-9xl font-serif select-none pointer-events-none hidden sm:block">行</div>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <button onClick={onOpenSettings} className="p-2 sm:p-3 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        </div>

        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1 rounded-full bg-gemini-purple/20 border border-gemini-purple/30 text-gemini-purple text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>成語文字冒險遊戲</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 tracking-tight font-serif text-white drop-shadow-lg">
                跟AI玩成語<br />
                <span className="text-2xl sm:text-3xl md:text-5xl font-light opacity-80 mt-2 sm:mt-4 block text-gradient">
                    情境模擬器
                </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-12 max-w-lg mx-auto font-light leading-relaxed px-4">
                不僅僅是背誦，而是理解。<br />透過真實情境的抉擇，讀懂成語背後的智慧與策略。
            </p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="group relative px-8 py-3 sm:px-12 sm:py-4 bg-gradient-to-r from-gemini-accent to-gemini-purple text-white text-lg sm:text-xl font-bold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all overflow-hidden">
                <span className="relative z-10">開始情境挑戰</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
        </motion.div>
    </motion.div>
);

export default MenuScreen;
