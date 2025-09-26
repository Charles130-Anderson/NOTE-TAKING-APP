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
        const { data } = await api.post("/login-json", {
            username_or_email: usernameOrEmail,
            password,
        });
        localStorage.setItem("access_token", data.access_token);
        navigate("/");
        } catch (e) {
        setErr(e.response?.data?.detail || "Login failed");
        }
    };

    // Button style (matches Dashboard & Navbar)
    const buttonStyle = {
        backgroundColor: "#d9b99b",
        color: "#5b4636",
        border: "1px solid #c9a77a",
        borderRadius: 4,
        padding: "6px 12px",
        cursor: "pointer",
        fontWeight: "normal", // keep normal or bold
        fontFamily: "Arial, sans-serif",
        textDecoration: "none",
    };

    // Input style (soft sepia theme)
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
        <div style={{ maxWidth: 420, margin: "40px auto" }}>
        <h2 style={{ fontFamily: "Arial, sans-serif", color: "#5b4636" }}>Login</h2>
        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
            <input
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            style={inputStyle}
            />
            <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            />
            <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c9a77a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#d9b99b")}
            >
            Login
            </button>
            {err && <div style={{ color: "red", fontFamily: "Arial, sans-serif" }}>{err}</div>}
        </form>
        <p style={{ marginTop: 10, fontFamily: "Arial, sans-serif", color: "#5b4636" }}>
            No account?{" "}
            <Link
            to="/register"
            style={{
                ...buttonStyle,
                padding: "4px 8px",
                fontWeight: "normal",
                textDecoration: "underline",
            }}
            >
            Register
            </Link>
        </p>
        </div>
    );
    }
