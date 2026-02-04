import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { registerUser } from "../Services/authService";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_no: ""
  });

  // 🔹 Load selected course
  useEffect(() => {
    const savedCourse = localStorage.getItem("selectedCourse");

    if (!savedCourse) {
      toast.error("Please select a course first");
      navigate("/", { replace: true });
      return;
    }

    setCourse(JSON.parse(savedCourse));
  }, [navigate]);

  if (!course) return null;

  const handleRegister = async () => {
    const { name, email, mobile_no } = form;

    if (!name || !email || !mobile_no) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        mobile_no: mobile_no.trim(),
        course_id: course.course_id
      };

      const result = await registerUser(payload);

      if (result.status === "success") {
        // 🔥 Store registered course for GUEST UI
        const stored =
          JSON.parse(localStorage.getItem("registeredCourseIds")) || [];

        const courseId = Number(course.course_id);

        if (!stored.includes(courseId)) {
          stored.push(courseId);
          localStorage.setItem(
            "registeredCourseIds",
            JSON.stringify(stored)
          );
        }

        localStorage.removeItem("selectedCourse");

        toast.success(
          "Registered successfully! Please login to access this course."
        );

        // ✅ Go back to HOME (not login page)
        navigate("/", { replace: true });
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
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
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="form-control mb-3"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="form-control mb-3"
        placeholder="Mobile Number"
        value={form.mobile_no}
        onChange={e => setForm({ ...form, mobile_no: e.target.value })}
      />

      <input
        className="form-control mb-3"
        value={course.course_name}
        disabled
      />

      <div className="alert alert-info">
        Default password after registration is <b>sunbeam</b>
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