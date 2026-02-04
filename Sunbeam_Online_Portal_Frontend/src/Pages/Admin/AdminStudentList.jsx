import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import axios from "axios";
import Config from "../../Services/Config";

function AdminStudentList() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/admin/courses/${courseId}/students`,
        {
          headers: {
            Authorization: "Bearer " + user.token
          }
        }
      );

      if (res.data.status === "success") {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error("Error loading students", err);
    }
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-primary">
        Registered Students
      </h3>

      {students.length === 0 ? (
        <p>No students registered for this course</p>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.reg_no}>
                <td>{s.reg_no}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.mobile_no}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default AdminStudentList;