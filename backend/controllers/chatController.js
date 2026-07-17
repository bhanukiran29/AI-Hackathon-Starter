import { chatService } from "../services/chatService.js";

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