import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Services/authService";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ React Router navigation

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser(email, password);

      console.log("LOGIN RESPONSE => ", result);

      if (result.status === "success") {

        // handle nested or direct backend response
        const userData = result.data?.data || result.data;

        if (!userData || !userData.role || !userData.token) {
          alert("Invalid response from server");
          return;
        }

        // normalize role
        const role = userData.role.trim().toLowerCase();

        // store user
        localStorage.setItem("user", JSON.stringify({
          token: userData.token,
          role: role,
          email: userData.email
        }));

        // 🔥 notify navbar immediately
        window.dispatchEvent(new Event("authChanged"));

        // ✅ SPA navigation (no reload)
        if (role === "admin") {
          navigate("/admin/manage-courses");
        } else {
          navigate("/student/courses");
        }

      } else {
        alert(result.error || "Login failed");
      }

    } catch (err) {
      console.error("Login Error => ", err);
      alert("Server error. Please try again.");
    }
    finally {
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
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
