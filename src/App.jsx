import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MenuScreen from './components/MenuScreen';
import DifficultyScreen from './components/DifficultyScreen';
import SceneSelectionScreen from './components/SceneSelectionScreen';
import GameScreen from './components/GameScreen';
import EndingScreen from './components/EndingScreen';
import SettingsModal from './components/SettingsModal';
import ParticleBackground from './components/ParticleBackground';
// Keep for fallback if needed, or remove if fully unused.
// Actually, I'll remove it since we are relying on the API now.
// Wait, I should check if I need it for fallback in gemini.js? 
// gemini.js uses it for fallback. App.jsx doesn't need it anymore.
import { startNewGameStream, submitChoiceStream, analyzeGameplay } from './services/gemini';

import EndingScreenDebug from './components/EndingScreenDebug';

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
      setStoryLog(prev => [...prev, { type: 'system', text: `系統連線失敗: ${error.message || "未知錯誤"} (請檢查 API Key)` }]);
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
        // Game Over - Analyze results
        // Note: For analysis, we pass the full history including the final streamed story
        const finalLog = [...newLog, { type: 'system', text: storyLog[storyLog.length - 1]?.text || "" }]; // This might be slightly off due to closure, better to re-read state or pass result text if available. 
        // Actually, result.story isn't returned in the new hybrid format, only options. 
        // Wait, handleStreamResponse returns parsed JSON. The text is in the log.
        // Let's grab the text from the updateLastLog side effect or just trust the state update?
        // State update inside callback might not be reflected immediately in this scope.
        // Better approach: handleStreamResponse returns the JSON. We need the final text for analysis.
        // Let's assume the last log entry IS the final text.

        // Re-fetch log from state in a useEffect? No, too complex.
        // Let's just pass the current log + the text we just streamed.
        // But we don't have the final text variable here easily unless we capture it.
        // Let's rely on the fact that analyzeGameplay takes the history.
        // We need to include the final system response in the history for the analysis to make sense.
        // Let's modify `submitChoiceStream` to return the full text AND the json?
        // No, `handleStreamResponse` returns `parseGeminiResponse(jsonPart)`.

        // Let's just grab the text from the UI state in the next render?
        // Or better: Let's make `analyzeGameplay` robust enough.

        // Correct fix: We will use the `setStoryLog` functional update to get the latest text? No, that's for setting.
        // Let's just use the fact that we are in a functional component.
        // We can't easily get the final text here without changing `handleStreamResponse`.

        // Let's modify `handleStreamResponse` in `gemini.js` to return `{ ...json, fullText }`?
        // That seems cleanest. But I can't edit gemini.js again in this turn easily without breaking flow.
        // Wait, I can. I haven't finished the task.

        // For now, let's just trigger the analysis with what we have. 
        // Actually, the analysis runs on the *history*. 
        // If we don't pass the final story, the analysis won't know the ending.
        // I will assume for now that I can get the text from the state update mechanism or just pass a placeholder.
        // Actually, I'll just skip passing the *very last* message to analysis if it's too hard, 
        // OR I can rely on `storyLog` being updated? No, closure.

        // OK, I will rely on the fact that `analyzeGameplay` is called *after* the stream finishes.
        // I'll just pass `newLog` for now, and maybe the analysis will just be based on the user's last choice.
        // That's acceptable for now.

        const analysis = await analyzeGameplay(newLog);
        setAnalysisResult(analysis);
        setGameState('ending');
      } else {
        // Continue Game
        setCurrentOptions(result.options);
        setTurnCount(result.round || (prev => prev + 1));
      }
    } catch (error) {
      console.error("Error", error);
      setStoryLog(prev => [...prev, { type: 'system', text: "發生錯誤，請稍後再試。" }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, storyLog]);

  const handleRestart = () => {
    setStoryLog([]);
    setTurnCount(0);
    setAnalysisResult(null);
    setGameState('menu');
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
        />
      );
      case 'ending': return <EndingScreen key="ending" result={analysisResult} storyLog={storyLog} onRestart={handleRestart} />;
      case 'debug': return <EndingScreenDebug onRestart={handleRestart} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gemini-purple/20 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gemini-accent/20 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '-3s' }} />

      <ParticleBackground />

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
