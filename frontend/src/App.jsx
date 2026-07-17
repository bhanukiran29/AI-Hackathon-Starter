import { useState } from "react";
import { askAI } from "./services/api";
import Header from "./components/Header";
import ProviderSelector from "./components/ProviderSelector";
import AdvancedSettings from "./components/AdvancedSettings";
import PromptInput from "./components/PromptInput";
import AskButton from "./components/AskButton";
import ResponseCard from "./components/ResponseCard";
import "./App.css";

function App() {
  const [provider, setProvider] = useState("smart");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latencies, setLatencies] = useState({});

  // Advanced settings state
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);

  async function handleAskAI() {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", content: prompt };
    const updatedMessages = [...messages, userMessage];

    // Add user message to history immediately and clear field
    setMessages(updatedMessages);
    setPrompt("");
    setLoading(true);

    const startTime = Date.now();

    try {
      const res = await askAI({
        provider,
        messages: updatedMessages,
        systemPrompt,
        temperature,
        maxTokens,
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: res.response,
          provider: res.actualProvider,
          model: res.model,
          latency: res.latency,
        },
      ]);

      if (res.actualProvider) {
        setLatencies((prev) => ({
          ...prev,
          [res.actualProvider]: duration,
        }));
      }
    } catch (err) {
      const errorData = err.response?.data || {};
      const errorMessage = errorData.error || err.message;
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: `${errorMessage}`,
          provider: errorData.actualProvider || provider,
          model: errorData.model || "N/A",
          latency: errorData.latency || (Date.now() - startTime),
          isError: true,
        },
      ]);
    }

    setLoading(false);
  }

  function handleClearChat() {
    setMessages([]);
  }

  return (
    <div className="container">
      <Header />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <ProviderSelector
            provider={provider}
            setProvider={setProvider}
            latencies={latencies}
          />
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="clear-btn"
            style={{
              width: "auto",
              marginTop: "15px",
              marginLeft: "15px",
              padding: "12px 20px",
              background: "#442222",
              color: "#ff8888",
              border: "1px solid #663333",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            🧹 Clear Chat
          </button>
        )}
      </div>

      <AdvancedSettings
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        temperature={temperature}
        setTemperature={setTemperature}
        maxTokens={maxTokens}
        setMaxTokens={setMaxTokens}
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
        messages={messages}
      />
    </div>
  );
}

export default App;