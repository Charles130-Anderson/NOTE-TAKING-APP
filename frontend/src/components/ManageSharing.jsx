import { useEffect, useState } from "react";
import api from "../services/api";

export default function ManageSharing({ noteId }) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    api
      .get(`/notes/${noteId}/permissions`)
      .then(({ data }) => setPermissions(data))
      .catch((err) => console.error("Error fetching permissions:", err));
  }, [noteId]);

  const updatePerm = async (userId, newPerm) => {
    await api.put(`/notes/${noteId}/permissions/${userId}`, { permission: newPerm });
    setPermissions((p) =>
      p.map((u) => (u.id === userId ? { ...u, permission: newPerm } : u))
    );
  };

  const remove = async (userId) => {
    await api.delete(`/notes/${noteId}/permissions/${userId}`);
    setPermissions((p) => p.filter((u) => u.id !== userId));
  };

  // Button style
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

  // Select style
  const selectStyle = {
    padding: "6px",
    borderRadius: 4,
    border: "1px solid #c9a77a",
    backgroundColor: "#fff8e1",
    fontFamily: "Arial, sans-serif",
    color: "#5b4636",
  };

  // Container style
  const containerStyle = {
    marginTop: 10,
    padding: 12,
    border: "1px solid #c9a77a",
    borderRadius: 6,
    backgroundColor: "#fff8e1",
    fontFamily: "Arial, sans-serif",
    color: "#5b4636",
  };

  return (
    <div style={containerStyle}>
      <h4 style={{ marginBottom: 10 }}>Shared With:</h4>
      {permissions.length === 0 && <p>No users yet</p>}
      {permissions.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span>{p.email}</span>
          <select
            value={p.permission}
            onChange={(e) => updatePerm(p.id, e.target.value)}
            style={selectStyle}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button
            onClick={() => remove(p.id)}
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c9a77a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#d9b99b")}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
