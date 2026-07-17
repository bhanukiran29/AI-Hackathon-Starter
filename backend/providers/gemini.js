import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODELS = [
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-2.0-flash"
];

export async function askGemini(prompt) {
  let lastError;

  for (const model of MODELS) {
    try {
      console.log(`🚀 Trying model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      console.log(`✅ Success with ${model}`);

      return response.text;
    } catch (err) {
      console.log(`❌ ${model} failed`);
      console.log(err.message);

      lastError = err;
    }
  }

  throw lastError;
}