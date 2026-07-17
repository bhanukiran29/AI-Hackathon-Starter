import { chatService } from "../services/chatService.js";

export async function chatController(req, res) {
    try {
        const {
            provider,
            prompt,
            systemPrompt,
            temperature,
            maxTokens
        } = req.body;

        if (!provider || !prompt) {
            return res.status(400).json({
                success: false,
                message: "provider and prompt are required."
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
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}