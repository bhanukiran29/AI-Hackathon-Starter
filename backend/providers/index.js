import { askGemini } from "./gemini.js";
import { askGroq } from "./groq.js";
import { askOpenRouter } from "./openrouter.js";

export async function askAI(provider, prompt) {

    switch (provider) {

        case "gemini":
            return await askGemini(prompt);

        case "groq":
            return await askGroq(prompt);

        case "openrouter":
            return await askOpenRouter(prompt);

        default:
            throw new Error("Unknown provider");
    }

}