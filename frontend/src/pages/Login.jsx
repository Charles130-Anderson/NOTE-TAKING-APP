import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/login", {
        username_or_email: usernameOrEmail,
        password,
      });
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Username or Email" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {err && <div style={{ color: "red" }}>{err}</div>}
      </form>
      <p style={{ marginTop: 10 }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}