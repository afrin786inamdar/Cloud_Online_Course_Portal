import { Link } from "react-router-dom";

// ---------------- GUEST MENU ----------------
function GuestMenu() {
  return (
    <Link className="nav-link" to="/login">
      Login
    </Link>
  );
}

// ---------------- STUDENT MENU ----------------
function StudentMenu({ onLogout }) {
  return (
    <>
      <Link className="nav-link" to="/student/courses">My Courses</Link>
      <Link className="nav-link" to="/student/profile">Profile</Link>
    </>
  );
}

// ---------------- ADMIN MENU ----------------
function AdminMenu() {
  return (
    <div className="nav-item dropdown">
      <button
        className="nav-link dropdown-toggle btn btn-link text-white"
        data-bs-toggle="dropdown"
      >
        Admin
      </button>

      <ul className="dropdown-menu">
        <li>
          <Link className="dropdown-item" to="/admin/manage-courses">
            Manage Courses
          </Link>
        </li>

        <li>
          <Link className="dropdown-item" to="/admin/manage-videos">
            Manage Videos
          </Link>
        </li>

        <li>
          <Link className="dropdown-item" to="/admin/students">
            Student List
          </Link>
        </li>
      </ul>
    </div>
  );
}

// ---------------- MAIN NAVBAR ----------------
function Navbar() {

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand" to="/">
          <img
            src="https://sunbeaminfo.in/img/new/new_logo.png"
            alt="Sunbeam Logo"
            height="45"
          />
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#sunbeamNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="sunbeamNavbar">

          {/* LEFT SIDE MENU */}
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/about">About Sunbeam</Link>

            {role === "student" && <StudentMenu />}
            {role === "admin" && <AdminMenu />}
          </div>

          {/* RIGHT SIDE AUTH BUTTON */}
          <div className="navbar-nav ms-auto">
            {!user && <GuestMenu />}

            {user && (
              <button
                className="btn btn-outline-light"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
