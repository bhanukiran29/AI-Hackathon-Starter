import { useState } from "react";
import { askAI } from "./services/api";
import Header from "./components/Header";
import ProviderSelector from "./components/ProviderSelector";
import PromptInput from "./components/PromptInput";
import AskButton from "./components/AskButton";
import ResponseCard from "./components/ResponseCard";
import "./App.css";

function App() {
  const [provider, setProvider] = useState("gemini");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAskAI() {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await askAI({
        provider,
        prompt,
        systemPrompt: "",
        temperature: 0.7,
        maxTokens: 1000,
      });

      setResponse(res.response);
    } catch (err) {
      setResponse(err.response?.data?.error || err.message);
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <Header />

      <ProviderSelector
        provider={provider}
        setProvider={setProvider}
      />

      <PromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleAskAI}
      />

      <AskButton
        loading={loading}
        onClick={handleAskAI}
      />

      <ResponseCard
        response={response}
      />
    </div>
  );
}

export default App;