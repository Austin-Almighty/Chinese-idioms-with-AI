import React, { useState, useEffect } from 'react';
import { Settings, Key, Cpu, Sun, Moon } from 'lucide-react';
import { getApiKey, setApiKey, getStoredModel, setStoredModel } from '../services/gemini';
import { useTheme } from '../context/ThemeContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

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
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setKey(getApiKey() || '');
            setModel(getStoredModel() || 'gemini-2.5-flash');
        }
    }, [isOpen]);

    const handleSave = () => {
        setApiKey(key);
        setStoredModel(model);
        toast({
            title: "設定已儲存",
            description: "您的 API Key 和模型偏好已更新。",
        })
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white/99 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white font-bold">
                        <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        設定
                    </DialogTitle>
                    <DialogDescription className="text-slate-700 dark:text-slate-300 font-medium">
                        調整遊戲外觀與 AI 模型參數。
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="theme-mode" className="flex flex-col space-y-1">
                            <span className="font-medium text-slate-900 dark:text-white">外觀主題</span>
                            <span className="font-normal text-xs text-slate-600 dark:text-slate-400">
                                {theme === 'dark' ? '目前為深色模式' : '目前為淺色模式'}
                            </span>
                        </Label>
                        <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-orange-500" />
                            <Switch
                                id="theme-mode"
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                            />
                            <Moon className="h-4 w-4 text-purple-500" />
                        </div>
                    </div>

                    {/* API Key Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="api-key" className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                            <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Google Gemini API Key
                        </Label>
                        <input
                            id="api-key"
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="flex h-10 w-full rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono text-slate-900 dark:text-white"
                        />
                        <p className="text-[0.8rem] text-slate-600 dark:text-slate-400">
                            已預設 Demo API Key。若需使用自己的 Key,請在此輸入。
                        </p>
                    </div>

                    {/* Model Selection */}
                    <div className="grid gap-2">
                        <Label htmlFor="model" className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            AI Model
                        </Label>
                        <select
                            id="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="flex h-10 w-full items-center justify-between rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-white"
                        >
                            {MODELS.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSave} className="w-full sm:w-auto">
                        儲存設定
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;
