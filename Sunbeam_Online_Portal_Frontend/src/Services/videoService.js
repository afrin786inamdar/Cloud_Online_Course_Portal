// Importing
import axios from "axios";
import Config from "./Config";

export async function getCoursesWithVideos() {
  const response = await axios.get(
    Config.BASE_URL + "/videos/public/courses-with-videos"
  );
  return response.data;
}
// 1. Get Videos by Course (Student/Admin)
export async function getVideosByCourse(courseId, token) {
  const URL = Config.BASE_URL + "/videos?courseId=" + courseId;

  const response = await axios.get(URL, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

// 2. Add Video (Admin)
export async function addVideo(videoData, token) {
  const URL = Config.BASE_URL + "/admin/videos";

  const response = await axios.post(URL, videoData, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

// 3. Update Video (Admin)
export async function updateVideo(videoId, videoData, token) {
  const URL = Config.BASE_URL + "/admin/videos/" + videoId;

  const response = await axios.put(URL, videoData, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}

// 4. Delete Video (Admin)
export async function deleteVideo(videoId, token) {
  const URL = Config.BASE_URL + "/admin/videos/" + videoId;

  const response = await axios.delete(URL, {
    headers: { Authorization: "Bearer " + token },
  });

  return response.data;
}
