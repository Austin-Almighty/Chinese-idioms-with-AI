import { GoogleGenerativeAI } from "@google/generative-ai";
import { IDIOM_POOL } from "../data/scenarios";

const API_KEY_STORAGE_KEY = "gemini_api_key";

export const getApiKey = () => localStorage.getItem(API_KEY_STORAGE_KEY);
export const setApiKey = (key) => localStorage.setItem(API_KEY_STORAGE_KEY, key);

const getGenAI = () => {
  const key = getApiKey();
  if (!key) throw new Error("API Key not found");
  return new GoogleGenerativeAI(key);
};

export const generateStoryContinuation = async (scene, choice, history) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a creative writing assistant for an interactive fiction game about Chinese idioms.
      
      Current Scenario: ${scene.title}
      Description: ${scene.desc}
      Initial Context: ${scene.initialText}
      
      History of events:
      ${history.map(h => `${h.type === 'user' ? 'User Choice' : 'System Story'}: ${h.text}`).join('\n')}
      
      The user just chose the idiom: "${choice.idiom}"
      Strategy description: "${choice.strategy}"
      Literal meaning: "${choice.literal}"
      
      Task:
      1. Analyze if this idiom is appropriate for the current situation (Aggressive, Conservative, or Negative/Misused).
      2. Generate a continuation of the story (max 150 words) describing the outcome of this action.
         - If the choice was good, show a positive progression but maybe a new challenge.
         - If the choice was bad (negative idiom or poor strategy), show the consequences.
      3. Provide 3 new idiom options for the NEXT turn.
         - One Aggressive/Bold option.
         - One Conservative/Smart option.
         - One Negative/Poor option.
         - For each option, provide: idiom, literal meaning, and a strategy description relevant to the NEW situation.
      
      Output Format (JSON):
      {
        "story": "The story continuation...",
        "analysis": "Brief analysis of the user's move (e.g., 'Aggressive move, but risky...')",
        "options": [
          { "id": "A", "idiom": "...", "literal": "...", "strategy": "..." },
          { "id": "B", "idiom": "...", "literal": "...", "strategy": "..." },
          { "id": "C", "idiom": "...", "literal": "...", "strategy": "..." }
        ]
      }
      
      IMPORTANT: Return ONLY valid JSON. Do not use Markdown code blocks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code blocks if the model adds them
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails or key is missing
    return {
      story: "系統無法連接到 AI 腦波 (請檢查 API Key)。但你的決策已記錄。\n\n(模擬回應) 你使用了這個成語，局勢發生了變化...",
      analysis: "API Error",
      options: [
        { id: 'A', ...IDIOM_POOL.aggressive[0] },
        { id: 'B', ...IDIOM_POOL.conservative[0] },
        { id: 'C', ...IDIOM_POOL.negative[0] }
      ]
    };
  }
};

export const analyzeGameplay = async (history) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze the following gameplay session of the "Idiom Survival Guide".
      
      History:
      ${history.map(h => `${h.type === 'user' ? 'User Choice' : 'System Story'}: ${h.text}`).join('\n')}
      
      Task:
      1. Determine the player's style (e.g., The Thinker, The Doer, The Learner).
      2. Provide a detailed evaluation of their understanding of idioms and strategy.
      3. Count the types of strategies used (Aggressive, Conservative, Negative).
      
      Output Format (JSON):
      {
        "title": "Player Title (e.g., 深思熟慮的智者)",
        "evaluation": "Detailed evaluation text...",
        "stats": {
          "aggressive": 2,
          "conservative": 1,
          "negative": 0
        }
      }
      
      IMPORTANT: Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      title: "未知旅人",
      evaluation: "無法連接 AI 進行分析。但你完成了一次精彩的冒險！",
      stats: { aggressive: 0, conservative: 0, negative: 0 }
    };
  }
};
