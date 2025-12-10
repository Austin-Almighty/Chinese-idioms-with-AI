// Netlify Function for initializing Gemini context cache
// Using dynamic import to avoid bundling issues

export async function handler(event, context) {
  console.log("=== init-cache function started ===");
  
  try {
    // Check API key first
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API key configured:", apiKey ? "Yes (length: " + apiKey.length + ")" : "NO - MISSING!");
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: "API key not configured on server",
          hint: "Add GEMINI_API_KEY (not VITE_GEMINI_API_KEY) to Netlify environment variables" 
        }),
      };
    }

    // Dynamic import to avoid bundling issues
    const { GoogleGenAI, createUserContent, createPartFromUri } = await import("@google/genai");
    const fs = await import("fs");
    const path = await import("path");

    // User requested "gemini-pro-2.5" (interpreting as gemini-2.5-pro)
    const MODEL_NAME = "gemini-2.5-pro"; 
    const CACHE_TTL = "3600s"; // 1 hour

    const ai = new GoogleGenAI({ apiKey });

    // Step 1: Find the idioms CSV file
    const csvPath = path.join(process.cwd(), "src/data/idioms_filtered.csv");
    console.log("Looking for CSV at:", csvPath);
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      console.error("CSV file not found at:", csvPath);
      console.log("Current working directory:", process.cwd());
      
      // Try to list what files are available
      try {
        const files = fs.readdirSync(process.cwd());
        console.log("Directory contents:", files);
      } catch (e) {
        console.log("Could not list directory:", e.message);
      }
      
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          error: "CSV file not found",
          path: csvPath,
          cwd: process.cwd(),
        }),
      };
    }
    
    console.log("CSV file found, uploading...");
    
    // Upload the CSV file
    const uploadedFile = await ai.files.upload({
      file: csvPath,
      config: { 
        mimeType: "text/csv",
        displayName: "chinese-idioms-database",
      },
    });
    
    console.log("Uploaded file:", uploadedFile.name, uploadedFile.uri);

    // Step 2: Create cache with the uploaded file
    console.log("Creating cache...");
    
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

    console.log("Cache created successfully:", cache.name);

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
    console.error("=== Cache creation error ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: "Failed to create cache",
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
        hint: "Check Netlify Functions logs for more details",
      }),
    };
  }
}
