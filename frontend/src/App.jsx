import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [provider, setProvider] = useState("gemini");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        provider,
        prompt,
      });

      setResponse(res.data.response);
    } catch (err) {
      setResponse(err.response?.data?.error || err.message);
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h1>🤖 AI Hackathon Starter</h1>

      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      >
        <option value="gemini">Gemini</option>
        <option value="groq">Groq</option>
        <option value="openrouter">OpenRouter</option>
      </select>

      <textarea
        rows="8"
        placeholder="Ask anything..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={askAI} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <h2>Response</h2>

      <pre>{response}</pre>
    </div>
  );
}

export default App;