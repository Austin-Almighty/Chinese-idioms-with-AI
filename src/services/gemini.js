import { GoogleGenerativeAI } from "@google/generative-ai";
import { GAME_SYSTEM_PROMPT } from "../data/prompts";

const API_KEY_STORAGE_KEY = "gemini_api_key";
const API_MODEL_STORAGE_KEY = "gemini_model";

export const getApiKey = () => localStorage.getItem(API_KEY_STORAGE_KEY);
export const setApiKey = (key) => localStorage.setItem(API_KEY_STORAGE_KEY, key);

export const getStoredModel = () => localStorage.getItem(API_MODEL_STORAGE_KEY) || "gemini-1.5-pro";
export const setStoredModel = (model) => localStorage.setItem(API_MODEL_STORAGE_KEY, model);

const getGenAI = () => {
  const key = getApiKey();
  if (!key) throw new Error("API Key not found");
  return new GoogleGenerativeAI(key);
};

// Store the chat session in memory
let chatSession = null;

const SEPARATOR = "---JSON---";

const handleStreamResponse = async (result, onUpdate) => {
  let fullText = "";
  let jsonPart = "";
  let isJsonFound = false;

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;

    if (!isJsonFound) {
      if (fullText.includes(SEPARATOR)) {
        isJsonFound = true;
        const [storyPart, potentialJson] = fullText.split(SEPARATOR);
        onUpdate(storyPart.trim()); // Final update for story text
        jsonPart = potentialJson || "";
      } else {
        onUpdate(fullText);
      }
    } else {
      jsonPart += chunkText;
    }
  }

  // If separator wasn't found during stream (edge case), try to split at the end
  if (!isJsonFound && fullText.includes(SEPARATOR)) {
    const [storyPart, potentialJson] = fullText.split(SEPARATOR);
    onUpdate(storyPart.trim());
    jsonPart = potentialJson;
  }

  console.log("[Gemini API] Raw Output:", fullText);

  return parseGeminiResponse(jsonPart);
};

export const startNewGameStream = async (scenario, difficulty, onUpdate) => {
  try {
    const genAI = getGenAI();
    const modelId = getStoredModel();
    const model = genAI.getGenerativeModel({ model: modelId });

    chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: GAME_SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to start the game. Please provide the setting and difficulty." }],
        },
      ],
    });

    const msg = `
      Setting: ${scenario.title}
      Difficulty: ${difficulty}
      Description: ${scenario.desc}
      Initial Context: ${scenario.initialText}
      
      Start Round 1.
    `;

    console.log(`[Gemini API] Input (Start Game) [Model: ${modelId}]:`, msg);

    const result = await chatSession.sendMessageStream(msg);
    return handleStreamResponse(result, onUpdate);

  } catch (error) {
    console.error("[Gemini API] Start Game Error:", error);
    throw error;
  }
};

export const submitChoiceStream = async (choice, onUpdate) => {
  if (!chatSession) throw new Error("Game session not started");

  try {
    const msg = `User chose Option ${choice.id}: ${choice.idiom}`;
    console.log("[Gemini API] Input (Submit Choice):", msg);
    const result = await chatSession.sendMessageStream(msg);
    return handleStreamResponse(result, onUpdate);
  } catch (error) {
    console.error("[Gemini API] Submit Choice Error:", error);
    throw error;
  }
};

const parseGeminiResponse = (text) => {
  try {
    // Clean up potential markdown code blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    return {
      round: 0,
      is_game_over: false,
      options: []
    };
  }
};

export const analyzeGameplay = async (history) => {
  try {
    const genAI = getGenAI();
    const modelId = getStoredModel();
    const model = genAI.getGenerativeModel({ model: modelId });

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

    console.log("[Gemini API] Input (Analysis):", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("[Gemini API] Output (Analysis):", text);

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("[Gemini API] Analysis Error:", error);
    return {
      title: "未知旅人",
      evaluation: "無法連接 AI 進行分析。但你完成了一次精彩的冒險！",
      stats: { aggressive: 0, conservative: 0, negative: 0 }
    };
  }
};
