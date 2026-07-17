import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq(options) {
    const {
        prompt,
        systemPrompt = "",
        temperature = 0.7,
        maxTokens = 1000
    } = options;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature,
        max_tokens: maxTokens,
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    return response.choices[0].message.content;
}