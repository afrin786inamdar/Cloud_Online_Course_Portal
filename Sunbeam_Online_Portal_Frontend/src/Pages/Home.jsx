import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import { getActiveCourses } from "../Services/courseService";
import { getMyCourses } from "../Services/studentService";

import heroImg from "../assets/hero.jpg";

function Home() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ================= LOAD DATA =================
  useEffect(() => {
    loadCourses();
    if (user?.token) {
      loadMyCourses();
    }
  }, []);

  const loadCourses = async () => {
    try {
      const result = await getActiveCourses();
      if (result.status === "success") {
        setCourses(result.data);
      }
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  const loadMyCourses = async () => {
    try {
      const result = await getMyCourses(user.token);
      if (result.status === "success") {
        // store only course_id for comparison
        setEnrolledIds(result.data.map(c => c.course_id));
      }
    } catch (err) {
      console.error("Error loading enrolled courses:", err);
    }
  };

  // ================= UI =================
  return (
    <div style={{ backgroundColor: "#f5f9fd", minHeight: "100vh" }}>

      {/* ================= HERO SECTION ================= */}
      <div style={{ backgroundColor: "#e3f2fd" }} className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="fw-bold text-primary mb-3">
                Learn Skills That Matter 🚀
              </h1>
              <p className="text-muted fs-5">
                Join Sunbeam’s expert-led online courses and build
                industry-ready skills in MERN, Python, and more.
              </p>

              <div className="mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="me-3"
                  onClick={() =>
                    document.getElementById("courses")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore Courses
                </Button>

                {!user && (
                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                )}
              </div>
            </Col>

            <Col md={6} className="text-center">
              <img
                src={heroImg}
                alt="Online Learning"
                className="img-fluid"
                style={{ maxHeight: "350px" }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* ================= AVAILABLE COURSES ================= */}
      <Container className="py-5" id="courses">
        <h2 className="text-center mb-4 text-primary">
          Available Courses
        </h2>

        <Row>
          {courses.length === 0 && (
            <p className="text-center">No active courses available</p>
          )}

          {courses.map(course => {
            const isEnrolled = enrolledIds.includes(course.course_id);

            return (
              <Col md={6} lg={4} key={course.course_id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="fw-bold text-info">
                      {course.course_name}
                    </Card.Title>

                    <Card.Text>{course.description}</Card.Text>

                    <p><b>Fees:</b> ₹{course.fees}</p>
                    <p><b>Start:</b> {course.start_date}</p>
                    <p><b>End:</b> {course.end_date}</p>

                    <div className="d-flex gap-2">
                      {/* NOT ENROLLED */}
                      {!isEnrolled && (
                        <Button
                          variant="info"
                          className="text-white"
                          onClick={() => {
                            localStorage.setItem(
                              "selectedCourse",
                              JSON.stringify({
                                course_id: course.course_id,
                                course_name: course.course_name
                              })
                            );
                            navigate("/register");
                          }}
                        >
                          Register
                        </Button>
                      )}

                      {/* ENROLLED */}
                      {isEnrolled && (
                        <Button
                          variant="outline-info"
                          onClick={() => navigate("/student/courses")}
                        >
                          View Videos
                        </Button>
                      )}

                      {/* NOT LOGGED IN */}
                      {!user && (
                        <Button
                          variant="outline-info"
                          onClick={() => navigate("/login")}
                        >
                          Login
                        </Button>
                      )}
                    </div>

                    <div className="mt-2 text-muted small">
                      {isEnrolled
                        ? "You are enrolled in this course"
                        : "Register to unlock video lectures"}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
