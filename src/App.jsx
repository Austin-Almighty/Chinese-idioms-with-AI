import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MenuScreen from './components/MenuScreen';
import DifficultyScreen from './components/DifficultyScreen';
import SceneSelectionScreen from './components/SceneSelectionScreen';
import GameScreen from './components/GameScreen';
import EndingScreen from './components/EndingScreen';
import SettingsModal from './components/SettingsModal';
import AnalyzingScreen from './components/AnalyzingScreen';
import ParticleBackground from './components/ParticleBackground';
// Keep for fallback if needed, or remove if fully unused.
// Actually, I'll remove it since we are relying on the API now.
// Wait, I should check if I need it for fallback in gemini.js? 
// gemini.js uses it for fallback. App.jsx doesn't need it anymore.
import { startNewGameStream, submitChoiceStream, analyzeGameplay } from './services/gemini';
import Header from './components/Header';

import EndingScreenDebug from './components/EndingScreenDebug';
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedScene, setSelectedScene] = useState(null);
  const [storyLog, setStoryLog] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setGameState('scene_select');
  };

  const updateLastLog = (text) => {
    setStoryLog(prev => {
      const newLog = [...prev];
      if (newLog.length > 0 && newLog[newLog.length - 1].type === 'system') {
        newLog[newLog.length - 1].text = text;
      } else {
        newLog.push({ type: 'system', text });
      }
      return newLog;
    });
  };

  const handleSceneSelect = async (scene) => {
    setSelectedScene(scene);
    setGameState('story');
    setStoryLog([{ type: 'system', text: scene.initialText }]);
    setCurrentOptions([]); // Clear options while loading
    setIsLoading(true);

    try {
      // Add a placeholder for the new story segment
      setStoryLog(prev => [...prev, { type: 'system', text: "..." }]);

      // Initialize the game with the AI (Streaming)
      const result = await startNewGameStream(scene, difficulty, (text) => {
        updateLastLog(text);
      });

      setCurrentOptions(result.options);
      setTurnCount(1);
    } catch (error) {
      console.error("Failed to start game:", error);
      const errorMessage = error.userMessage || error.message || "未知錯誤";
      setStoryLog(prev => [...prev, { type: 'system', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = useCallback(async (choice) => {
    if (isLoading) return;
    setIsLoading(true);
    const choiceLog = { type: 'user', text: `選擇【${choice.idiom}】\n策略：${choice.strategy}` };

    const newLog = [...storyLog, choiceLog];
    setStoryLog(newLog);

    try {
      // Add placeholder for system response
      setStoryLog(prev => [...prev, { type: 'system', text: "..." }]);

      const result = await submitChoiceStream(choice, (text) => {
        updateLastLog(text);
      });

      if (result.is_game_over) {
        // Game Over - Stay on GameScreen, show summary button
        setIsGameOver(true);
        setCurrentOptions([]); // Clear options to show summary button
      } else {
        // Continue Game
        setCurrentOptions(result.options);
        setTurnCount(result.round || (prev => prev + 1));
      }
    } catch (error) {
      console.error("Error", error);
      const errorMessage = error.userMessage || error.message || "發生錯誤，請稍後再試。";
      setStoryLog(prev => [...prev, { type: 'system', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, storyLog]);

  const handleViewSummary = useCallback(async () => {
    setIsLoading(true);
    setGameState('analyzing');

    try {
      const analysis = await analyzeGameplay(storyLog);
      setAnalysisResult(analysis);
      setGameState('ending');
    } catch (error) {
      console.error("Analysis error:", error);
      // Still show ending screen with fallback data
      setGameState('ending');
    } finally {
      setIsLoading(false);
    }
  }, [storyLog]);

  const handleRestart = () => {
    setGameState('menu');
    setSelectedScene(null);
    setStoryLog([]);
    setCurrentOptions([]);
    setTurnCount(0);
    setAnalysisResult(null);
    setIsGameOver(false);
  };

  const renderContent = () => {
    switch (gameState) {
      case 'menu': return <MenuScreen key="menu" onStart={() => setGameState('difficulty')} onOpenSettings={() => setIsSettingsOpen(true)} />;
      case 'difficulty': return <DifficultyScreen key="difficulty" onSelect={handleDifficultySelect} onBack={() => setGameState('menu')} />;
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
          isGameOver={isGameOver}
          onViewSummary={handleViewSummary}
        />
      );
      case 'analyzing': return <AnalyzingScreen key="analyzing" />;
      case 'ending': return <EndingScreen key="ending" result={analysisResult} storyLog={storyLog} onRestart={handleRestart} />;
      case 'debug': return <EndingScreenDebug onRestart={handleRestart} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 font-sans relative overflow-hidden">
      {/* Background Orbs - Smaller on mobile */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-200/30 dark:bg-gemini-purple/20 rounded-full blur-[100px] pointer-events-none animate-float transition-colors duration-500" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-purple-200/30 dark:bg-gemini-accent/20 rounded-full blur-[120px] pointer-events-none animate-float transition-colors duration-500" style={{ animationDelay: '-3s' }} />

      <ParticleBackground />



      <div className="w-full h-screen sm:h-[90vh] sm:max-w-6xl glass-panel sm:rounded-3xl overflow-hidden relative flex flex-col border-0 sm:border border-white/20 dark:border-white/10 shadow-2xl z-10 transition-colors duration-300">
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onHome={() => setGameState('menu')}
        />
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <Toaster />
    </div>
  );
};

export default App;
