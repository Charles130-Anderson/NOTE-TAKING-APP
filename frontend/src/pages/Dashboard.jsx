import { useEffect, useState } from "react";
import api from "../services/api";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    const { data } = await api.get("/notes");
    setNotes(data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post("/notes", { title, content });
    setTitle(""); setContent("");
    await load();
  };

  const del = async (note) => {
    await api.delete(`/notes/${note.id}`);
    await load();
  };

  const share = async (note, payload) => {
    await api.post(`/notes/${note.id}/share`, payload);
    alert("Shared");
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>My Notes</h2>
      <form onSubmit={create} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Create Note</button>
      </form>
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          onDelete={del}
          onEdit={(note) => navigate(`/edit/${note.id}`)}
          onShare={share}
        />
      ))}
    </div>
  );
}