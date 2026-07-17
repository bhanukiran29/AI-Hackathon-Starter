export default function PromptInput({ prompt, setPrompt }) {
  return (
    <textarea
      rows="8"
      placeholder="Ask anything..."
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
    />
  );
}
