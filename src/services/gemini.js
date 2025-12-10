import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { GAME_SYSTEM_PROMPT } from "../data/prompts";
import { handleGeminiError } from "./errorHandler";

const API_KEY_STORAGE_KEY = "gemini_api_key";
const API_MODEL_STORAGE_KEY = "gemini_model";
const CACHE_STORAGE_KEY = "gemini_idioms_cache";

// Get API key from localStorage first, then fall back to environment variable
export const getApiKey = () => {
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedKey) return storedKey;
  
  // Fall back to environment variable for demo/testing
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  return envKey || null;
};

export const setApiKey = (key) => localStorage.setItem(API_KEY_STORAGE_KEY, key);

export const getStoredModel = () => localStorage.getItem(API_MODEL_STORAGE_KEY) || "gemini-2.5-flash";
export const setStoredModel = (model) => localStorage.setItem(API_MODEL_STORAGE_KEY, model);

// Legacy SDK client (for non-cached operations)
const getGenAI = () => {
  const key = getApiKey();
  if (!key || key === 'your_api_key_here') {
    throw new Error("API Key not configured. Please add your Gemini API key to the .env file or Settings.");
  }
  return new GoogleGenerativeAI(key);
};

// New SDK client (for cached operations)
const getGenAIWithCache = () => {
  const key = getApiKey();
  if (!key || key === 'your_api_key_here') {
    throw new Error("API Key not configured. Please add your Gemini API key to the .env file or Settings.");
  }
  return new GoogleGenAI({ apiKey: key });
};

// ============================================
// CACHE MANAGEMENT
// ============================================

/**
 * Initialize or retrieve the idioms cache
 * @returns {Promise<{cacheName: string, model: string, expiresAt: number}>}
 */
export async function initializeIdiomsCache() {
  // Check for existing valid cache in sessionStorage
  const stored = sessionStorage.getItem(CACHE_STORAGE_KEY);
  if (stored) {
    const cacheInfo = JSON.parse(stored);
    if (Date.now() < cacheInfo.expiresAt) {
      console.log("[Cache] Using existing cache:", cacheInfo.cacheName);
      return cacheInfo;
    }
    console.log("[Cache] Cache expired, creating new one...");
    sessionStorage.removeItem(CACHE_STORAGE_KEY);
  }

  // Create new cache via Netlify function
  console.log("[Cache] Initializing idioms cache...");
  const response = await fetch("/.netlify/functions/init-cache");
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to initialize idioms cache");
  }

  const cacheInfo = await response.json();
  sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cacheInfo));
  
  console.log("[Cache] New cache created:", cacheInfo.cacheName);
  console.log("[Cache] Token count:", cacheInfo.tokenCount);
  
  return cacheInfo;
}

/**
 * Clear the cached content (for debugging/testing)
 */
export function clearIdiomsCache() {
  sessionStorage.removeItem(CACHE_STORAGE_KEY);
  console.log("[Cache] Cache cleared");
}

// ============================================
// STREAMING & RESPONSE HANDLING
// ============================================

// Store conversation history for cached sessions
let cachedConversationHistory = [];
let currentCacheInfo = null;

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
        onUpdate(storyPart.trim());
        jsonPart = potentialJson || "";
      } else {
        onUpdate(fullText);
      }
    } else {
      jsonPart += chunkText;
    }
  }

  if (!isJsonFound && fullText.includes(SEPARATOR)) {
    const [storyPart, potentialJson] = fullText.split(SEPARATOR);
    onUpdate(storyPart.trim());
    jsonPart = potentialJson;
  }

  console.log("[Gemini API] Raw Output:", fullText);

  return parseGeminiResponse(jsonPart);
};

// Handle streaming for new SDK (slightly different structure)
const handleNewSdkStreamResponse = async (response, onUpdate) => {
  let fullText = "";
  let jsonPart = "";
  let isJsonFound = false;

  // The new SDK returns an async iterable directly
  for await (const chunk of response) {
    const chunkText = chunk.text || "";
    fullText += chunkText;

    if (!isJsonFound) {
      if (fullText.includes(SEPARATOR)) {
        isJsonFound = true;
        const [storyPart, potentialJson] = fullText.split(SEPARATOR);
        onUpdate(storyPart.trim());
        jsonPart = potentialJson || "";
      } else {
        onUpdate(fullText);
      }
    } else {
      jsonPart += chunkText;
    }
  }

  if (!isJsonFound && fullText.includes(SEPARATOR)) {
    const [storyPart, potentialJson] = fullText.split(SEPARATOR);
    onUpdate(storyPart.trim());
    jsonPart = potentialJson;
  }

  console.log("[Gemini API] Raw Output:", fullText);

  return { parsedData: parseGeminiResponse(jsonPart), fullText };
};

// ============================================
// GAME FUNCTIONS (with Cache Support)
// ============================================

export const startNewGameStream = async (scenario, difficulty, onUpdate) => {
  try {
    // Initialize cache (will use existing if valid)
    const cacheInfo = await initializeIdiomsCache();
    currentCacheInfo = cacheInfo;
    
    const ai = getGenAIWithCache();
    
    // Build the game prompt (system instruction is already in the cache)
    const gamePrompt = `${GAME_SYSTEM_PROMPT}

設定：${scenario.title}
難度：${difficulty}
描述：${scenario.desc}
初始情境：${scenario.initialText}

開始第 1 回合。`;

    console.log(`[Gemini API] Starting game with cached idioms [Model: ${cacheInfo.model}]`);

    // Reset conversation history for new game
    cachedConversationHistory = [
      { role: "user", parts: [{ text: gamePrompt }] }
    ];

    const response = await ai.models.generateContentStream({
      model: cacheInfo.model,
      contents: gamePrompt,
      config: { 
        cachedContent: cacheInfo.cacheName,
      },
    });

    const { parsedData, fullText } = await handleNewSdkStreamResponse(response, onUpdate);
    
    // Store model response in history
    cachedConversationHistory.push({ role: "model", parts: [{ text: fullText }] });

    return parsedData;

  } catch (error) {
    console.error("[Gemini API] Start Game Error:", error);
    throw handleGeminiError(error);
  }
};

export const submitChoiceStream = async (choice, onUpdate) => {
  if (!currentCacheInfo) throw new Error("Game session not started");

  try {
    const ai = getGenAIWithCache();
    
    const msg = `User chose Option ${choice.id}: ${choice.idiom}`;
    console.log("[Gemini API] Input (Submit Choice):", msg);
    
    // Add user message to history
    cachedConversationHistory.push({ role: "user", parts: [{ text: msg }] });

    const response = await ai.models.generateContentStream({
      model: currentCacheInfo.model,
      contents: cachedConversationHistory,
      config: { 
        cachedContent: currentCacheInfo.cacheName,
      },
    });

    const { parsedData, fullText } = await handleNewSdkStreamResponse(response, onUpdate);
    
    // Store model response in history
    cachedConversationHistory.push({ role: "model", parts: [{ text: fullText }] });

    return parsedData;
  } catch (error) {
    console.error("[Gemini API] Submit Choice Error:", error);
    throw handleGeminiError(error);
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const parseGeminiResponse = (text) => {
  try {
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

// ============================================
// ANALYSIS (uses legacy SDK for simplicity)
// ============================================

export const analyzeGameplay = async (history) => {
  try {
    const genAI = getGenAI();
    const modelId = getStoredModel();
    const model = genAI.getGenerativeModel({ model: modelId });

    const prompt = `
      你是成語導師，請分析學生的遊戲表現。用溫暖但簡潔的第二人稱語氣。
      
      遊戲紀錄：
      ${history.map(h => `${h.type === 'user' ? '[選擇]' : '[情境]'}: ${h.text}`).join('\n')}
      
      要求：
      1. 給學生一個創意稱號（4-6字）
      2. 簡短總結故事走向（2-3句）
      3. 點評每個成語選擇是否恰當（每個1句）
      4. 給予一句話建議
      5. 統計策略：果斷(aggressive)、深思(conservative)、誤用(negative)
      
      回傳 JSON 格式：
      {
        "title": "中文稱號",
        "titleEn": "English Title (e.g. The Strategic Thinker)",
        "storySummary": "故事摘要（2-3句話）",
        "storySummaryEn": "Story summary in English (2-3 sentences)",
        "idiomAnalysis": [
          {"idiom": "成語", "verdict": "好/尚可/不當", "comment": "一句點評", "commentEn": "One sentence comment in English"}
        ],
        "advice": "一句話建議",
        "adviceEn": "One sentence advice in English",
        "stats": {"aggressive": 0, "conservative": 0, "negative": 0}
      }
      
      僅回傳有效 JSON，不要包含其他文字。
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
    const handledError = handleGeminiError(error);
    
    return {
      title: "未知旅人",
      evaluation: `評估時發生問題：${handledError.userMessage}\n\n雖然無法完成詳細分析，但你已經完成了一次精彩的冒險！`,
      stats: { aggressive: 0, conservative: 0, negative: 0 }
    };
  }
};
