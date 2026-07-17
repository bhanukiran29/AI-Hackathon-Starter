import { config } from "../config/env.js";

const DEFAULT_MODEL = "openai/gpt-oss-20b:free";

export async function askOpenRouter(options) {
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

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                temperature,
                max_tokens: maxTokens,
                messages: formattedMessages,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || `OpenRouter returned status ${response.status}`);
    }

    return {
        response: data.choices[0].message.content,
        model: DEFAULT_MODEL
    };
}