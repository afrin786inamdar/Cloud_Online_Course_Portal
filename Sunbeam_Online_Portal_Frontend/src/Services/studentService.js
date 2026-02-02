// Importing
import axios from "axios";
import Config from "./Config";

// 1. Student - Get My Courses (Student)
export async function getMyCourses(token) {
  const URL = Config.BASE_URL + "/students";

  const response = await axios.get(URL, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

// 2. Admin - Get Student List
export async function getStudentList(token) {
  const URL = Config.BASE_URL + "/admin/students";

  const response = await axios.get(URL, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

// 3. Admin - Update Student
export async function updateStudent(studentId, studentData, token) {
  const URL = Config.BASE_URL + "/students" + studentId;

  const response = await axios.put(URL, studentData, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

// 4. Admin - Delete Student
export async function deleteStudent(studentId, token) {
  const URL = Config.BASE_URL + "/admin/students" + studentId;

  const response = await axios.delete(URL, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

export async function changeStudentPassword(oldPassword, newPassword, token) {

  const URL = Config.BASE_URL + "/students/change-password";

  const response = await axios.put(
    URL,
    { oldPassword, newPassword },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );

  return response.data;
}
