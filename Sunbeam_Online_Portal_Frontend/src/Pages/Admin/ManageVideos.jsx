

import { useEffect, useState } from "react";
import axios from "axios";
import Config from "../../Services/Config";

function ManageVideos() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const [courses, setCourses] = useState([]); // all courses + videos
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [video, setVideo] = useState({
    video_id: "",
    course_id: "",
    title: "",
    youtube_url: "",
    description: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  const emptyVideo = { video_id: "", course_id: "", title: "", youtube_url: "", description: "" };

  /* ===============================
     FETCH ALL COURSES WITH VIDEOS
  =============================== */
  const fetchAllCoursesWithVideos = async () => {
    try {
      const res = await axios.get(
        Config.BASE_URL + "/videos/public/courses-with-videos",
        { headers: { Authorization: "Bearer " + token } } // optional if admin route requires auth
      );
      setCourses(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch courses with videos:", error);
    }
  };

  useEffect(() => {
    fetchAllCoursesWithVideos();
  }, []);

  /* ===============================
     FILTERED COURSES BASED ON DROPDOWN
  =============================== */
  const visibleCourses = selectedCourseId
    ? courses.filter(c => c.course_id === Number(selectedCourseId))
    : courses;

  /* ===============================
     ADD / UPDATE VIDEO
  =============================== */
  const handleSubmit = async () => {
    if (!video.course_id || !video.title || !video.youtube_url) {
      alert("Course, Title and YouTube URL are required");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          Config.BASE_URL + "/videos/" + video.video_id,
          video,
          { headers: { Authorization: "Bearer " + token } }
        );
        alert("Video updated");
      } else {
        await axios.post(
          Config.BASE_URL + "/videos",
          video,
          { headers: { Authorization: "Bearer " + token } }
        );
        alert("Video added");
      }

      setVideo(emptyVideo);
      setIsEditing(false);
      await fetchAllCoursesWithVideos(); // reload everything
      setSelectedCourseId(null); // optional: reset filter
    } catch (error) {
      console.error("Failed to save video:", error);
      alert("Error saving video");
    }
  };

  /* ===============================
     EDIT VIDEO
  =============================== */
  const editVideo = (v, courseId) => {
    setVideo({ ...v, course_id: courseId });
    setIsEditing(true);
  };

  /* ===============================
     DELETE VIDEO
  =============================== */
  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await axios.delete(
        Config.BASE_URL + "/videos/" + id,
        { headers: { Authorization: "Bearer " + token } }
      );
      await fetchAllCoursesWithVideos(); // reload after delete
      setSelectedCourseId(null);
    } catch (error) {
      console.error("Failed to delete video:", error);
      alert("Error deleting video");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-primary">Admin – Manage Videos</h3>

      <div className="row">
        {/* ================= LEFT TABLE ================= */}
        <div className="col-md-7">
        <div className="card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>

            <div className="card-header d-flex justify-content-between">
              <b>Videos</b>

              <select
                className="form-select w-50"
                value={selectedCourseId || ""}
                onChange={e => setSelectedCourseId(e.target.value || null)}
              >
                <option value="">All Courses</option>
                {courses.map(c => (
                  <option key={c.course_id} value={c.course_id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
            </div>

            <table className="table table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Course</th>
                  <th>Title</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCourses.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">No videos found</td>
                  </tr>
                )}

                {visibleCourses.map(course =>
                  course.videos.length > 0 ? (
                    course.videos.map(videoItem => (
                      <tr key={videoItem.video_id}>
                        <td>{videoItem.video_id}</td>
                        <td>{course.course_name}</td>
                        <td>{videoItem.title}</td>
                        <td>
                          <a href={videoItem.youtube_url} target="_blank" rel="noreferrer">View</a>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => editVideo(videoItem, course.course_id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteVideo(videoItem.video_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={`empty-${course.course_id}`}>
                      <td>-</td>
                      <td>{course.course_name}</td>
                      <td colSpan="3">No videos</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
{/* ================= RIGHT FORM ================= */}
<div className="col-md-5">
  <div className="card">
    <div className="card-header">
      <b>{isEditing ? "Edit Video" : "Add New Video"}</b>
    </div>

    <div className="card-body">
      <div className="mb-3">
        <label className="form-label">Video ID (optional)</label>
        <input
          className="form-control"
          placeholder="Auto-generated if left blank"
          value={video.video_id}
          disabled
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Course</label>
        <select
          className="form-select"
          value={video.course_id}
          onChange={(e) =>
            setVideo({ ...video, course_id: e.target.value })
          }
        >
          <option value="">Select course</option>
          {courses.map(c => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={video.title}
          onChange={(e) =>
            setVideo({ ...video, title: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">YouTube URL</label>
        <input
          className="form-control"
          value={video.youtube_url}
          onChange={(e) =>
            setVideo({ ...video, youtube_url: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows={3}
          value={video.description}
          onChange={(e) =>
            setVideo({ ...video, description: e.target.value })
          }
        />
      </div>

      <button
        className="btn w-100 text-white"
        style={{ backgroundColor: "#0d6efd" }} // Replace with your navbar color
        onClick={handleSubmit}
      >
        {isEditing ? "Update Video" : "Add Video"}
      </button>
    </div>
  </div>
</div>


      </div>
    </div>
  );
}

export default ManageVideos;
