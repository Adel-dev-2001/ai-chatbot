# Syntax AI — Elite Coding Assistant

> A modern, full-featured AI chat application powered by **Google Gemini**, built with **React 19**, **Vite 6**, and **TypeScript**. Features real-time streaming responses, branching conversation trees, voice I/O, file attachments, and persistent memory.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Streaming Chat** | Real-time token-by-token responses via Gemini API |
| 🌿 **Branching History** | Edit any message and explore alternative branches |
| 🌙 **Dark / Light Mode** | Auto-detects OS preference; fully toggleable |
| 🎙️ **Voice Input** | Web Speech API with multi-language support |
| 🔊 **Text-to-Speech** | Gemini TTS with 5 distinct voice personalities |
| 📎 **File Attachments** | Images, PDFs, code files (up to 5 MB each) |
| 🖼️ **Image Generation** | AI-crafted Pollinations.ai prompts rendered inline |
| 🧠 **Core Memory** | Persistent cross-session memory extracted from chat |
| ⚙️ **Live Code Preview** | Run HTML/CSS/JS/JSX directly inside the chat |
| 💾 **Session History** | All conversations saved to `localStorage` |
| 📤 **Export** | Download active conversation as a `.md` file |

---

## 🏛️ Architecture

The project is structured in clear, responsibility-separated layers:

```
ai-chatbot/
├── public/
│   └── favicon.svg            # Standalone SVG favicon
├── src/
│   ├── types/
│   │   └── chat.ts            # Shared TypeScript interfaces (ChatMessage, Attachment, …)
│   ├── constants/
│   │   └── chat.ts            # App-wide constants (suggestions, prompts, voice list)
│   ├── services/
│   │   └── GeminiService.ts   # Singleton API service (@google/genai encapsulation)
│   ├── hooks/
│   │   ├── useTheme.ts        # Dark/Light mode management
│   │   ├── useSpeechRecognition.ts  # Microphone & Web Speech API
│   │   └── useChat.ts         # Full chat lifecycle (sessions, streaming, memory)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx     # Polymorphic button with variant system
│   │   │   └── Textarea.tsx   # Auto-resizing textarea
│   │   ├── MarkdownRenderer.tsx  # Markdown + live code preview + image generation
│   │   └── MessageItem.tsx    # Individual message with edit, copy, TTS, branching
│   ├── lib/
│   │   ├── tree.ts            # Conversation tree traversal utilities
│   │   └── utils.ts           # clsx + tailwind-merge helper (`cn`)
│   ├── App.tsx                # Root UI component (pure layout, delegates to hooks)
│   ├── main.tsx               # React entry point
│   └── index.css              # Tailwind v4 base styles & CSS custom properties
├── index.html                 # Vite HTML template
├── vite.config.ts             # Vite + Tailwind v4 config with env injection
├── tsconfig.json              # TypeScript compiler options
├── .env.example               # Environment variable template
└── .gitignore                 # Ignores secrets, build artifacts, and logs
```

### Data Flow Diagram

```
User Interaction
      │
      ▼
  App.tsx (UI Shell)
      │  delegates all logic to
      ├─────► useTheme       → DOM class + OS preference
      ├─────► useSpeechRecognition → Web Speech API transcript
      └─────► useChat
                  │
                  ├─ localStorage  ◄──────► Sessions & Memory persistence
                  │
                  └─► GeminiService (Singleton)
                              │
                              └─► @google/genai SDK
                                        │
                                        ├── generateContentStream  (chat)
                                        └── generateContent        (TTS)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- A **Google Gemini API key** — [get one free](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-chatbot.git
cd ai-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and add your key:

```env
GEMINI_API_KEY="AIzaSy_your_key_here"
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
```

---

## 🛠️ Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type-checking (`tsc --noEmit`) |

---

## 🧱 Engineering Principles Applied

This project demonstrates the following software engineering best practices:

- **Separation of Concerns** — API logic, state management, and UI rendering live in isolated, independently testable layers.
- **Singleton Service Pattern** — `GeminiService` ensures a single API client instance, preventing resource duplication.
- **Custom Hook Composition** — Complex stateful logic is broken into focused, reusable hooks (`useChat`, `useTheme`, `useSpeechRecognition`).
- **Type-first Design** — Shared TypeScript interfaces are defined once in `src/types/` and imported everywhere, eliminating duplication.
- **Constants Layer** — All magic strings (system prompts, voice lists, suggestion cards) are maintained in `src/constants/` — no hardcoding in components.
- **Clean Component API** — UI components receive data and handlers through explicit props; zero business logic lives inside them.
- **Security by Default** — API keys are never hardcoded; `.env` files are gitignored and documented via `.env.example`.

---

## 📄 License

[Apache-2.0](LICENSE)
