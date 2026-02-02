import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Config from "../../Services/Config";

function StudentVideos() {
    const { courseId } = useParams();
    const [videos, setVideos] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try {
            const res = await axios.get(
                `${Config.BASE_URL}/videos/course/${courseId}`, // ✅ FIXED URL
                {
                    headers: {
                        Authorization: "Bearer " + user.token // ✅ FIXED TOKEN
                    }
                }
            );

            if (res.data.status === "success") {
                setVideos(res.data.data);
            } else {
                alert(res.data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Unable to load videos");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Course Videos</h3>

            {videos.length === 0 && <p>No videos available</p>}

            {videos.map(v => (
                <div key={v.video_id} className="card mb-3 p-3">
                    <h5>{v.title}</h5>
                    <p>{v.description}</p>

                    <iframe
                        width="100%"
                        height="315"
                        src={v.youtube_url}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                </div>
            ))}
        </div>
    );
}

export default StudentVideos;
