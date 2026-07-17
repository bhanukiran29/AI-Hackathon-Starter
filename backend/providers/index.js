import { askGemini } from "./gemini.js";
import { askGroq } from "./groq.js";
import { askOpenRouter } from "./openrouter.js";

export async function askAI(options) {

    switch (options.provider) {

        case "gemini":
            return await askGemini(options);

        case "groq":
            return await askGroq(options);

        case "openrouter":
            return await askOpenRouter(options);

        default:
            throw new Error("Unknown provider");
    }
}