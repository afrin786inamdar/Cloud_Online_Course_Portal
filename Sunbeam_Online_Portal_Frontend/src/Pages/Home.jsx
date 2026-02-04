import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import { getActiveCourses } from "../Services/courseService";
import { getMyCourses } from "../Services/studentService";
import axios from "axios";
import Config from "../Services/Config";

import heroImg from "../assets/hero.jpg";

function Home() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  // ================= LOAD DATA =================
  useEffect(() => {
    loadCourses();

    if (isStudent) {
      loadMyCourses();
    }

    if (isAdmin) {
      loadAdminCourses();
    }
  }, []); // ❗ do NOT add dependencies

  // ================= COURSES =================
  const loadCourses = async () => {
    try {
      const result = await getActiveCourses();
      if (result.status === "success") {
        setCourses(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= STUDENT =================
  const loadMyCourses = async () => {
    try {
      const result = await getMyCourses(user.token);
      if (result.status === "success") {
        setEnrolledIds(result.data.map(c => Number(c.course_id)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADMIN =================
  const loadAdminCourses = async () => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/admin/courses-with-count`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      if (res.data.status === "success") {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= REGISTER =================
  const handleRegister = (course) => {
    localStorage.setItem("selectedCourse", JSON.stringify(course));
    navigate("/register");
  };

  // ================= UI =================
  return (
    <div style={{ backgroundColor: "#f5f9fd", minHeight: "100vh" }}>
      {/* HERO */}
      <div style={{ backgroundColor: "#e3f2fd" }} className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="fw-bold text-primary mb-3">
                Learn Skills That Matter 🚀
              </h1>
              <p className="text-muted fs-5">
                Join Sunbeam’s expert-led online courses and build industry-ready skills.
              </p>
            </Col>
            <Col md={6} className="text-center">
              <img src={heroImg} alt="hero" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* COURSES */}
      <Container className="py-5">
        <h2 className="text-center mb-4 text-primary">
          {isAdmin ? "Registered Courses" : "Available Courses"}
        </h2>

        <Row>
          {courses.map(course => {
            const isEnrolled = enrolledIds.includes(Number(course.course_id));

            return (
              <Col md={6} lg={4} key={course.course_id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-info">
                      {course.course_name}
                    </Card.Title>

                    <Card.Text>{course.description}</Card.Text>

                    <p><b>Fees:</b> ₹{course.fees}</p>
                    <p><b>Start:</b> {course.start_date}</p>
                    <p><b>End:</b> {course.end_date}</p>

                    {/* ===== ADMIN ===== */}
                    {isAdmin && (
                      <>
                        <p className="text-success">
                          <b>Registered Students:</b> {course.student_count}
                        </p>
                        <Button
                          variant="info"
                          className="w-100"
                          onClick={() =>
                            navigate(`/admin/courses/${course.course_id}/students`)
                          }
                        >
                          View Student List
                        </Button>
                      </>
                    )}

                    {/* ===== STUDENT ===== */}
                    {isStudent && !isAdmin && (
                      isEnrolled ? (
                        <Button
                          variant="outline-info"
                          className="w-100"
                          onClick={() => navigate("/student/courses")}
                        >
                          View Videos
                        </Button>
                      ) : (
                        <Button
                          variant="info"
                          className="w-100"
                          onClick={() => handleRegister(course)}
                        >
                          Register
                        </Button>
                      )
                    )}

                    {/* ===== GUEST ===== */}
                    {!isLoggedIn && (
                      <Button
                        variant="info"
                        className="w-100"
                        onClick={() => handleRegister(course)}
                      >
                        Register
                      </Button>
                    )}
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
