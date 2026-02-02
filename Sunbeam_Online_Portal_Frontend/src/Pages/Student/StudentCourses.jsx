import { useEffect, useState } from "react";
import { getMyCourses } from "../../Services/studentService";
import { getVideosByCourse } from "../../Services/videoService";
import { Card, Button } from "react-bootstrap";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    const result = await getMyCourses(user.token);
    if (result.status === "success") setCourses(result.data);
  };

  const loadVideos = async (courseId) => {
    const result = await getVideosByCourse(courseId, user.token);
    if (result.status === "success") {
      setVideos(result.data);
      setActiveCourse(courseId);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>My Enrolled Courses</h3>

      {courses.map(course => (
        <Card className="mb-3" key={course.course_id}>
          <Card.Body>
            <Card.Title className="text-info">
              {course.course_name}
            </Card.Title>

            <Button
              variant="info"
              className="text-white"
              onClick={() => loadVideos(course.course_id)}
            >
              {activeCourse === course.course_id ? "Hide Videos" : "View Videos"}
            </Button>

            {activeCourse === course.course_id && (
              <div className="mt-3">
                {videos.map(video => (
                  <div key={video.video_id} className="mb-3">
                    <h6>{video.title}</h6>
                    <p className="text-muted">{video.description}</p>

                    <iframe
                      width="100%"
                      height="315"
                      src={video.youtube_url}
                      title={video.title}
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default StudentCourses;
