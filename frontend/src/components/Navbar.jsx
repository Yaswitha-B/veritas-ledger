import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "16px 32px",
      background: "white",
      borderBottom: "1px solid #eee"
    }}>
      <h3 style={{ margin: 0, color: "#4285F4" }}>Veritas</h3>

      <div>
        <Link to="/" style={{ marginRight: 20 }}>Upload</Link>
        <Link to="/verify">Verify</Link>
      </div>
    </div>
  );
}