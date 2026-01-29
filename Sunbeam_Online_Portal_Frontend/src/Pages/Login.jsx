import { useState } from "react";
import { loginUser } from "../Services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await loginUser(email, password);

      // assuming backend returns: { status:"success", data:{ token, role, email } }
      if (result.status === "success") {
        localStorage.setItem("user", JSON.stringify(result.data));

        const role = result.data.role?.toLowerCase();

        if (role === "admin") {
          window.location.href = "/admin/manage-courses";
        } else {
          window.location.href = "/student/courses";
        }
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Login failed. Check backend is running and API URL is correct.");
      console.log(err);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 420 }}>
      <h3>Login</h3>

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

      <button className="btn btn-primary w-100" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;
