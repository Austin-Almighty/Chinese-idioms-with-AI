import React, { useState, useEffect } from 'react';
import { X, Settings, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiKey, setApiKey } from '../services/gemini';

const SettingsModal = ({ isOpen, onClose }) => {
    const [key, setKey] = useState('');

    useEffect(() => {
        if (isOpen) {
            setKey(getApiKey() || '');
        }
    }, [isOpen]);

    const handleSave = () => {
        setApiKey(key);
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
                        className="bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gemini-accent" />
                                設定
                            </h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <Key className="w-4 h-4 text-gemini-purple" />
                                Google Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-gemini-accent focus:ring-2 focus:ring-gemini-accent/20 outline-none transition-all font-mono text-sm placeholder:text-slate-600"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                您的 API Key 僅會儲存在瀏覽器端，用於與 Google Gemini 進行對話。
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-gemini-accent text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
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
