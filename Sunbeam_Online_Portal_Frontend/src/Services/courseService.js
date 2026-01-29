// Importing
import axios from "axios";
import Config from "./Config";

// 1. Get Active Courses (Public)
export async function getActiveCourses() {
  const URL = Config.BASE_URL + "/courses/active";

  const response = await axios.get(URL);
  return response.data;
}

// 2. Get All Courses (if you have endpoint)
export async function getAllCourses() {
  const URL = Config.BASE_URL + "/courses";

  const response = await axios.get(URL);
  return response.data;
}

// 3. Add Course (Admin)
export async function addCourse(courseData, token) {
  const URL = Config.BASE_URL + "/admin/courses";

  const response = await axios.post(URL, courseData, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

// 4. Update Course (Admin)
export async function updateCourse(courseId, courseData, token) {
  const URL = Config.BASE_URL + "/admin/courses/" + courseId;

  const response = await axios.put(URL, courseData, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

// 5. Delete Course (Admin)
// NOTE: ON DELETE CASCADE will delete related videos automatically
export async function deleteCourse(courseId, token) {
  const URL = Config.BASE_URL + "/admin/courses/" + courseId;

  const response = await axios.delete(URL, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}
