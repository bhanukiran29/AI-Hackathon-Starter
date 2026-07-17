import { chatService } from "../services/chatService.js";

export async function chatController(req, res) {
    try {
        const { provider, prompt } = req.body;

        if (!provider || !prompt) {
            return res.status(400).json({
                success: false,
                message: "provider and prompt are required."
            });
        }

        const response = await chatService(provider, prompt);

        res.json({
            success: true,
            provider,
            response
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}