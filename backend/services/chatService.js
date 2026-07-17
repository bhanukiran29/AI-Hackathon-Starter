import { askAI } from "../providers/index.js";

export async function chatService(options) {
    return await askAI(options);
}