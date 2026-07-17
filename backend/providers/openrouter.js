    import dotenv from "dotenv";
    import path from "path";
    import { fileURLToPath } from "url";

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    dotenv.config({ path: path.resolve(__dirname, "../.env") });
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });

    export async function askOpenRouter(options) {
        const {
            prompt,
            systemPrompt = "",
            temperature = 0.7,
            maxTokens = 1000
        } = options;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b:free",
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
                }),
            }
        );

        const data = await response.json();

        return data.choices[0].message.content;
    }