import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar.jsx";

import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";

/* STUDENT */
import StudentCourses from "./Pages/Student/StudentCourses.jsx";
import StudentVideos from "./Pages/Student/StudentVideos.jsx";
import ChangePassword from "./Pages/Student/ChangePassword";

/* ADMIN */
import AdminStudentList from "./Pages/Admin/AdminStudentList";
import ManageCourses from "./Pages/Admin/ManageCourses.jsx";
import ManageVideos from "./Pages/Admin/ManageVideos.jsx";
import StudentList from "./Pages/Admin/StudentList.jsx";

function App() {
  return (
    <>
      {/* ✅ Navbar always visible */}
      <Navbar />

      {/* ✅ ROUTES */}
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== STUDENT ===== */}
        <Route path="/student/courses" element={<StudentCourses />} />
        <Route path="/student/videos/:courseId" element={<StudentVideos />} />
        <Route path="/student/change-password" element={<ChangePassword />} />

        {/* ===== ADMIN ===== */}
        <Route path="/admin/manage-courses" element={<ManageCourses />} />
        <Route path="/admin/manage-videos" element={<ManageVideos />} />
        <Route path="/admin/students" element={<StudentList />} />
        <Route
          path="/admin/courses/:courseId/students"
          element={<AdminStudentList />}
        />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<h2 className="text-center mt-5">Page Not Found</h2>} />
      </Routes>

      {/* ✅ TOASTIFY (ONLY ONCE) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
