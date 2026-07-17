import { chatService } from "../services/chatService.js";

export async function chatController(req, res, next) {
    try {
        const {
            provider,
            prompt,
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

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "prompt is required."
            });
        }

        const response = await chatService({
            provider,
            prompt,
            systemPrompt,
            temperature,
            maxTokens
        });

        res.status(200).json({
            success: true,
            provider,
            response
        });

    } catch (err) {
        next(err);
    }
}