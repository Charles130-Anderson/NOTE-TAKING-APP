import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function NoteEditor() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/notes/${id}`);
      setTitle(data.title);
      setContent(data.content);
    };
    load();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    await api.put(`/notes/${id}`, { title, content });
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>Edit Note</h2>
      <form onSubmit={save} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea rows={6} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}