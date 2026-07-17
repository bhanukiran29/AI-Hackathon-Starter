import { askGemini } from "./gemini.js";
import { askGroq } from "./groq.js";
import { askOpenRouter } from "./openrouter.js";

function withTimeout(promise, ms, providerName) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout of ${ms}ms exceeded for provider ${providerName}`));
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timer);
                resolve(res);
            },
            (err) => {
                clearTimeout(timer);
                reject(err);
            }
        );
    });
}

export async function askAI(options) {
    const rawMessages = options.messages || [{ role: "user", content: options.prompt }];
    const messages = rawMessages.map(({ role, content }) => ({ role, content }));
    const normalizedOptions = { ...options, messages };

    switch (options.provider) {
        case "gemini": {
            const result = await askGemini(normalizedOptions);
            return {
                response: result.response,
                model: result.model,
                actualProvider: "gemini"
            };
        }

        case "groq": {
            const result = await askGroq(normalizedOptions);
            return {
                response: result.response,
                model: result.model,
                actualProvider: "groq"
            };
        }

        case "openrouter": {
            const result = await askOpenRouter(normalizedOptions);
            return {
                response: result.response,
                model: result.model,
                actualProvider: "openrouter"
            };
        }

        case "smart": {
            const providers = [
                { name: "groq", fn: askGroq },
                { name: "openrouter", fn: askOpenRouter },
                { name: "gemini", fn: askGemini }
            ];

            let lastError;
            for (const prov of providers) {
                try {
                    console.log(`🤖 Smart Mode: Trying ${prov.name}...`);
                    const result = await withTimeout(prov.fn(normalizedOptions), 5000, prov.name);
                    return {
                        response: result.response,
                        model: result.model,
                        actualProvider: prov.name
                    };
                } catch (err) {
                    console.warn(`⚠️ Smart Mode: ${prov.name} failed or timed out:`, err.message);
                    lastError = err;
                }
            }
            throw new Error(`⚠️ Smart mode couldn't find an available AI provider.\n\nProviders tried:\n• Groq ❌\n• OpenRouter ❌\n• Gemini ❌\n\nPlease try again in a few moments.`);
        }

        default:
            throw new Error("Unknown provider");
    }
}