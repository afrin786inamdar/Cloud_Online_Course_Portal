import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Services/Config";
import { Card, Button } from "react-bootstrap";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/admin/courses`,
        {
          headers: {
            Authorization: "Bearer " + admin.token
          }
        }
      );

      if (res.data.status === "success") {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load courses");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-info mb-4">Registered Courses</h3>

      <div className="row">
        {courses.map(course => (
          <div className="col-md-6 mb-4" key={course.course_id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-info">
                  {course.course_name}
                </Card.Title>

                <Card.Text>{course.description}</Card.Text>

                <p><b>Course ID:</b> {course.course_id}</p>
                <p><b>Fees:</b> ₹{course.fees}</p>
                <p><b>Start Date:</b> {course.start_date}</p>
                <p><b>End Date:</b> {course.end_date}</p>
                <p><b>Video Expire Days:</b> {course.video_expire_days}</p>

                <p className="text-success">
                  <b>Registered Students:</b> {course.student_count}
                </p>

                <Button
                  variant="info"
                  className="w-100"
                  onClick={() =>
                    navigate(`/admin/students/${course.course_id}`)
                  }
                >
                  View Registered Students ({course.student_count})
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCourses;
