import { useState } from "react";
import ManageSharing from "./ManageSharing";

export default function NoteCard({ note, onEdit, onDelete }) {
  if (!note) return null;
  const [shareTo, setShareTo] = useState("");
  const [permission, setPermission] = useState("viewer");
  const [manageOpen, setManageOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleShare = async () => {
    if (!shareTo) {
      alert("Please enter an email address");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/send-email", {
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
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}>
      <h3>{note.title}</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onEdit(note)}>Edit</button>
        <button onClick={() => onDelete(note)}>Delete</button>
      </div>

      {/* Share controls */}
      <div style={{ marginTop: 8 }}>
        <input
          placeholder="Share with email"
          value={shareTo}
          onChange={(e) => setShareTo(e.target.value)}
          style={{ marginRight: 6 }}
        />
        <select value={permission} onChange={(e) => setPermission(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <button onClick={handleShare} disabled={loading}>
          {loading ? "Sending..." : "Share"}
        </button>
        {status && <p>{status}</p>}
      </div>

      {/* Manage Sharing */}
      <div style={{ marginTop: 8 }}>
        <button onClick={() => setManageOpen(!manageOpen)}>Manage Sharing</button>
        {manageOpen && <ManageSharing noteId={note.id} />}
      </div>
    </div>
  );
}
