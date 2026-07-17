# AI Hackathon Starter

## Overview
A boilerplate template designed to help developers build and deploy full-stack AI-powered applications rapidly during hackathons. It abstracts LLM API integrations and exposes a clean, modular React frontend and Express backend.

---

## Features

- **✅ Multiple AI Providers**: Seamless integration with popular LLMs.
    - **Gemini** (Google Gen AI SDK)
    - **Groq** (Groq SDK)
    - **OpenRouter** (Unified REST API)
- **✅ Modular Express Backend**: Clean separation of concerns with routes, controllers, and services.
- **✅ Modular React Frontend**: Decoupled component architecture for quick layout adjustments.
- **✅ Markdown Rendering**: Clear representation of AI answers with support for headers, tables, and code snippets.
- **✅ Copy Response Button**: Clipboard utility with visual completion badge.
- **✅ Auto-growing Textarea**: Textarea dynamically resizes to accommodate larger input prompts.
- **✅ Enter to Send**: Instant submission via `Enter` key, with `Shift + Enter` mapping to newlines.
- **✅ Environment Variable Support**: Distinct frontend and backend configuration scopes.
- **✅ Reusable Provider Abstraction**: Adding new models or custom endpoints is easy and plug-and-play.

---

## Architecture

```text
React (UI)
   │
Axios (Service API calls)
   │
Express (Backend Server)
   │
Routes (Endpoints definition)
   │
Controllers (Request handling)
   │
Services (Logic layer)
   │
Providers (Model abstraction)
   ├── Gemini
   ├── Groq
   └── OpenRouter
```

---

## Folder Structure

```text
AI-HACKATHON-STARTER
│
├── backend/            # Express.js backend application
├── frontend/           # React + Vite frontend application
├── docs/               # Technical documentation
├── prompts/            # Helpful prompt engineering guidelines
├── screenshots/        # Application UI walkthroughs and logs
├── api-tests/          # HTTP client tests for endpoint verification
└── README.md           # Main repository documentation
```

---

## Installation

### Prerequisites
- Node.js (v18+)
- Git installed

### Clone the Repository
```bash
git clone <repo-url>
cd AI-Hackathon-Starter
```

### Backend Dependency Setup
```bash
cd backend
npm install
```

### Frontend Dependency Setup
```bash
cd ../frontend
npm install
```

---

## Environment Variables

Configure local environments for each application:

### Create Local Configs
1. Create `backend/.env` using the template:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Create `frontend/.env` using the template:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

### Config Variables
- **Backend (`backend/.env`)**:
  - `GEMINI_API_KEY`: API Key from Google AI Studio.
  - `GROQ_API_KEY`: API Key from Groq Console.
  - `OPENROUTER_API_KEY`: API Key from OpenRouter.
- **Frontend (`frontend/.env`)**:
  - `VITE_API_URL`: Server endpoint URL (default is `http://localhost:5000`).

---

## Supported Providers

| Provider | Default Model | Use Case / Strength |
| :--- | :--- | :--- |
| **Gemini** | `gemini-2.0-flash` | Speed, complex tasks, and multi-modal |
| **Groq** | `llama-3.3-70b-versatile` | Ultra-low latency chat responses |
| **OpenRouter** | `openai/gpt-oss-20b:free` | Free tier open-source model experimentation |

---

## API

### Post Query to AI
- **Endpoint**: `/api/chat`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "provider": "gemini",
    "prompt": "Hello AI!",
    "systemPrompt": "You are a helpful assistant.",
    "temperature": 0.7,
    "maxTokens": 1000
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "response": "Hello! How can I assist you today?"
  }
  ```

---

## Screenshots

*(Upload screenshots showing your main screen, drop-downs, and response outputs here)*

![App Preview](screenshots/app_preview.png)

---

## Future Roadmap

### Version 2
- [ ] **Chat History**: Save local logs to preserve conversations across page reloads.
- [ ] **Streaming**: Enable real-time response rendering for faster visual feedback.
- [ ] **File Upload**: Add capability to process source documents directly.
- [ ] **Configurable Provider Fallback**: Auto-route queries to alternate model hosts if the primary is down.
- [ ] **Image Support**: Enable multi-modal operations.
- [ ] **Saved Conversations**: Cloud storage for conversation history.
- [ ] **Authentication**: Secure workspace profiles.
- [ ] **RAG (Retrieval-Augmented Generation)**: Ingest static document databases for contextual search queries.

---

## License
MIT License. Feel free to clone, edit, and use this template in any hackathon project.