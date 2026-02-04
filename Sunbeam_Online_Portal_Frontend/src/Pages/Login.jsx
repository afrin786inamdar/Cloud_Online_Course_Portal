import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(email, password);

      if (result.status === "success") {
        const userData = result.data?.data || result.data;

        if (!userData?.token || !userData?.role) {
          alert("Invalid response from server");
          return;
        }

        const role = userData.role.trim().toLowerCase();

        localStorage.setItem(
          "user",
          JSON.stringify({
            token: userData.token,
            role,
            email: userData.email
          })
        );

        // 🔥 update navbar instantly
        window.dispatchEvent(new Event("authChanged"));

        // ✅ ALWAYS GO HOME
        navigate("/", { replace: true });

      } else {
        alert(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Login</h3>

      <input
        className="form-control mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        className="btn btn-primary w-100"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;