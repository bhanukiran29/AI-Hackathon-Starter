import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Say hello and tell me the Gemini API is working.",
    });

    console.log("\n✅ Gemini Response:\n");
    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}

main();