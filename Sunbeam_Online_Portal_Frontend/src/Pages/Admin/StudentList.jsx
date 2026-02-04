import { useEffect, useState } from "react";
import { getStudentList } from "../../Services/studentService";

function StudentList() {

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  // ---------------- LOAD STUDENTS ----------------
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.token) {
        alert("Unauthorized access");
        return;
      }

      const result = await getStudentList(user.token);

      if (result.status === "success") {
        setStudents(result.data);
        setFilteredStudents(result.data);
      } else {
        alert(result.error);
      }

    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  };

  // ---------------- FILTER + SEARCH + SORT ----------------
  useEffect(() => {

    let data = [...students];

    // Search filter
    if (search) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.mobile_no.includes(search)
      );
    }

    // Course filter
    if (courseFilter !== "all") {
      data = data.filter((s) => s.course_name === courseFilter);
    }

    // Sort by reg_no
    data.sort((a, b) =>
      sortOrder === "asc"
        ? a.reg_no - b.reg_no
        : b.reg_no - a.reg_no
    );

    setFilteredStudents(data);

  }, [search, courseFilter, sortOrder, students]);

  // ---------------- UNIQUE COURSE LIST ----------------
  const courses = [...new Set(students.map(s => s.course_name))];

  return (
    <div className="container mt-4">

      <h3 className="text-info mb-3">Admin – Registered Students</h3>

      {/* FILTER BAR */}
      <div className="row mb-3">

        {/* COURSE FILTER */}
        <div className="col-md-3">
          <label>Course</label>
          <select
            className="form-select"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map((c, index) => (
              <option key={index} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* SEARCH */}
        <div className="col-md-5">
          <label>Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email or mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* SORT */}
        <div className="col-md-2">
          <label>Sort By</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Reg No Asc</option>
            <option value="desc">Reg No Desc</option>
          </select>
        </div>

      </div>

      {/* TABLE */}
      <div className="table-responsive">

        <table className="table table-bordered table-hover">

          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Course</th>
              <th>Reg No</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-danger">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.reg_no}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.mobile_no}</td>
                  <td>{s.course_name}</td>
                  <td>{s.reg_no}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default StudentList;