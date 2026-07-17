import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ResponseCard({ response }) {
  const [copied, setCopied] = useState(false);

  if (!response) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="response-card">
      <div className="response-header">
        <h2>Response</h2>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "✅ Copied!" : "📋 Copy"}
        </button>
      </div>
      <div className="markdown-content">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    </div>
  );
}
