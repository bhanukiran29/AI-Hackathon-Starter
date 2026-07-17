import { askAI, streamAI } from "../providers/index.js";

export async function chatService(options) {
    return await askAI(options);
}

export function chatStreamService(options) {
    return streamAI(options);
}