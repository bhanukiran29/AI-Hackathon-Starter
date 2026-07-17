import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";

const ai = new GoogleGenAI({
    apiKey: config.GEMINI_API_KEY,
});

const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash"
];

function formatGeminiMessages(messages) {
    return messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));
}

export async function askGemini(options) {
    const {
        messages,
        systemPrompt = "",
        temperature = 0.7,
        maxTokens = 1000
    } = options;

    let lastError;

    for (const model of MODELS) {
        try {
            console.log(`🚀 Trying model: ${model}`);

            const response = await ai.models.generateContent({
                model,
                contents: formatGeminiMessages(messages),
                config: {
                    systemInstruction: systemPrompt || undefined,
                    temperature: temperature,
                    maxOutputTokens: maxTokens
                }
            });

            console.log(`✅ Success with ${model}`);

            return {
                response: response.text,
                model: model
            };

        } catch (err) {
            console.log(`❌ ${model} failed`);
            console.log(err.message);

            lastError = err;
        }
    }

    throw lastError;
}