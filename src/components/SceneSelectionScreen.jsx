import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, BookOpen, GraduationCap, Coffee, Briefcase, TrendingUp, Cpu, HelpCircle, Grid, List, Play, X } from 'lucide-react';
import rawScenarios from '../data/情境.json';

const CATEGORIES = [
    { id: 'all', label: '全部', icon: Grid },
    { id: 'life', label: '日常生活', icon: Coffee },
    { id: 'modern', label: '職場挑戰', icon: Briefcase },
    { id: 'business', label: '商戰權謀', icon: TrendingUp },
    { id: 'classic', label: '古代歷史', icon: BookOpen },
    { id: 'scifi', label: '科幻冒險', icon: Cpu },
    { id: 'campus', label: '校園社交', icon: GraduationCap },
    { id: 'mystery', label: '懸疑推理', icon: HelpCircle },
];

const categoryKeywords = {
    classic: ['三國', '後宮', '漢朝', '王朝', '書生', '盜墓', '謀士', '將軍', '皇帝', '貴妃', '才人', '答應', '守城', '進京趕考', '摸金校尉', '秦始皇陵'],
    campus: ['學生', '社團', '學校', '宿舍', '考試', '魔法學院', '新生', '大學', '社長', '幹部'],
    life: ['民眾', '消費者', '鄰里', '聚餐', '相親', '父母', '朋友', '租屋', '旅遊', '餐廳', '便利商店', '捷運', '公園', '衣服', '下雨', '老人', '廁所', '打工', '外送', '家族', '逢年過節', '管委會', '私生子', '豪門'],
    modern: ['職場', '公司', '主管', '同事', '面試', '實習生', '經紀人', '廚師', '醫生', '護理師', '警察', '消防員', '藝人', '明星', '實況主', '創作者', '菜鳥', '急診室', '選秀', '偶像', '網路', '內容'],
    business: ['CEO', '創業', '談判', '併購', '投資', '股東', '商業', '競選', '市長', '候選人', '總幹事', '破產', '撤資', '新創', '規劃師', '都市', '財團'],
    scifi: ['太空', '末日', '喪屍', '荒島', '時空旅人', '外星', 'AI', '異世界', '倖存者', '火星', '殖民地', '引擎故障', '太空船', '艦長', '冒險者', '公會'],
    mystery: ['偵探', '兇手', '懸疑', '密室', '警察', '謎案', '私家', '線索', '證詞', '真相', '抽絲剝繭']
};

const getCategory = (role, content) => {
    const text = (role + content).toLowerCase();
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(k => text.includes(k))) return cat;
    }
    return 'life'; // Default
};

const categoryColors = {
    classic: '7f1d1d',
    campus: 'f472b6',
    life: '3b82f6',
    modern: '0ea5e9',
    business: '1e293b',
    scifi: '4c1d95',
    mystery: '525252'
};

// Transform JSON scenarios
const jsonScenarios = Object.entries(rawScenarios).map(([key, data], index) => {
    const category = getCategory(data['角色'], data['故事內容/衝突']);
    const scenarioNumber = index + 1;

    // Map AI-generated images for scenarios 1-42 (optimized WebP format)
    const imageUrl = scenarioNumber <= 42
        ? `/img/scenario${scenarioNumber}.webp`
        : "";

    return {
        id: `json_${scenarioNumber}`,
        category: category,
        title: `${data['角色']}`, // Use Role as title part
        desc: data['故事內容/衝突'],
        difficulty: 'any', // Available to all
        imageColor: categoryColors[category] || '64748b',
        imageUrl: imageUrl,
        initialText: data['故事內容/衝突'] // Use content as initial text
    };
});

// Use only JSON scenarios
const allScenarios = jsonScenarios;

const SceneSelectionScreen = ({ difficulty, onSelect, onBack }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const filteredScenarios = useMemo(() => {
        return allScenarios.filter(s => {
            const matchesDifficulty = true; // Allow all scenarios regardless of difficulty
            const matchesTab = activeTab === 'all' || s.category === activeTab;
            const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.desc.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDifficulty && matchesTab && matchesSearch;
        });
    }, [difficulty, activeTab, searchQuery]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { y: 10, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    const handleScenarioClick = (scene) => {
        setSelectedScenario(scene);
    };

    const handleConfirmStart = () => {
        if (selectedScenario) {
            setIsTransitioning(true);
            setTimeout(() => {
                onSelect(selectedScenario);
            }, 800); // Wait for transition animation
        }
    };

    const handleCloseModal = () => {
        setSelectedScenario(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full w-full overflow-hidden bg-white/40 dark:bg-slate-950/50 relative transition-colors duration-300"
        >
            {/* Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-[60] bg-white dark:bg-black flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 1, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="text-slate-900 dark:text-white font-serif text-3xl font-bold tracking-widest"
                        >
                            {selectedScenario?.title.split('：')[1] || selectedScenario?.title}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content (Scales down slightly during transition) */}
            <motion.div
                animate={isTransitioning ? { scale: 0.95, opacity: 0, filter: "blur(10px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex flex-col h-full w-full overflow-hidden"
            >
                {/* Header Area */}
                <div className="p-6 border-b border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <span className={`w-2 h-6 rounded-full bg-gradient-to-b ${difficulty === 'easy' ? 'from-emerald-400 to-teal-500' :
                                    difficulty === 'medium' ? 'from-blue-400 to-indigo-500' :
                                        'from-purple-400 to-pink-500'
                                    }`} />
                                選擇劇本
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {difficulty === 'easy' ? '簡單 (Easy)' : difficulty === 'medium' ? '中等 (Medium)' : '困難 (Hard)'}
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="搜尋劇本..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-gemini-accent/50 focus:ring-1 focus:ring-blue-500/50 dark:focus:ring-gemini-accent/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="px-6 py-4 border-b border-white/10 dark:border-white/5 overflow-x-auto custom-scrollbar">
                    <div className="flex gap-2 min-w-max">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-200 ${isActive
                                        ? 'bg-white dark:bg-white text-slate-900 shadow-lg shadow-black/5 dark:shadow-white/10'
                                        : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Scenarios Grid */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {filteredScenarios.length > 0 ? (
                        <motion.div
                            key={activeTab + difficulty} // Force re-render animation on tab change
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            {filteredScenarios.map(scene => (
                                <motion.div
                                    key={scene.id}
                                    variants={item}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleScenarioClick(scene)}
                                    className={`group relative glass-panel rounded-xl overflow-hidden cursor-pointer border border-white/20 dark:border-white/5 hover:border-blue-400/50 dark:hover:border-white/20 transition-all duration-300 flex flex-col h-full ${scene.id === 'red_chamber_poison' ? 'ring-1 ring-amber-500/30' : ''}`}
                                >
                                    {/* Image/Color Header */}
                                    <div className="h-24 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-white/5 to-transparent z-10" />
                                        <img
                                            src={scene.imageUrl || `https://placehold.co/600x400/${scene.imageColor}/1e293b?text=${encodeURIComponent(scene.title.split('：')[0])}`}
                                            alt={scene.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                                        />
                                        {/* Category Badge */}
                                        <div className="absolute top-2 right-2 z-20">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/80 dark:bg-black/50 text-slate-900 dark:text-white backdrop-blur-sm border border-white/20 dark:border-white/10 uppercase tracking-wider">
                                                {CATEGORIES.find(c => c.id === scene.category)?.label || scene.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-gemini-accent transition-colors">
                                            {scene.title.split('：')[1] || scene.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-3 flex-1">
                                            {scene.desc}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200 dark:border-white/5">
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {scene.id.slice(0, 6)}</span>
                                            <span className="text-xs text-blue-500 dark:text-gemini-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-medium">
                                                選擇 →
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-64 text-slate-500"
                        >
                            <Search className="w-12 h-12 mb-4 opacity-20" />
                            <p>沒有找到符合條件的劇本</p>
                            <button
                                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                                className="mt-4 text-sm text-blue-500 dark:text-gemini-accent hover:underline"
                            >
                                清除篩選
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {selectedScenario && !isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="relative h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10" />
                                <img
                                    src={selectedScenario.imageUrl || `https://placehold.co/600x400/${selectedScenario.imageColor}/1e293b?text=${encodeURIComponent(selectedScenario.title.split('：')[0])}`}
                                    alt={selectedScenario.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover opacity-90 dark:opacity-60"
                                />
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-slate-800 hover:text-white dark:text-white/70 dark:hover:text-white transition-colors backdrop-blur-sm"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 -mt-12 relative z-20">
                                <div className="inline-block px-3 py-1 rounded-full bg-blue-500 dark:bg-gemini-accent text-white text-xs font-bold mb-4 shadow-lg">
                                    {difficulty === 'easy' ? '簡單' : difficulty === 'medium' ? '中等' : '困難'}
                                </div>
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-3 font-serif">
                                    {selectedScenario.title.split('：')[1] || selectedScenario.title}
                                </h3>
                                <div className="flex items-center gap-2 text-base text-slate-500 dark:text-slate-400 mb-4">
                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                        {CATEGORIES.find(c => c.id === selectedScenario.category)?.label}
                                    </span>
                                    <span>•</span>
                                    <span>{selectedScenario.title.split('：')[0]}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8">
                                    {selectedScenario.desc}
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCloseModal}
                                        className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-base"
                                    >
                                        再想想
                                    </button>
                                    <button
                                        onClick={handleConfirmStart}
                                        className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gemini-accent dark:to-gemini-purple text-white font-bold text-base shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-gemini-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        開始挑戰
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SceneSelectionScreen;
