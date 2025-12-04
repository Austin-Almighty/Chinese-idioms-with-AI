import React from 'react';
import { Sparkles, Settings, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ onOpenSettings, onHome }) => {
    return (
        <header className="sticky top-0 z-50 w-full px-4 py-3 flex items-center justify-between bg-white/40 dark:bg-black/20 backdrop-blur-md border-b border-white/20 dark:border-white/10 transition-colors duration-300">
            <button
                onClick={onHome}
                className="flex items-center gap-2 group"
            >
                <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-gemini-accent/10 group-hover:bg-blue-500/20 dark:group-hover:bg-gemini-accent/20 transition-colors">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-gemini-accent" />
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white hidden sm:block">
                    成語生存指南
                </span>
            </button>

            <button
                onClick={onOpenSettings}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-all"
                aria-label="Settings"
            >
                <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        </header>
    );
};

export default Header;
