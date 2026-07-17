import { askGemini, streamGemini } from "./gemini.js";
import { askGroq, streamGroq } from "./groq.js";
import { askOpenRouter, streamOpenRouter } from "./openrouter.js";

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

export async function* streamAI(options) {
    const rawMessages = options.messages || [{ role: "user", content: options.prompt }];
    const messages = rawMessages.map(({ role, content }) => ({ role, content }));
    const normalizedOptions = { ...options, messages };

    const signal = options.signal;

    switch (options.provider) {
        case "gemini":
            yield { event: "start", data: { provider: "gemini", model: "gemini-2.0-flash" } };
            for await (const chunk of streamGemini(normalizedOptions)) {
                yield { event: "token", data: { token: chunk.token } };
            }
            break;

        case "groq":
            yield { event: "start", data: { provider: "groq", model: "llama-3.3-70b-versatile" } };
            for await (const chunk of streamGroq(normalizedOptions)) {
                yield { event: "token", data: { token: chunk.token } };
            }
            break;

        case "openrouter":
            yield { event: "start", data: { provider: "openrouter", model: "openai/gpt-oss-20b:free" } };
            for await (const chunk of streamOpenRouter(normalizedOptions)) {
                yield { event: "token", data: { token: chunk.token } };
            }
            break;

        case "smart": {
            const providers = [
                { name: "groq", fn: streamGroq },
                { name: "openrouter", fn: streamOpenRouter },
                { name: "gemini", fn: streamGemini }
            ];

            let activeIndex = 0;
            let streamStarted = false;

            while (activeIndex < providers.length) {
                const currentProvider = providers[activeIndex];
                try {
                    console.log(`🤖 Smart Mode Stream: Trying ${currentProvider.name}...`);
                    
                    const generator = currentProvider.fn(normalizedOptions);
                    
                    for await (const chunk of generator) {
                        if (signal?.aborted) {
                            throw new Error("Stream aborted by client");
                        }
                        if (!streamStarted) {
                            streamStarted = true;
                            yield { event: "start", data: { provider: currentProvider.name, model: chunk.model } };
                        }
                        yield { event: "token", data: { token: chunk.token } };
                    }
                    
                    break;
                } catch (err) {
                    console.warn(`⚠️ Smart Mode Stream: ${currentProvider.name} failed:`, err.message);
                    
                    if (signal?.aborted) {
                        throw err;
                    }

                    if (streamStarted) {
                        yield { event: "error", data: { error: err.message, provider: currentProvider.name } };
                        throw err;
                    }

                    activeIndex++;
                    if (activeIndex < providers.length) {
                        yield { 
                            event: "provider-switch", 
                            data: { 
                                from: currentProvider.name, 
                                to: providers[activeIndex].name, 
                                reason: err.message 
                            } 
                        };
                    } else {
                        throw new Error(`⚠️ Smart mode couldn't find an available AI provider.\n\nProviders tried:\n• Groq ❌\n• OpenRouter ❌\n• Gemini ❌\n\nPlease try again in a few moments.`);
                    }
                }
            }
            break;
        }

        default:
            throw new Error("Unknown provider");
    }
}