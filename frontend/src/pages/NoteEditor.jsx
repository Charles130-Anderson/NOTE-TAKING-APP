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

  // Shared button style
  const buttonStyle = {
    backgroundColor: "#d9b99b",
    color: "#5b4636",
    border: "1px solid #c9a77a",
    borderRadius: 4,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "normal",
    fontFamily: "Arial, sans-serif",
    textDecoration: "none",
  };

  // Container style
  const containerStyle = {
    maxWidth: 800,
    margin: "20px auto",
    padding: 12,
    borderRadius: 6,
    border: "1px solid #c9a77a",
    backgroundColor: "#fff8e1",
    fontFamily: "Arial, sans-serif",
    color: "#5b4636",
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: 4,
    border: "1px solid #c9a77a",
    fontFamily: "Arial, sans-serif",
    color: "#5b4636",
  };

  const textareaStyle = {
    padding: "8px",
    borderRadius: 4,
    border: "1px solid #c9a77a",
    fontFamily: "Arial, sans-serif",
    color: "#5b4636",
    resize: "vertical",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 12 }}>Edit Note</h2>
      <form onSubmit={save} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          rows={6}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textareaStyle}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c9a77a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#d9b99b")}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c9a77a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#d9b99b")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
