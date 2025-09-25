    import { useEffect, useState } from "react";
    import api from "../services/api";
    import NoteCard from "../components/NoteCard";
    import { useNavigate } from "react-router-dom";

    export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    // Load notes from API
    const load = async () => {
        const { data } = await api.get("/notes");
        setNotes(data);
    };

    useEffect(() => {
        load();
    }, []);

    // Create a new note
    const create = async (e) => {
        e.preventDefault();
        await api.post("/notes", { title, content });
        setTitle("");
        setContent("");
        await load();
    };

    // Delete a note
    const del = async (note) => {
        await api.delete(`/notes/${note.id}`);
        await load();
    };

    // Share a note
    const share = async (note, payload) => {
        await api.post(`/notes/${note.id}/share`, payload);
        alert("Shared");
    };

    // Button style (matches Navbar links)
    const buttonStyle = { 
        backgroundColor: "#d9b99b",
        color: "#5b4636",
        border: "1px solid #c9a77a",
        borderRadius: 4,
        padding: "6px 12px",
        cursor: "pointer",
        fontWeight: "normal", // can use "bold" if desired
        textDecoration: "none",
        fontFamily: "Arial, sans-serif",
    };

    // Input and textarea style (soft sepia theme)
    const inputStyle = {
        padding: "8px",
        borderRadius: 4,
        border: "1px solid #c9a77a",
        backgroundColor: "#fff8e1",
        fontFamily: "Arial, sans-serif",
        fontSize: "1rem",
        color: "#5b4636",
    };

    return (
        <div style={{ maxWidth: 800, margin: "20px auto" }}>
        <h2 style={{ fontFamily: "Arial, sans-serif", color: "#5b4636" }}>My Notes</h2>
        <form onSubmit={create} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            <input 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={inputStyle}
            />
            <textarea 
            placeholder="Content" 
            rows={4} 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            style={inputStyle}
            />
            <button 
            type="submit" 
            style={buttonStyle} 
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c9a77a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#d9b99b")}
            >
            Create Note
            </button>
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
