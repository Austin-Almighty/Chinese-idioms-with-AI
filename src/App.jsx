import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MenuScreen from './components/MenuScreen';
import DifficultyScreen from './components/DifficultyScreen';
import SceneSelectionScreen from './components/SceneSelectionScreen';
import GameScreen from './components/GameScreen';
import EndingScreen from './components/EndingScreen';
import SettingsModal from './components/SettingsModal';
import { IDIOM_POOL } from './data/scenarios';
import { generateStoryContinuation, analyzeGameplay } from './services/gemini';

const App = () => {
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [selectedScene, setSelectedScene] = useState(null);
  const [storyLog, setStoryLog] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setGameState('scene_select');
  };

  const handleSceneSelect = (scene) => {
    setSelectedScene(scene);
    setStoryLog([{ type: 'system', text: scene.initialText }]);
    if (scene.customOptions) {
      setCurrentOptions(scene.customOptions);
    } else {
      setCurrentOptions([
        { id: 'A', ...IDIOM_POOL.aggressive[0] },
        { id: 'B', ...IDIOM_POOL.conservative[0] },
        { id: 'C', ...IDIOM_POOL.negative[0] },
      ]);
    }
    setTurnCount(1);
    setGameState('story');
  };

  const handleChoice = useCallback(async (choice) => {
    if (isLoading) return;
    setIsLoading(true);
    const choiceLog = { type: 'user', text: `選擇【${choice.idiom}】\n策略：${choice.strategy}` };

    const newLog = [...storyLog, choiceLog];
    setStoryLog(newLog);

    try {
      const result = await generateStoryContinuation(selectedScene, choice, newLog);

      setStoryLog(prev => [...prev, { type: 'system', text: result.story }]);
      setCurrentOptions(result.options);
      setTurnCount(prev => prev + 1);

      if (turnCount >= 3) {
        const analysis = await analyzeGameplay([...newLog, { type: 'system', text: result.story }]);
        setAnalysisResult(analysis);
        setGameState('ending');
      }
    } catch (error) {
      console.error("Error", error);
      setStoryLog(prev => [...prev, { type: 'system', text: "發生錯誤，請稍後再試。" }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, selectedScene, storyLog, turnCount]);

  const handleRestart = () => {
    setStoryLog([]);
    setTurnCount(0);
    setAnalysisResult(null);
    setGameState('menu');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'menu': return <MenuScreen key="menu" onStart={() => setGameState('difficulty')} onOpenSettings={() => setIsSettingsOpen(true)} />;
      case 'difficulty': return <DifficultyScreen key="difficulty" onSelect={handleDifficultySelect} />;
      case 'scene_select': return <SceneSelectionScreen key="scene_select" difficulty={difficulty} onSelect={handleSceneSelect} onBack={() => setGameState('difficulty')} />;
      case 'story': return (
        <GameScreen
          key="story"
          scene={selectedScene}
          storyLog={storyLog}
          options={currentOptions}
          isLoading={isLoading}
          onChoice={handleChoice}
          onBack={() => setGameState('scene_select')}
        />
      );
      case 'ending': return <EndingScreen key="ending" result={analysisResult} storyLog={storyLog} onRestart={handleRestart} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gemini-purple/20 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gemini-accent/20 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '-3s' }} />

      <div className="w-full max-w-6xl h-[90vh] glass-panel rounded-3xl overflow-hidden relative flex flex-col border border-white/10 shadow-2xl z-10">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default App;
