// import { useEffect, useState } from "react";
// import axios from "axios";
// import Config from "../../Services/Config";

// function ManageVideos() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;

//   const [courses, setCourses] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [courseId, setCourseId] = useState("");

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     youtube_url: ""
//   });

//   // Load courses
//   useEffect(() => {
//     axios.get(Config.BASE_URL + "/courses", {
//       headers: { Authorization: "Bearer " + token }
//     }).then(res => setCourses(res.data.data || []));
//   }, []);

//   // Load videos by course
//   const loadVideos = async (id) => {
//     setCourseId(id);
//     const res = await axios.get(
//       Config.BASE_URL + "/videos/" + id,
//       { headers: { Authorization: "Bearer " + token } }
//     );
//     setVideos(res.data.data || []);
//   };

//   // Add video
//   const addVideo = async () => {
//     await axios.post(
//       Config.BASE_URL + "/videos",
//       { ...form, course_id: courseId },
//       { headers: { Authorization: "Bearer " + token } }
//     );
//     setForm({ title: "", description: "", youtube_url: "" });
//     loadVideos(courseId);
//   };

//   // Delete video
//   const deleteVideo = async (id) => {
//     await axios.delete(
//       Config.BASE_URL + "/videos/" + id,
//       { headers: { Authorization: "Bearer " + token } }
//     );
//     loadVideos(courseId);
//   };

//   return (
//     <div className="container mt-4">
//       <h4 className="text-primary mb-3">Admin – Manage Videos</h4>

//       <select
//         className="form-select mb-3"
//         onChange={e => loadVideos(e.target.value)}
//       >
//         <option value="">Select Course</option>
//         {courses.map(c => (
//           <option key={c.course_id} value={c.course_id}>
//             {c.course_name}
//           </option>
//         ))}
//       </select>

//       {courseId && (
//         <>
//           <table className="table table-bordered">
//             <thead className="table-light">
//               <tr>
//                 <th>Title</th>
//                 <th>Youtube URL</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {videos.map(v => (
//                 <tr key={v.video_id}>
//                   <td>{v.title}</td>
//                   <td>
//                     <a href={v.youtube_url} target="_blank">Open</a>
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-danger"
//                       onClick={() => deleteVideo(v.video_id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="card">
//             <div className="card-header">Add Video</div>
//             <div className="card-body">
//               <input
//                 className="form-control mb-2"
//                 placeholder="Title"
//                 value={form.title}
//                 onChange={e => setForm({ ...form, title: e.target.value })}
//               />
//               <input
//                 className="form-control mb-2"
//                 placeholder="YouTube URL"
//                 value={form.youtube_url}
//                 onChange={e => setForm({ ...form, youtube_url: e.target.value })}
//               />
//               <textarea
//                 className="form-control mb-3"
//                 placeholder="Description"
//                 value={form.description}
//                 onChange={e => setForm({ ...form, description: e.target.value })}
//               />

//               <button className="btn btn-primary w-100" onClick={addVideo}>
//                 Add Video
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default ManageVideos;
import { useEffect, useState } from "react";
import axios from "axios";
import Config from "../../Services/Config";

function ManageVideos() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [courseId, setCourseId] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    youtube_url: ""
  });

  // Load courses
  useEffect(() => {
    axios.get(Config.BASE_URL + "/courses", {
      headers: { Authorization: "Bearer " + token }
    }).then(res => setCourses(res.data.data || []));
  }, []);

  // Load videos by course
  const loadVideos = async (id) => {
    setCourseId(id);
    if (!id) {
      setVideos([]);
      return;
    }
    const res = await axios.get(
      Config.BASE_URL + "/videos/" + id,
      { headers: { Authorization: "Bearer " + token } }
    );
    setVideos(res.data.data || []);
  };

  // Add video
  const addVideo = async () => {
    if (!courseId) return alert("Select a course first");

    await axios.post(
      Config.BASE_URL + "/videos",
      { ...form, course_id: courseId },
      { headers: { Authorization: "Bearer " + token } }
    );
    setForm({ title: "", description: "", youtube_url: "" });
    loadVideos(courseId);
  };

  // Delete video
  const deleteVideo = async (id) => {
    await axios.delete(
      Config.BASE_URL + "/videos/" + id,
      { headers: { Authorization: "Bearer " + token } }
    );
    loadVideos(courseId);
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-3">Admin – Manage Videos</h4>

      <div className="row">
        {/* LEFT – VIDEO TABLE */}
        <div className="col-md-7">
          <div className="mb-3">
            <select
              className="form-select"
              value={courseId}
              onChange={e => loadVideos(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <table className="table table-bordered mb-0">
              <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Youtube URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.video_id}>
                    <td>{v.video_id}</td>
                    <td>{v.title}</td>
                    <td>
                      <a href={v.youtube_url} target="_blank">View</a>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteVideo(v.video_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No videos found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT – ADD VIDEO FORM */}
        <div className="col-md-5">
          <div className="card p-3">
            <h5 className="mb-3">Add New Video</h5>

            <div className="mb-2">
              <label className="form-label">Course</label>
              <select
                className="form-select"
                value={courseId}
                onChange={e => loadVideos(e.target.value)}
              >
                <option value="">Select course</option>
                {courses.map(c => (
                  <option key={c.course_id} value={c.course_id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">YouTube URL</label>
              <input
                type="text"
                className="form-control"
                value={form.youtube_url}
                onChange={e => setForm({ ...form, youtube_url: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <button className="btn btn-primary w-100" onClick={addVideo}>
              Add Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageVideos;
