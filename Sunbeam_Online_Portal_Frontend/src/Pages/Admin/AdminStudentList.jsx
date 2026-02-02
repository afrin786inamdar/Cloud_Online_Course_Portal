import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Config from "../../Services/Config";
import { Table } from "react-bootstrap";

function AdminStudentList() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);

  const admin = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/admin/students/${courseId}`,
        {
          headers: {
            Authorization: "Bearer " + admin.token
          }
        }
      );

      if (res.data.status === "success") {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load students");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-info mb-3">Registered Students</h3>

      {students.length === 0 ? (
        <p>No students enrolled</p>
      ) : (
        <Table bordered hover>
          <thead className="table-info">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
             <tr key={s.reg_no}>

                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.mobile_no}</td>

              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default AdminStudentList;
