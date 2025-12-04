Gemini API Interaction Documentation
This document details the exact data sent to and received from the Google Gemini API at each stage of the "Idiom Survival Guide" game.

1. Game Initialization (Start)
Function: 
startNewGameStream
 in 
src/services/gemini.js

Input (Sent to API)
The session is initialized with a System Prompt followed by the User's Context.

1. System Prompt (Hidden Context) Defines the role, rules, and output format.

# Role: Idiom Story GM (成語故事主持人)
# Goal: Facilitate an interactive "Choose Your Own Path" game...
# Game Rules
1. Setup Phase: Start immediately based on user setting.
2. Game Structure: 4 Rounds.
3. The Options: 3 distinct choices (Wise, Foolish, Risky).
   - **CRITICAL**: Do NOT use other idioms to explain the Literal Meaning or Strategy.
4. Story Progression: Outcome must reflect the idiom.
5. Difficulty Levels:
   - **Easy**: Common idioms, obvious choices, low stakes.
   - **Medium**: Standard idioms, some risk, moderate stakes.
   - **Hard**: Rare idioms, ambiguous choices, high stakes.

# Output Format (Hybrid)
1. **Story Narrative**: Plain text story first.
   - **CRITICAL**: Do NOT include introductory phrases like "Okay, let's start!" or "Round 1".
   - **CRITICAL**: Jump STRAIGHT into the setting and conflict.
   - Do not use JSON for this part.
2. **Separator**: "---JSON---" on a new line.
3. **Structured Data**: JSON object for options.

2. User Message (Trigger) Provides the specific scenario details selected by the player.

Setting: [Scenario Title] (e.g., 經典文學篇：賈府風雲)
Difficulty: [Difficulty] (e.g., hard)
Description: [Scenario Description]
Initial Context: [Initial Text]
Start Round 1.

Output (Received from API)
A hybrid stream containing the narrative text first, followed by a separator and the JSON data.

(Streamed Text - Displayed via Typewriter)
You are the head of the Jia family. The air in the room is heavy... [Story continues]...
---JSON---
{
  "round": 1,
  "is_game_over": false,
  "options": [
    { 
      "id": "A", 
      "idiom": "釜底抽薪 (fǔ dǐ chōu xīn)", 
      "literal": "Remove firewood from under the pot", 
      "strategy": "你認為這是解決問題的根本之道 (Traditional Chinese)" 
    },
    { 
      "id": "B", 
      "idiom": "揚湯止沸 (yáng tāng zhǐ fèi)", 
      "literal": "Scoop up soup to stop it boiling", 
      "strategy": "這只是暫時的解決方案，無法根治問題 (Traditional Chinese)" 
    },
    { 
      "id": "C", 
      "idiom": "靜觀其變 (jìng guān qí biàn)", 
      "literal": "Watch quietly for changes", 
      "strategy": "先觀察局勢變化，再決定下一步行動 (Traditional Chinese)" 
    }
  ]
}
2. Game Loop (Making a Choice)
Function: 
submitChoiceStream
 in 
src/services/gemini.js

Input (Sent to API)
The user's selection is sent as a simple text message. The API retains the full context of the story so far.

User chose Option A: 釜底抽薪
Output (Received from API)
The API generates the consequences of the choice and advances the story to the next round.

(Streamed Text)
You decided to remove the firewood. The boiling pot immediately calmed down. 
However, the room is now growing cold, and you realize... [Story continues]...
---JSON---
{
  "round": 2,
  "is_game_over": false,
  "options": [ 
    ... (Next set of 3 options) ...
  ]
}
3. End of Game (Analysis)
Function: 
analyzeGameplay
 in 
src/services/gemini.js

Input (Sent to API)
This is a stateless, one-off request. We send the entire chat history (User Choices + System Stories) to the model for evaluation.

Analyze the following gameplay session of the "Idiom Survival Guide".
History:
System Story: You are the head of the Jia family...
User Choice: Option A (釜底抽薪)
System Story: You decided to...
User Choice: Option B (順藤摸瓜)
...
Task:
1. Determine the player's style (e.g., The Thinker, The Doer).
2. Provide a detailed evaluation.
3. Count the types of strategies used.
Output Format (JSON):
{
  "title": "Player Title",
  "evaluation": "...",
  "stats": { "aggressive": 2, "conservative": 1, "negative": 0 }
}
IMPORTANT: Return ONLY valid JSON.
Output (Received from API)
A pure JSON object used to render the Ending Screen.

{
  "title": "深思熟慮的智者 (The Thoughtful Sage)",
  "evaluation": "You demonstrated remarkable patience. Instead of rushing into conflict, you consistently chose strategies that minimized risk...",
  "stats": {
    "aggressive": 1,
    "conservative": 3,
    "negative": 0
  }
}

