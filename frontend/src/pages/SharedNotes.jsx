import { useEffect, useState } from "react";
import api from "../services/api";

export default function SharedNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/shared");
      setNotes(data);
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>Shared With Me</h2>
      {notes.map((n) => (
        <div key={n.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}>
          <h3>{n.title}</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{n.content}</p>
        </div>
      ))}
    </div>
  );
}