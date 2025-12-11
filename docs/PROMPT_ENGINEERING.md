# 提示詞工程解析 (Prompt Engineering Design)

本文件深入解析「成語生存指南」專案中的提示詞設計哲學與技術決策。

---

## 1. 核心架構：角色扮演與系統提示

### 1.1 角色定義
```
# Role: Idiom Story GM (成語故事主持人)
# Goal: Facilitate an interactive "Choose Your Own Path" game...
```

**設計理由**：
- **明確角色**：將 AI 定位為「遊戲主持人」而非「老師」，降低教學感，提升沉浸體驗。
- **目標導向**：開宗明義說明這是「互動式小說」與「成語學習」的結合，讓模型理解上下文。

### 1.2 目標受眾定義
```
# Target Audience
Chinese language learners at intermediate level. The language used must be clear, natural...
```

**設計理由**：
- **語言調適**：明確指出用戶是「中階學習者」，引導模型使用自然但不過於艱深的中文。
- **避免歧義**：防止模型使用過於文言或口語化的表達。

---

## 2. 遊戲流程控制 (Game Structure)

### 2.1 嚴格回合制
```
2. **Game Structure (CRITICAL)**:
   - The game has **EXACTLY 4 Rounds total**:
     * **Round 1**: Initial situation
     * **Round 2**: Consequence of user's first choice + new conflict
     * **Round 3**: Consequence of user's second choice + new conflict
     * **Round 4**: Consequence of user's third choice + **FINAL CONCLUSION**
```

**設計理由**：
- **可預測性**：固定 4 回合讓前端 UI 可以設計進度條，用戶也知道遊戲長度。
- **防止無限迴圈**：早期版本 AI 會不斷延續故事，加入 `EXACTLY` 和 `ALWAYS` 強調詞後問題解決。
- **明確結局點**：要求 Round 4 必須「提供滿意的結局」，避免故事中斷感。

### 2.2 回合結束標記
```
* Set "is_game_over": true
* Do NOT provide new options
```

**設計理由**：
- **前端判斷依據**：透過 JSON 中的 `is_game_over` 旗標，前端可正確切換到分析畫面。
- **防止選項洩漏**：明確禁止 Round 4 輸出選項，避免 UI 顯示無效按鈕。

---

## 3. 選項設計 (Option Architecture)

### 3.1 三元策略結構
```
Each choice must represent a different strategy:
  - One **Wise/Positive** strategy.
  - One **Foolish/Negative** strategy.
  - One **Risky/Neutral** strategy.
```

**設計理由**：
- **教育價值**：讓學習者透過「選擇後果」理解成語的適用情境，而非死記硬背。
- **遊戲張力**：三種策略創造道德困境與戲劇張力，提升遊玩趣味。
- **差異化**：防止三個選項過於相似，確保每個選擇都有獨特的策略意義。

### 3.2 選項格式規範
```
- **Action Title**: A simple, direct description of the action.
- **Idiom**: The Chinese Idiom + Pinyin.
- **Literal Meaning**: A simple, concrete translation using everyday vocabulary only
- **Strategy**: Briefly explain why the player would take this action
```

**設計理由**：
- **結構化輸出**：統一格式讓前端可直接解析並渲染 UI 卡片。
- **拼音標註**：幫助學習者正確發音，這對中文學習者至關重要。
- **字面意義分離**：區分「字面意思」與「策略意義」，強化學習效果。

---

## 4. 成語選擇規則 (Idiom Constraint System)

### 4.1 清單限制策略
```
4. **Idiom Selection Rules (CRITICAL - HIGHEST PRIORITY)**:
   - **YOU MUST ONLY use idioms from the provided list**
   - Before suggesting ANY idiom, you must:
     1. Verify it exists EXACTLY in the approved list
     2. Confirm it hasn't been used in previous rounds of THIS game
     3. If uncertain, choose a different idiom from the list
```

**設計理由**：
- **教學品質控制**：確保只使用經過篩選的 1,543 個成語，避免冷僻或有爭議的成語。
- **重複防止**：遊戲全程 12 個選項（3×4 回合）必須不重複，增加學習廣度。
- **不確定性處理**：當 AI 不確定時，建議「選擇其他成語」而非猜測，降低錯誤風險。

### 4.2 隱式快取策略
```javascript
// gemini.js
import idiomsData from "../data/idioms_names_only.csv?raw";

const augmentedSystemPrompt = `
  ${GAME_SYSTEM_PROMPT}
  
  # 參考資料庫：成語列表
  以下是本次遊戲**必須**從中選取的成語列表。
  ${idiomsData}
`;
```

**設計理由**：
- **Token 節約**：只傳成語名稱（~1,500 tokens），而非完整定義（~150,000 tokens）。
- **利用內建知識**：依賴模型內建的成語知識庫，無需額外傳輸定義。
- **Free Tier 相容**：Gemini Free Tier 不支援顯式快取，此方法繞過限制。

---

## 5. 輸出格式設計 (Hybrid Output)

### 5.1 混合式輸出
```
# Output Format (Hybrid)
1. **Story Narrative**: Start by writing the story directly as plain text.
2. **Separator**: Output exactly "---JSON---" on a new line.
3. **Structured Data**: After the separator, output the JSON object for options and game state.
```

**設計理由**：
- **串流友善**：故事文字可即時串流顯示（打字機效果），JSON 在最後解析。
- **解析簡化**：使用唯一分隔符 `---JSON---` 避免 JSON 與故事內容混淆。
- **錯誤隔離**：即使 JSON 解析失敗，故事部分仍可正常顯示。

### 5.2 禁止前導語
```
- **CRITICAL**: Do NOT include introductory phrases like "Okay, let's start!" or "Round 1".
- **CRITICAL**: Jump STRAIGHT into the setting and conflict.
```

**設計理由**：
- **沉浸體驗**：避免「好的，讓我們開始！」這類破壞沉浸感的 AI 回應。
- **UI 整合**：故事直接開始，讓 UI 可直接呈現內容而無需裁切。

---

## 6. 字面意義格式 (Literal Meaning)

### 6.1 嚴格範例引導
```
8. **Literal Meaning Format (CRITICAL)**:
   - Provide word-for-word translation using simplest possible Chinese
   - **Good Examples**:
     * 一石二鳥 → "一塊石頭，兩隻鳥" ✅
     * 畫蛇添足 → "畫蛇的時候加上腳" ✅
   - **AVOID**:
     * "達成多個目標" (this is interpretation, not literal) ❌
     * Using idioms to explain idioms ❌
```

**設計理由**：
- **Few-shot Prompting**：提供正確與錯誤範例，比純文字描述更有效。
- **學習輔助**：字面意義幫助學習者建立「成語畫面感」，強化記憶。
- **避免循環解釋**：明確禁止用成語解釋成語，這是常見的 AI 錯誤。

---

## 7. 難度分級 (Difficulty Scaling)

### 7.1 三級難度系統
```
9. **Difficulty Levels (CRITICAL)**:
   - **Easy**: Common idioms, obvious "Wise" choice, low stakes
   - **Medium**: Professional idioms, tempting "Risky" choice, moderate stakes  
   - **Hard**: Literary idioms, ambiguous choices, high stakes
```

**設計理由**：
- **適性學習**：不同程度學習者可選擇適合的難度。
- **成語分級**：Easy 用日常成語（一心一意），Hard 用古典成語（沆瀣一氣）。
- **風險梯度**：難度越高，「冒險選項」越誘人，增加策略深度。

---

## 8. 會話記憶 (Session Memory)

### 8.1 跨回合追蹤
```
5. **Per-Game Session Memory (CRITICAL)**:
   - Track ALL idioms used in previous rounds
   - Maintain a mental "used list" as the game progresses
   - **NEVER repeat an idiom** within the same game (4 rounds total)
```

**設計理由**：
- **消除重複**：確保玩家每場遊戲學習 12 個不同成語。
- **心理暗示**：「mental used list」引導模型主動維護狀態。
- **明確數字**：「12 unique idioms」提供可驗證的量化目標。

### 8.2 初始化確認
```javascript
// gemini.js - 初始對話
{
  role: "model",
  parts: [{ text: "Understood. I have reviewed the 1,543 approved idioms and 
    will ONLY use idioms from this list. I will track used idioms to avoid 
    repetition within each game session. Ready to start the game." }],
}
```

**設計理由**：
- **自我確認機制**：讓模型「複述」規則，強化遵守意願。
- **建立基線**：明確說出「1,543 approved idioms」建立數量認知。
- **就緒訊號**：「Ready to start」讓下一輪對話可直接進入遊戲。

---

## 9. 成語解釋提示 (Idiom Popup Prompt)

### 9.1 難度適應性解釋
```javascript
const prompt = isEasy 
  ? `請用簡單易懂的方式解釋成語「${idiom}」。
     回傳 JSON 格式：
     {
       "idiom": "${idiom}",
       "definition": "完整的成語釋義（包含來源典故）",
       "simple": "給初學者的簡單解釋（一兩句話，淺顯易懂）"
     }`
  : `請解釋成語「${idiom}」。
     回傳 JSON 格式：
     {
       "idiom": "${idiom}",
       "definition": "完整的成語釋義（包含來源典故）",
       "usage": "用法說明（包含適用情境、褒貶義等）"
     }`;
```

**設計理由**：
- **動態內容**：根據遊戲難度調整解釋深度。
- **初學者友善**：Easy 模式提供「三歲版」簡化解釋。
- **進階應用**：Medium/Hard 提供「用法說明」，增加語境理解。

---

## 10. 遊戲分析提示 (Post-Game Analysis)

### 10.1 結構化分析請求
```javascript
const prompt = `
  你是成語導師，請分析學生的遊戲表現。用溫暖但簡潔的第二人稱語氣。
  
  要求：
  1. 給學生一個創意稱號（4-6字）
  2. 簡短總結故事走向（2-3句）
  3. 點評每個成語選擇是否恰當（每個1句）
  4. 給予一句話建議
  5. 統計策略：果斷(aggressive)、深思(conservative)、誤用(negative)
  
  回傳 JSON 格式：
  {
    "title": "中文稱號",
    "titleEn": "English Title",
    ...
  }
`;
```

**設計理由**：
- **遊戲化回饋**：「創意稱號」增加趣味性與成就感。
- **雙語支援**：每個欄位都有英文對應，方便中英切換顯示。
- **可視化數據**：`stats` 欄位可用於繪製雷達圖或統計分析。

---

## 總結

本專案的提示詞設計遵循以下核心原則：

1. **明確性 (Explicitness)**：使用 `CRITICAL`、`EXACTLY`、`NEVER` 等強調詞減少歧義。
2. **範例驅動 (Example-Driven)**：Good/Bad 範例比抽象描述更有效。
3. **結構化輸出 (Structured Output)**：JSON 格式確保前端可靠解析。
4. **防呆機制 (Fail-Safe)**：定義邊緣案例處理策略（如成語不足時）。
5. **Token 效率 (Token Efficiency)**：只傳必要資訊，利用模型內建知識。

這些設計共同確保了穩定、教育性強且具娛樂性的使用者體驗。
