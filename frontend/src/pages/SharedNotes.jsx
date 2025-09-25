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

    // Shared card style
    const cardStyle = {
        border: "1px solid #c9a77a",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#fff8e1",
        fontFamily: "Arial, sans-serif",
        color: "#5b4636",
    };

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

    return (
        <div style={containerStyle}>
        <h2 style={{ marginBottom: 12 }}>Shared With Me</h2>
        {notes.length === 0 ? (
            <p>No shared notes yet.</p>
        ) : (
            notes.map((n) => (
            <div key={n.id} style={cardStyle}>
                <h3 style={{ marginBottom: 6 }}>{n.title}</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{n.content}</p>
            </div>
            ))
        )}
        </div>
    );
    }
