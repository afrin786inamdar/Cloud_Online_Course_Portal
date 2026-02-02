import { useEffect, useState } from "react";
import axios from "axios";
import Config from "../../Services/Config";

function ManageCourses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const emptyCourse = {
    course_name: "",
    description: "",
    fees: "",
    start_date: "",
    end_date: "",
    video_expire_days: ""
  };

  const [form, setForm] = useState(emptyCourse);

  // 🔹 Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get(Config.BASE_URL + "/courses", {
        headers: { Authorization: "Bearer " + token }
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔹 Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${Config.BASE_URL}/courses/${editingId}`,
          form,
          { headers: { Authorization: "Bearer " + token } }
        );
      } else {
        await axios.post(
          `${Config.BASE_URL}/courses`,
          form,
          { headers: { Authorization: "Bearer " + token } }
        );
      }

      setForm(emptyCourse);
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      console.error("Failed to save course:", err);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.course_id);
    setForm(course);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete(`${Config.BASE_URL}/courses/${id}`, {
        headers: { Authorization: "Bearer " + token }
      });
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-3">Admin – Manage Courses</h4>

      <div className="row">
        {/* LEFT – COURSE TABLE */}
        <div className="col-md-7" style={{ maxHeight: "70vh", display: "flex", flexDirection: "column" }}>
          {/* Table heading + count – stays static */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Courses</h5>
            <span className="badge bg-primary">{courses.length} total</span>
          </div>

          {/* Scrollable table */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            <table className="table table-bordered mb-0">
              <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  <th>ID</th>
                  <th>Name & Description</th>
                  <th>Fees</th>
                  <th>Dates</th>
                  <th>Expire (days)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.course_id}>
                    <td>{c.course_id}</td>
                    <td>
                      <b>{c.course_name}</b>
                      <div className="text-muted small">{c.description}</div>
                    </td>
                    <td>₹{c.fees}</td>
                    <td>
                      {c.start_date} <br /> {c.end_date}
                    </td>
                    <td>{c.video_expire_days}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(c.course_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* RIGHT – ADD / EDIT FORM */}
        <div className="col-md-5">
          <div className="card p-3">
            <h5 className="mb-3">{editingId ? "Update Course" : "Add New Course"}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Course Name</label>
                <input
                  className="form-control"
                  value={form.course_name}
                  onChange={(e) => setForm({ ...form, course_name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="row mb-2">
                <div className="col">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Fees (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.fees}
                    onChange={(e) => setForm({ ...form, fees: e.target.value })}
                    required
                  />
                </div>
                <div className="col">
                  <label className="form-label">Video Expire Days</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.video_expire_days}
                    onChange={(e) => setForm({ ...form, video_expire_days: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                {editingId ? "Update Course" : "Add Course"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCourses;
