import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "user",
            content: "Say hello and tell me the OpenRouter API is working."
          }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ API Error:");
      console.log(data);
      return;
    }

    console.log("\n✅ OpenRouter Response:\n");
    console.log(data.choices[0].message.content);
  } catch (err) {
    console.error(err);
  }
}

main();