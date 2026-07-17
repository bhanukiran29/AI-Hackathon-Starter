import { askAI } from "../providers/index.js";

export async function chatService(provider, prompt) {
    return await askAI(provider, prompt);
}