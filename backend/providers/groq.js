import Groq from "groq-sdk";
import { config } from "../config/env.js";

const groq = new Groq({
    apiKey: config.GROQ_API_KEY,
});

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export async function askGroq(options) {
    const {
        messages,
        systemPrompt = "",
        temperature = 0.7,
        maxTokens = 1000
    } = options;

    const formattedMessages = [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        ...messages
    ];

    const response = await groq.chat.completions.create({
        model: DEFAULT_MODEL,
        temperature,
        max_tokens: maxTokens,
        messages: formattedMessages,
    });

    return {
        response: response.choices[0].message.content,
        model: DEFAULT_MODEL
    };
}