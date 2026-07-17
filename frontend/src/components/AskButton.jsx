export default function AskButton({ loading, onClick }) {
  return (
    <button onClick={onClick} disabled={loading}>
      {loading ? "Thinking..." : "Ask AI"}
    </button>
  );
}
