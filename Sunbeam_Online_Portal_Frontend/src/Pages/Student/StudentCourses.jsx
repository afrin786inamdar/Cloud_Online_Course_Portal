import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ MISSING IMPORT
import { getMyCourses } from "../../Services/studentService";
import { Card, Button } from "react-bootstrap";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    const result = await getMyCourses(user.token);
    if (result.status === "success") {
      setCourses(result.data);
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
              onClick={() =>
                navigate(`/student/videos/${course.course_id}`)
              }
            >
              View Videos
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default StudentCourses;
