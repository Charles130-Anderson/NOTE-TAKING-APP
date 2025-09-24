import { useState } from "react";

export default function NoteCard({ note, onEdit, onDelete, onShare }) {
  const [shareTo, setShareTo] = useState("");
  const [shareMode, setShareMode] = useState("username"); // or "email"

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}>
      <h3>{note.title}</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onEdit(note)}>Edit</button>
        <button onClick={() => onDelete(note)}>Delete</button>
      </div>
      <div style={{ marginTop: 8 }}>
        <select value={shareMode} onChange={(e) => setShareMode(e.target.value)} style={{ marginRight: 6 }}>
          <option value="username">Username</option>
          <option value="email">Email</option>
        </select>
        <input
          placeholder={`Share with ${shareMode}`}
          value={shareTo}
          onChange={(e) => setShareTo(e.target.value)}
          style={{ marginRight: 6 }}
        />
        <button
          onClick={() =>
            onShare(note, shareMode === "username" ? { username: shareTo } : { email: shareTo })
          }
        >
          Share
        </button>
      </div>
    </div>
  );
}