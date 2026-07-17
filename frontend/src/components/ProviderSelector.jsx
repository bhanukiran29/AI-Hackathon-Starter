export default function ProviderSelector({ provider, setProvider }) {
  return (
    <select
      value={provider}
      onChange={(e) => setProvider(e.target.value)}
    >
      <option value="gemini">Gemini</option>
      <option value="groq">Groq</option>
      <option value="openrouter">OpenRouter</option>
    </select>
  );
}
