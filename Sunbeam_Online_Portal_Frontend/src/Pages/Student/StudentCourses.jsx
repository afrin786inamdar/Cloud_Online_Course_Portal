import { useEffect, useState } from "react";
import { getMyCourses } from "../../Services/studentService";
import axios from "axios";
import Config from "../../Services/Config";
import { Card, Button } from "react-bootstrap";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState({});
  const [openCourseId, setOpenCourseId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    const res = await getMyCourses(user.token);
    if (res.status === "success") {
      setCourses(res.data);
    }
  };

  const toggleVideos = async (courseId) => {
    if (openCourseId === courseId) {
      setOpenCourseId(null);
      return;
    }

    try {
      const res = await axios.get(
        `${Config.BASE_URL}/videos/course/${courseId}`,
        {
          headers: {
            Authorization: "Bearer " + user.token
          }
        }
      );

      if (res.data.status === "success") {
        setVideos(prev => ({
          ...prev,
          [courseId]: res.data.data
        }));
        setOpenCourseId(courseId);
      }
    } catch (err) {
      alert("Unable to load videos");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-info">My Enrolled Courses</h3>

      <div className="row">
        {courses.map(course => (
          <div className="col-md-6 mb-4" key={course.course_id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h5 className="text-info">{course.course_name}</h5>
                <p>{course.description}</p>

                <p><b>Course ID:</b> {course.course_id}</p>
                <p><b>Fees:</b> ₹{course.fees}</p>
                <p><b>Video Expire Days:</b> {course.video_expire_days}</p>

                <Button
                  variant="info"
                  className="w-100"
                  onClick={() => toggleVideos(course.course_id)}
                >
                  {openCourseId === course.course_id
                    ? "Hide Videos"
                    : "View Videos"}
                </Button>

                {/* VIDEOS SECTION */}
                {openCourseId === course.course_id && (
                  <div className="mt-3">
                    {videos[course.course_id]?.map((v, index) => (
                      <div key={v.video_id} className="border-top pt-3">
                        <h6>{index + 1}. {v.title}</h6>
                        <p className="text-muted">{v.description}</p>

                        <iframe
                          width="100%"
                          height="250"
                          src={v.youtube_url}
                          title={v.title}
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                )}

              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
