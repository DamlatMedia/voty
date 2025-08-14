import style from "../adminStyles/dashboard.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminVideos() {
  const [showForm, setShowForm] = useState(false);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState(null); // Default: No filter
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${API_BASE_URL}/api/videos`);
        setVideos(response.data);
        setFilteredVideos(response.data); // Initially, show all videos
      } catch (error) {
        console.error("Error fetching videos:", error);
        setMessage("Failed to load videos.");
      }
    };

    fetchVideos();
  }, []);

  // Function to handle filtering by age ageCategory
  const handleFilterByAge = (ageCategory) => {
    setSelectedAgeCategory(ageCategory);
    if (ageCategory === "5 - 10") {
      setFilteredVideos(
        videos.filter((video) => video.ageageCategory === "5 - 10")
      );
    } else if (ageCategory === "11 - 20") {
      setFilteredVideos(
        videos.filter((video) => video.ageageCategory === "11 - 20")
      );
    } else {
      setFilteredVideos(videos); // Show all videos if no ageCategory is selected
    }
  };

  // Navigate to the trivia page with the video details
  const handleShowTrivia = (video) => {
    navigate("/admin/trivia", { state: { video } });
  };

  return (
    <>
      <div className={style.all}> 
        <h2>Popular Videos</h2>

        <div className={style.video}>
     {  filteredVideos.slice(0, 2).map((video) => (
                <div className={style.feature} key={video._id}>
                  <video className={style.vidImage} controls>
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p className={style.phTag}>{video.title}</p>
                  <p>{video.description}</p>

                  {/* <div className={style.markBtn}>
                    <button
                      className={style.mark1}
                      onClick={() => handleShowTrivia(video)}
                    >
                      Show Trivia
                      <span className="material-symbols-outlined">
                        monitoring
                      </span>
                    </button>
                  </div> */}
                </div>
              ))}
        </div>
      </div>
    </>
  );
}

export default AdminVideos;
