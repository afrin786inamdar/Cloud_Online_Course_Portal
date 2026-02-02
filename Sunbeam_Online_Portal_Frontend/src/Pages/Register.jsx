import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { registerUser } from "../Services/authService";

function Register() {
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_no: ""
  });

  const [loading, setLoading] = useState(false);

  // 🔥 Load course from localStorage
  useEffect(() => {
    const savedCourse = localStorage.getItem("selectedCourse");
    if (!savedCourse) {
      alert("Please select a course first");
      navigate("/");
      return;
    }
    setCourse(JSON.parse(savedCourse));
  }, [navigate]);

  if (!course) return null;

  const handleRegister = async () => {
  const { name, email, mobile_no } = form;

  if (!name || !email || !mobile_no) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      name,
      email,
      mobile_no,
      course_id: course.course_id   // ✅ MATCHES BACKEND
    };

    console.log("REGISTER DATA =>", payload);

    const result = await registerUser(payload);

    if (result.status === "success") {
      alert("Registered successfully!\nDefault password: sunbeam");
      localStorage.removeItem("selectedCourse");
      navigate("/login");
    } else {
      alert(result.error || "Registration failed");
    }
  } catch (err) {
    alert("Server error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h3 className="mb-4">Register for {course.course_name}</h3>

      <input
        className="form-control mb-3"
        placeholder="Full Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        className="form-control mb-3"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        className="form-control mb-3"
        placeholder="Mobile Number"
        value={form.mobile_no}
        onChange={(e) =>
          setForm({ ...form, mobile_no: e.target.value })
        }
      />

      <input
        className="form-control mb-3"
        value={course.course_name}
        disabled
      />

      <div className="alert alert-info">
        After registration, your account will be created with default password
        <b> sunbeam</b>.
      </div>

      <button
        className="btn btn-info w-100 text-white"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}

export default Register;
