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

export async function* streamOpenRouter(options) {
    const {
        messages,
        systemPrompt = "",
        temperature = 0.7,
        maxTokens = 1000,
        signal
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
                stream: true
            }),
            signal
        }
    );

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter returned status ${response.status}: ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (signal?.aborted) {
                throw new Error("Stream aborted by client");
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (trimmed === "data: [DONE]") continue;

                if (trimmed.startsWith("data: ")) {
                    try {
                        const json = JSON.parse(trimmed.slice(6));
                        const token = json.choices[0]?.delta?.content || "";
                        if (token) {
                            yield { token, model: DEFAULT_MODEL };
                        }
                    } catch (e) {
                        // Suppress parse errors from heartbeat keep-alive lines if they occur
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}