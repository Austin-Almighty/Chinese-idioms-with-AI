import React, { useState, useEffect } from 'react';
import { X, Settings, Key, Cpu, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiKey, setApiKey, getStoredModel, setStoredModel } from '../services/gemini';
import { useTheme } from '../context/ThemeContext';

const MODELS = [
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Latest)' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Fastest)' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Stable)' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Lightweight)' },
    { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)' }
];

const SettingsModal = ({ isOpen, onClose }) => {
    const [key, setKey] = useState('');
    const [model, setModel] = useState('gemini-2.5-flash');
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (isOpen) {
            setKey(getApiKey() || '');
            setModel(getStoredModel() || 'gemini-2.5-flash');
        }
    }, [isOpen]);

    const handleSave = () => {
        setApiKey(key);
        setStoredModel(model);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10 transition-colors duration-300"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-500 dark:text-gemini-accent" />
                                設定
                            </h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6 mb-6">
                            {/* Theme Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-500 dark:text-purple-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
                                    外觀主題
                                </label>
                                <button
                                    onClick={toggleTheme}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between group hover:border-blue-400 dark:hover:border-gemini-accent transition-all"
                                >
                                    <span className="text-slate-700 dark:text-slate-200 font-medium">
                                        {theme === 'dark' ? '深色模式 (Dark Mode)' : '淺色模式 (Light Mode)'}
                                    </span>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-purple-600' : 'bg-slate-300'}`}>
                                        <motion.div
                                            layout
                                            initial={false}
                                            animate={{ x: theme === 'dark' ? 24 : 0 }}
                                            className="w-4 h-4 bg-white rounded-full shadow-sm"
                                        />
                                    </div>
                                </button>
                            </div>

                            {/* API Key Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Key className="w-4 h-4 text-purple-500 dark:text-gemini-purple" />
                                    Google Gemini API Key
                                </label>
                                <input
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-gemini-accent focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-gemini-accent/20 outline-none transition-all font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    已預設 Demo API Key。若需使用自己的 Key,請在此輸入並儲存。
                                </p>
                            </div>

                            {/* Model Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    AI Model
                                </label>
                                <div className="relative">
                                    <select
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {MODELS.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    選擇不同的模型可能會影響回答的速度與品質。
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-500 dark:bg-gemini-accent text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                            >
                                儲存設定
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
