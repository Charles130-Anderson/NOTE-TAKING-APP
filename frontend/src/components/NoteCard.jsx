    import { useState } from "react";
    import ManageSharing from "./ManageSharing";

    export default function NoteCard({ note, onEdit, onDelete }) {
    if (!note) return null;
    const [shareTo, setShareTo] = useState("");
    const [permission, setPermission] = useState("viewer");
    const [manageOpen, setManageOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const buttonStyle = {
        backgroundColor: "#d9b99b",
        color: "#5b4636",
        border: "1px solid #c9a77a",
        borderRadius: 4,
        padding: "6px 12px",
        cursor: "pointer",
        fontFamily: "Arial, sans-serif",
        textDecoration: "none",
    };

    const selectStyle = {
        ...buttonStyle,
        appearance: "none",
        padding: "6px 10px",
    };

    const inputStyle = {
        ...buttonStyle,
        padding: "6px 10px",
        border: "1px solid #c9a77a",
        borderRadius: 4,
        fontFamily: "Arial, sans-serif",
        outline: "none",
        flex: 1, // make input grow to fit available space
    };

    const handleHover = (e) => {
        e.target.style.backgroundColor = "#c9a77a";
    };

    const handleLeave = (e) => {
        e.target.style.backgroundColor = "#d9b99b";
    };

    const handleShare = async () => {
        if (!shareTo) {
        alert("Please enter an email address");
        return;
        }

        setLoading(true);
        setStatus(null);

        try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            to: shareTo,
            subject: `Note shared: ${note.title}`,
            body: `You have been invited as a ${permission}.\n\nNote Content:\n${note.content}`,
            }),
        });

        const data = await res.json();
        console.log("Email response:", data);

        setStatus("✅ Email sent successfully!");
        setShareTo("");
        } catch (error) {
        console.error("Error sending email:", error);
        setStatus("❌ Failed to send email");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div
        style={{
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: "#f5e9d3",
            color: "#5b4636",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
        }}
        >
        <h3>{note.title}</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>

        <div style={{ display: "flex", gap: 8 }}>
            <button
            style={buttonStyle}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={() => onEdit(note)}
            >
            Edit
            </button>
            <button
            style={buttonStyle}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={() => onDelete(note)}
            >
            Delete
            </button>
        </div>

        {/* Share controls */}
        <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
            <input
            placeholder="Share with email"
            value={shareTo}
            onChange={(e) => setShareTo(e.target.value)}
            style={inputStyle}
            />
            <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            style={selectStyle}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            </select>
            <button
            style={buttonStyle}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={handleShare}
            disabled={loading}
            >
            {loading ? "Sending..." : "Share"}
            </button>
        </div>

        {/* Manage Sharing */}
        <div style={{ marginTop: 8 }}>
            <button
            style={buttonStyle}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={() => setManageOpen(!manageOpen)}
            >
            Manage Sharing
            </button>
            {manageOpen && <ManageSharing noteId={note.id} />}
        </div>

        {status && <p>{status}</p>}
        </div>
    );
    }
