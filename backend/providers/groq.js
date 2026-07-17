import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq(prompt) {

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    return response.choices[0].message.content;
}