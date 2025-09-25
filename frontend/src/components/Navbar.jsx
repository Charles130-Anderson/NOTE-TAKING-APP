import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("access_token");

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // Common style for all links and buttons
  const linkStyle = {
    backgroundColor: "#d9b99b",
    color: "#5b4636",
    border: "1px solid #c9a77a",
    borderRadius: 4,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "normal",
    textDecoration: "none",
    fontFamily: "Arial, sans-serif",
  };

  const handleHover = (e) => {
    e.target.style.backgroundColor = "#c9a77a";
  };

  const handleLeave = (e) => {
    e.target.style.backgroundColor = "#d9b99b";
  };

  // Helper components to apply styling
  const StyledLink = ({ to, children }) => (
    <Link
      to={to}
      style={linkStyle}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {children}
    </Link>
  );

  const StyledButton = ({ onClick, children }) => (
    <button
      onClick={onClick}
      style={linkStyle}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {children}
    </button>
  );

  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      <StyledLink to="/">Dashboard</StyledLink>
      <StyledLink to="/shared">Shared With Me</StyledLink>

      {!isAuthed ? (
        <>
          <StyledLink to="/login">Login</StyledLink>
          <StyledLink to="/register">Register</StyledLink>
        </>
      ) : (
        <StyledButton onClick={logout}>Logout</StyledButton>
      )}
    </nav>
  );
}
