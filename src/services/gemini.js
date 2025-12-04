import { GoogleGenerativeAI } from "@google/generative-ai";
import { GAME_SYSTEM_PROMPT } from "../data/prompts";
import { handleGeminiError } from "./errorHandler";

const API_KEY_STORAGE_KEY = "gemini_api_key";
const API_MODEL_STORAGE_KEY = "gemini_model";

// Get API key from localStorage first, then fall back to environment variable
export const getApiKey = () => {
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedKey) return storedKey;
  
  // Fall back to environment variable for demo/testing
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  return envKey || null;
};

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
    throw handleGeminiError(error);
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
    throw handleGeminiError(error);
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
      你是一位資深的成語導師，正在與學生進行一對一的課後點評。請分析以下遊戲過程，並以第二人稱（「你」）的方式，用溫暖、鼓勵但不失專業的口吻，直接與學生對話。
      
      遊戲歷史紀錄：
      ${history.map(h => `${h.type === 'user' ? '學生選擇' : '情境描述'}: ${h.text}`).join('\n')}
      
      評估要求：
      1. 給予學生一個富有個性的稱號（例如：深思熟慮的智者、果敢的行動派）
      2. 用第二人稱「你」直接對學生說話，評價他們對成語的理解與運用策略
      3. 具體分析每個選擇，並給予建設性的回饋
      4. 語氣要像一位關心學生的導師，而非客觀的旁觀者
      5. 統計策略類型（果斷 Aggressive、深思 Conservative、誤用 Negative）
      
      範例語氣：
      - 「你在面對XX情境時，選擇了『成語』，這展現了你XX的特質...」
      - 「我注意到你傾向於XX策略，這在XX情況下很有效...」
      - 「建議你未來可以嘗試...」
      
      輸出格式（僅回傳有效的 JSON）：
      {
        "title": "學生稱號（中文，例如：深思熟慮的智者）",
        "evaluation": "詳細的第二人稱評價內容，直接對學生說話...",
        "stats": {
          "aggressive": 2,
          "conservative": 1,
          "negative": 0
        }
      }
      
      重要：僅回傳有效的 JSON 格式，不要包含其他說明文字。
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
    
    // For analysis errors, return a friendly fallback instead of throwing
    return {
      title: "未知旅人",
      evaluation: `評估時發生問題：${handledError.userMessage}\n\n雖然無法完成詳細分析，但你已經完成了一次精彩的冒險！`,
      stats: { aggressive: 0, conservative: 0, negative: 0 }
    };
  }
};
