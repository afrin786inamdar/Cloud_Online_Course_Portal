import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);

  const readUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // set initially
    setUser(readUser());

    // listen for changes (works between tabs)
    const onStorage = () => setUser(readUser());
    window.addEventListener("storage", onStorage);

    // custom event for same tab (important)
    const onAuthChange = () => setUser(readUser());
    window.addEventListener("authChanged", onAuthChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChange);
    };
  }, []);

  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged")); //  update navbar instantly
    window.location.href = "/login";
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
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/about">About Sunbeam</Link>

            {role === "student" && (
              <>
                <Link className="nav-link" to="/student/courses">My Courses</Link>
                <Link className="nav-link" to="/student/profile">Profile</Link>
              </>
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

          <div className="navbar-nav ms-auto">
            {!user && (
              <Link className="nav-link" to="/login">
                Login
              </Link>
            )}

            {user && (
              <button className="btn btn-outline-light" onClick={handleLogout}>
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
