import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const readUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setUser(readUser());

    const onStorage = () => setUser(readUser());
    window.addEventListener("storage", onStorage);

    const onAuthChange = () => setUser(readUser());
    window.addEventListener("authChanged", onAuthChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChange);
    };
  }, []);

  const role = user?.role?.toLowerCase();
  const email = user?.email || "";

  const avatarText = useMemo(() => {
    if (!email) return "?";
    return email[0].toUpperCase();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  const goToChangePassword = () => {
    navigate("/student/change-password"); // only student allowed
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="https://sunbeaminfo.in/img/new/new_logo.png"
            alt="Sunbeam Logo"
            height="45"
          />
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#sunbeamNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="sunbeamNavbar">
          {/* LEFT MENU */}
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/about">About Sunbeam</Link>

            {role === "student" && (
              <Link className="nav-link" to="/student/courses">
                My Courses
              </Link>
            )}

            {role === "admin" && (
              <div className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-white"
                  data-bs-toggle="dropdown"
                >
                  Admin
                </button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/admin/manage-courses">Manage Courses</Link></li>
                  <li><Link className="dropdown-item" to="/admin/manage-videos">Manage Videos</Link></li>
                  <li><Link className="dropdown-item" to="/admin/students">Student List</Link></li>
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT PROFILE SECTION */}
          <div className="navbar-nav ms-auto align-items-center">

            {!user && (
              <Link className="nav-link" to="/login">
                Login
              </Link>
            )}

            {user && (
              <div className="nav-item dropdown">
                {/* Profile Icon */}
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                  style={{ borderRadius: 999 }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {avatarText}
                  </span>
                  <span className="d-none d-md-inline">Profile</span>
                </button>

                {/* DROPDOWN */}
                <ul className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: 260 }}>

                  {/* USER INFO */}
                  <li className="mb-2">
                    <div className="fw-bold">{email}</div>
                    <div className="text-muted small">Role: {role}</div>
                  </li>

                  <li><hr className="dropdown-divider" /></li>

                  {/* STUDENT ONLY CHANGE PASSWORD */}
                  {role === "student" && (
                    <li>
                      <button
                        className="btn btn-primary w-100 mb-2"
                        onClick={goToChangePassword}
                      >
                        Change Password
                      </button>
                    </li>
                  )}

                  {/* LOGOUT (BOTH) */}
                  <li>
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>

                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
