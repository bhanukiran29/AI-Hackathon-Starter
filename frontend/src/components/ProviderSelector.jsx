import { PROVIDERS } from "../utils/providerConfig";

export default function ProviderSelector({ provider, setProvider }) {
  return (
    <select
      value={provider}
      onChange={(e) => setProvider(e.target.value)}
    >
      {Object.entries(PROVIDERS).map(([key, value]) => (
        <option key={key} value={key}>
          {value.name}
        </option>
      ))}
    </select>
  );
}
