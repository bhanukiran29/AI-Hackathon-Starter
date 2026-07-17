export const PROVIDERS = {
  gemini: {
    name: "Gemini",
    model: "gemini-2.0-flash",
    supportsVision: true,
  },
  groq: {
    name: "Groq",
    model: "llama-3.3-70b-versatile",
    supportsVision: false,
  },
  openrouter: {
    name: "OpenRouter",
    model: "openai/gpt-oss-20b:free",
    supportsVision: false,
  },
};
