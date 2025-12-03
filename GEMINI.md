# 成語生存指南 (Idiom Survival Guide)

## 📖 Project Overview
**成語生存指南** is an AI-powered interactive text adventure game designed to transform how users learn Chinese idioms. Instead of rote memorization, players are immersed in dynamic, realistic scenarios—from high-stakes business negotiations to sci-fi survival crises—where they must apply idioms correctly to navigate challenges.

Powered by **Google's Gemini Pro**, the game offers a non-linear storytelling experience where every choice shapes the narrative, providing immediate context and consequences for each idiom used.

## ✨ Key Features
- **AI-Driven Narrative**: Real-time story generation using the Gemini API. No two playthroughs are exactly the same.
- **Immersive Scenarios**: Diverse settings including Classic Literature (Red Chamber), Modern Workplace, Campus Life, and Sci-Fi.
- **Adaptive Difficulty**:
  - **簡單 (Easy)**: Daily life and campus situations.
  - **中等 (Medium)**: Workplace politics and interpersonal dilemmas.
  - **困難 (Hard)**: High-stakes business strategy and survival.
- **Smart Analysis**: Post-game evaluation where the AI analyzes your playstyle (e.g., "Decisive", "Conservative") and offers strategic advice.
- **Premium UI/UX**: A modern "Glassmorphism" aesthetic featuring dark gradients, smooth Framer Motion animations, and responsive design.

## 🛠️ Tech Stack
- **Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (with PostCSS)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Google Gemini API Key (Get one [here](https://aistudio.google.com/app/apikey))

### Installation
1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Configure API Key**
    - Open the app in your browser.
    - Click the **Settings (Gear Icon)** in the top-right corner.
    - Paste your Google Gemini API Key and save.

## 🗺️ Roadmap
- [x] **Project Initialization**: Vite + React structure, Tailwind CSS setup.
- [x] **Core Features**:
    - [x] Gemini API Integration (Story & Analysis).
    - [x] Game Loop (Scenario -> Choice -> Result).
    - [x] API Key Management.
- [x] **UI/UX Overhaul**:
    - [x] Glassmorphism Design System.
    - [x] Framer Motion Animations.
    - [x] Responsive Layouts.
    - [x] **New**: Analyzing Screen with loading animation.
    - [x] **New**: Enhanced Ending Screen with scrollable content.
- [x] **Content Expansion**:
    - [x] Difficulty Levels (Easy/Medium/Hard).
    - [x] Categorized Scene Selection.
- [ ] **Future Goals**:
    - [ ] Expand content to 40+ scenarios.
    - [ ] Voice narration (Text-to-Speech).
    - [ ] User progress tracking (Local/Cloud).
