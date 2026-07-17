import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Say hello and tell me the Groq API is working.",
        },
      ],
    });

    console.log("\n✅ Groq Response:\n");
    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error("\n❌ Error:\n");
    console.error(err);
  }
}

main();