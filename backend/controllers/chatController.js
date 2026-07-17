import crypto from "crypto";
import { chatService, chatStreamService } from "../services/chatService.js";

export async function chatController(req, res, next) {
    try {
        const {
            provider,
            prompt,
            messages,
            systemPrompt,
            temperature,
            maxTokens
        } = req.body;

        if (!provider) {
            return res.status(400).json({
                success: false,
                message: "provider is required."
            });
        }

        if (!prompt && (!messages || !messages.length)) {
            return res.status(400).json({
                success: false,
                message: "Either prompt or messages is required."
            });
        }

        const startTime = Date.now();

        try {
            const result = await chatService({
                provider,
                prompt,
                messages,
                systemPrompt,
                temperature,
                maxTokens
            });

            const latency = Date.now() - startTime;

            res.status(200).json({
                success: true,
                provider,
                actualProvider: result.actualProvider,
                model: result.model,
                latency,
                response: result.response
            });
        } catch (err) {
            console.error("❌ Chat Service Error:", err);
            const latency = Date.now() - startTime;
            
            let userFriendlyMessage = err.message;
            const errStr = err.message || "";
            
            if (provider !== "smart") {
                if (errStr.includes("429") || errStr.includes("Quota exceeded") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota")) {
                    userFriendlyMessage = `⚠️ ${provider.toUpperCase()} is temporarily unavailable because the API quota or rate limit has been exceeded. Please try another provider, Smart Mode, or try again later.`;
                } else if (errStr.includes("401") || errStr.includes("API key") || errStr.includes("Invalid API Key") || errStr.includes("unauthorized") || errStr.includes("invalid_request_error")) {
                    userFriendlyMessage = `⚠️ Invalid API key configured for ${provider.toUpperCase()}. Please check your environment configuration.`;
                } else if (errStr.includes("404") || errStr.includes("not found") || errStr.includes("model_not_found")) {
                    userFriendlyMessage = `⚠️ The selected model is unavailable for ${provider.toUpperCase()}.`;
                } else if (errStr.includes("Timeout") || errStr.includes("timeout")) {
                    userFriendlyMessage = `⚠️ The provider ${provider.toUpperCase()} took too long to respond.`;
                }
            }

            res.status(500).json({
                success: false,
                error: userFriendlyMessage,
                provider,
                actualProvider: provider === "smart" ? "fallback" : provider,
                model: "N/A",
                latency
            });
        }

    } catch (err) {
        next(err);
    }
}

export async function chatControllerStream(req, res, next) {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    let ttfb = null;
    let heartbeatTimer = null;

    const abortController = new AbortController();
    const signal = abortController.signal;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const cleanup = () => {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer);
            heartbeatTimer = null;
        }
        req.off("close", onClientClose);
        try {
            res.end();
        } catch (e) {}
    };

    const onClientClose = () => {
        console.log(`🔌 Client closed connection for request ${requestId}. Aborting stream...`);
        abortController.abort();
        cleanup();
    };

    // req.on("close", onClientClose);

    heartbeatTimer = setInterval(() => {
        res.write("event: ping\ndata: {}\n\n");
    }, 15000);

    try {
        const {
            provider,
            prompt,
            messages,
            systemPrompt,
            temperature,
            maxTokens
        } = req.body;

        if (!provider) {
            res.write(`event: error\ndata: ${JSON.stringify({ error: "provider is required." })}\n\n`);
            cleanup();
            return;
        }

        if (!prompt && (!messages || !messages.length)) {
            res.write(`event: error\ndata: ${JSON.stringify({ error: "Either prompt or messages is required." })}\n\n`);
            cleanup();
            return;
        }

        const stream = chatStreamService({
            provider,
            prompt,
            messages,
            systemPrompt,
            temperature,
            maxTokens,
            signal
        });

        let actualProvider = provider;
        for await (const chunk of stream) {
            if (signal.aborted) {
                break;
            }

            if (chunk.event === "start") {
                actualProvider = chunk.data.provider;
                ttfb = Date.now() - startTime;
                chunk.data.ttfb = ttfb;
                chunk.data.requestId = requestId;
            }

            res.write(`event: ${chunk.event}\ndata: ${JSON.stringify(chunk.data)}\n\n`);
        }

        if (!signal.aborted) {
            const totalTime = Date.now() - startTime;
            res.write(`event: end\ndata: ${JSON.stringify({ totalTime, actualProvider })}\n\n`);
        }

    } catch (err) {
        console.error(`❌ Chat Stream Controller Error [${requestId}]:`, err);
        
        let userFriendlyMessage = err.message;
        const errStr = err.message || "";
        const provider = req.body?.provider || "N/A";
        
        if (provider !== "smart") {
            if (errStr.includes("429") || errStr.includes("Quota exceeded") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota")) {
                userFriendlyMessage = `⚠️ ${provider.toUpperCase()} is temporarily unavailable because the API quota or rate limit has been exceeded. Please try another provider, Smart Mode, or try again later.`;
            } else if (errStr.includes("401") || errStr.includes("API key") || errStr.includes("Invalid API Key") || errStr.includes("unauthorized") || errStr.includes("invalid_request_error")) {
                userFriendlyMessage = `⚠️ Invalid API key configured for ${provider.toUpperCase()}. Please check your environment configuration.`;
            } else if (errStr.includes("404") || errStr.includes("not found") || errStr.includes("model_not_found")) {
                userFriendlyMessage = `⚠️ The selected model is unavailable for ${provider.toUpperCase()}.`;
            } else if (errStr.includes("Timeout") || errStr.includes("timeout")) {
                userFriendlyMessage = `⚠️ The provider ${provider.toUpperCase()} took too long to respond.`;
            }
        }

        res.write(`event: error\ndata: ${JSON.stringify({ error: userFriendlyMessage, provider })}\n\n`);
    } finally {
        cleanup();
    }
}