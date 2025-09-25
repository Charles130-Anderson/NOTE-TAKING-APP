import { useEffect, useState } from "react";
import api from "../services/api";

export default function ManageSharing({ noteId }) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    api.get(`/notes/${noteId}/permissions`)
      .then(({ data }) => setPermissions(data))
      .catch(err => console.error("Error fetching permissions:", err));
  }, [noteId]);

  const updatePerm = async (userId, newPerm) => {
    await api.put(`/notes/${noteId}/permissions/${userId}`, { permission: newPerm });
    setPermissions((p) =>
      p.map(u => u.id === userId ? { ...u, permission: newPerm } : u)
    );
  };

  const remove = async (userId) => {
    await api.delete(`/notes/${noteId}/permissions/${userId}`);
    setPermissions((p) => p.filter(u => u.id !== userId));
  };

  return (
    <div style={{ marginTop: 10, padding: 8, border: "1px solid #ccc" }}>
      <h4>Shared With:</h4>
      {permissions.length === 0 && <p>No users yet</p>}
      {permissions.map((p) => (
        <div key={p.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>{p.email}</span>
          <select
            value={p.permission}
            onChange={(e) => updatePerm(p.id, e.target.value)}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button onClick={() => remove(p.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
