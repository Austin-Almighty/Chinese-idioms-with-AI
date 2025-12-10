import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import fs from "fs";
import path from "path";

const MODEL_NAME = "gemini-2.0-flash-001";
const CACHE_TTL = "3600s"; // 1 hour

export async function handler(event, context) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured on server" }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    // Step 1: Upload the idioms CSV file
    const csvPath = path.join(process.cwd(), "src/data/idioms_filtered.csv");
    
    console.log("Uploading CSV from:", csvPath);
    
    const uploadedFile = await ai.files.upload({
      file: csvPath,
      config: { 
        mimeType: "text/csv",
        displayName: "chinese-idioms-database",
      },
    });
    
    console.log("Uploaded file:", uploadedFile.name, uploadedFile.uri);

    // Step 2: Create cache with the uploaded file
    const cache = await ai.caches.create({
      model: MODEL_NAME,
      config: {
        displayName: "idioms-game-cache",
        contents: createUserContent(
          createPartFromUri(uploadedFile.uri, uploadedFile.mimeType)
        ),
        systemInstruction: `你是一個中文成語學習遊戲的主持人。

你已經擁有一個完整的成語資料庫（已上傳的 CSV 檔案），包含 1,543 個成語，每個成語都有：
- 編號：唯一識別碼
- 成語：四字成語
- 釋義：詳細解釋，包含典故來源
- 用法說明：使用情境，標註褒義/貶義
- 三歲版解釋：簡單易懂的解釋

在遊戲過程中，請務必：
1. 從資料庫中選擇符合情境和難度的成語
2. 確保成語的用法和解釋準確無誤
3. 根據難度調整成語的複雜程度
4. 避免在同一輪遊戲中重複使用成語`,
        ttl: CACHE_TTL,
      },
    });

    console.log("Cache created:", cache.name);

    // Return cache info to frontend
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        cacheName: cache.name,
        model: MODEL_NAME,
        expiresAt: Date.now() + 3600000, // 1 hour from now
        tokenCount: cache.usageMetadata?.totalTokenCount || 0,
      }),
    };
  } catch (error) {
    console.error("Cache creation error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: "Failed to create cache",
        message: error.message,
      }),
    };
  }
}
