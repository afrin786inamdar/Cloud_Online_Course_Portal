import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";

import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import StudentCourses from "./Pages/Student/StudentCourses.jsx";

import ChangePassword from "./Pages/Student/ChangePassword";

import ManageCourses from "./Pages/Admin/ManageCourses.jsx";
import ManageVideos from "./Pages/Admin/ManageVideos.jsx";
import StudentList from "./Pages/Admin/StudentList.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT */}
        <Route path="/student/courses" element={<StudentCourses />} />
        <Route path="/student/change-password" element={<ChangePassword />} />

        {/* ADMIN */}
        <Route path="/admin/manage-courses" element={<ManageCourses />} />
        <Route path="/admin/manage-videos" element={<ManageVideos />} />
        <Route path="/admin/students" element={<StudentList />} />

        {/* OPTIONAL */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;
