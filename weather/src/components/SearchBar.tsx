// src/components/SearchBar.tsx
import { useState } from "react";

interface Props {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a city (e.g., Lagos, London)…"
        style={{
          padding: "0.7rem 1rem",
          borderRadius: "10px",
          border: "none",
          width: "250px",
          marginRight: "0.5rem",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0.7rem 1rem",
          borderRadius: "10px",
          border: "none",
          background: "#111827",
          color: "white",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </form>
  );
}
