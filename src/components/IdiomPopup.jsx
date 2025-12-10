import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Loader2 } from 'lucide-react';
import { getIdiomExplanation } from '../services/gemini';

/**
 * IdiomPopup - Floating popup to display idiom definition from Gemini API
 * @param {string} idiomName - Name of the idiom to explain
 * @param {string} difficulty - Current game difficulty
 * @param {object} cachedData - Previously fetched data (if available)
 * @param {function} onDataFetched - Callback when new data is fetched
 * @param {function} onClose - Callback to close popup
 */
const IdiomPopup = ({ idiomName, difficulty, cachedData, onDataFetched, onClose }) => {
    const [idiomData, setIdiomData] = useState(cachedData || null);
    const [loading, setLoading] = useState(!cachedData);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchIdiomData() {
            // If we have cached data, use it immediately
            if (cachedData) {
                console.log('[IdiomPopup] Using cached data for:', idiomName);
                setIdiomData(cachedData);
                setLoading(false);
                return;
            }

            // Otherwise, fetch from API
            if (!idiomName) {
                setLoading(false);
                setError('沒有提供成語名稱');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log('[IdiomPopup] Fetching from API for:', idiomName);
                const data = await getIdiomExplanation(idiomName, difficulty);
                setIdiomData(data);
                // Notify parent to cache this data
                if (onDataFetched) {
                    onDataFetched(idiomName, data);
                }
            } catch (err) {
                console.error('[IdiomPopup] Failed to fetch idiom:', err);
                setError(err.userMessage || '無法取得成語解釋');
            } finally {
                setLoading(false);
            }
        }

        fetchIdiomData();
    }, [idiomName, difficulty, cachedData, onDataFetched]);

    // Determine which columns to show based on difficulty
    // Handle both English ('easy') and Chinese ('簡單') difficulty values
    const isEasy = difficulty === '簡單' || difficulty === 'easy' || difficulty === 'Easy';

    // Default display data for loading/error states or if idiomData is null
    const displayData = idiomData || {
        idiom: idiomName || '未知成語',
        definition: '此成語不在資料庫中。',
        usage: '此成語可能是 AI 自創或不在我們的篩選清單內。',
        simple: '找不到這個成語的資料。'
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

                {/* Popup Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-br from-purple-500 to-blue-600 dark:from-gemini-purple dark:to-gemini-accent p-4 relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-white" />
                                <h3 className="text-2xl font-bold text-white">{idiomName}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            // Loading state
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-10 h-10 text-purple-500 dark:text-gemini-purple animate-spin mb-3" />
                                <p className="text-slate-500 dark:text-slate-400 text-lg">AI 正在查詢成語資料...</p>
                            </div>
                        ) : error ? (
                            // Error state
                            <div className="text-center py-8">
                                <p className="text-red-600 dark:text-red-400 mb-2 text-lg">{error}</p>
                                <p className="text-base text-slate-500 dark:text-slate-400">請稍後再試或關閉此視窗</p>
                            </div>
                        ) : idiomData ? (
                            // Success state - show idiom data
                            <>
                                {/* Definition */}
                                <div>
                                    <h4 className="text-base font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                        釋義 / Definition
                                    </h4>
                                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg">
                                        {idiomData.definition}
                                    </p>
                                </div>

                                {/* Conditional content based on difficulty */}
                                {isEasy && idiomData.simple ? (
                                    // Easy mode: Show simple explanation
                                    <div>
                                        <h4 className="text-base font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                            簡單解釋 / Simple Explanation
                                        </h4>
                                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 text-lg">
                                            {idiomData.simple}
                                        </p>
                                    </div>
                                ) : idiomData.usage ? (
                                    // Medium/Hard mode: Show usage explanation
                                    <div>
                                        <h4 className="text-base font-semibold text-slate-500 dark:text-slate-400 mb-2">
                                            用法說明 / Usage Guide
                                        </h4>
                                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 text-lg">
                                            {idiomData.usage}
                                        </p>
                                    </div>
                                ) : null}
                            </>
                        ) : null}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-white/10">
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                            由 Gemini AI 生成 · 點擊外部或按 ESC 關閉
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default IdiomPopup;
