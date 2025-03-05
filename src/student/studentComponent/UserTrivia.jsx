// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import TriviaQuiz from "../studentComponent/TriviaComponent"; // Your existing trivia quiz component
// import axios from "axios";

// const StudentTriviaPage = () => {
//   const location = useLocation();
//   const { video } = location.state || {}; // Expect video details from navigation state
//   const [triviaCount, setTriviaCount] = useState(0);

//   useEffect(() => {
//     if (video && video.title) {
//       // Optionally, fetch the count of trivia questions for this video and age category.
//       // For example, assume your backend endpoint can return a count:
//       const fetchTriviaCount = async () => {
//         try {
//           const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//           // This assumes you have an endpoint like /api/trivia/count?videoTitle=...&ageCategory=...
//           const ageCategory = localStorage.getItem("ageCategory");
//           const { data } = await axios.get(
//             `${API_BASE_URL}/api/trivia/count?videoTitle=${encodeURIComponent(
//               video.title
//             )}&ageCategory=${encodeURIComponent(ageCategory)}`
//           );
//           setTriviaCount(data.count);
//         } catch (error) {
//           console.error("Error fetching trivia count:", error);
//         }
//       };
//       fetchTriviaCount();
//     }
//   }, [video]);

//   if (!video) return <p>No video details found.</p>;

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h1>{video.title}</h1>
//       <p>{video.description}</p>
//       <p>Number of Trivia Questions: {triviaCount > 0 ? triviaCount : "N/A"}</p>
//       <TriviaQuiz videoTitle={video.title} />
//     </div>
//   );
// };

// export default StudentTriviaPage;

// StudentTriviaPage.jsx

// StudentTriviaList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "../studentStyles/dashboard.module.css"; // your style file

const StudentTriviaList = () => {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ageCategory = localStorage.getItem("ageCategory");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all videos first.
    const fetchVideosWithTriviaCount = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const videosRes = await axios.get(`${API_BASE_URL}/api/videos`);
        const videos = videosRes.data;

        // For each video, fetch trivia for the student's age category.
        // We'll use Promise.all to make parallel requests.
        const videosWithTrivia = await Promise.all(
          videos.map(async (video) => {
            try {
              const triviaRes = await axios.get(
                `${API_BASE_URL}/api/trivia/video/${encodeURIComponent(
                  video.title
                )}/${encodeURIComponent(ageCategory)}`
              );
              // Count how many trivia questions exist for this video.
              const triviaCount = Array.isArray(triviaRes.data)
                ? triviaRes.data.length
                : 0;
              return { ...video, triviaCount };
            } catch (err) {
              console.error(
                `Error fetching trivia for video ${video.title}:`,
                err
              );
              return { ...video, triviaCount: 0 };
            }
          })
        );
        setVideoData(videosWithTrivia);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideosWithTriviaCount();
  }, [ageCategory]);

  const handleVideoClick = (video) => {
    // Navigate to the dedicated trivia quiz page.
    // Pass the video details in location.state so that the next page can display video title, description, etc.
    navigate("/student/trivia/page", { state: { video } });
  };

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={style.all}>
      <h2>Available Videos with Trivia</h2>
      {/* <div
        className={style.video}
        style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
      >
        {videoData.map((video) => (
          <div
            key={video._id}
            className={style.feature}
            style={{ width: "45%" }}
          >
            {/* <video className={style.vidImage} controls>
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video> 
            <p className={style.phTag}>{video.title}</p>
            <p>{video.description}</p>
            <p>
              Trivia Questions: <strong>{video.triviaCount}</strong>
            </p>
            <button
              className={style.mark1}
              onClick={() => handleVideoClick(video)}
            >
              Take Quiz
              <span className="material-symbols-outlined">monitoring</span>
            </button>
          </div>
        ))}
      </div> */}

      <div
        className={style.video}
        style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
      >
        {videoData.map((video) => (
          <div className={style.featured} key={video._id}>
            <div className={style.course}>
              <div>
                <img src="/images/money.png" alt="games" />
              </div>

              <div className={style.png}>
                <p>Course</p>
                <p className={style.phTag}>{video.title}</p>
                <p>{video.description}</p>
              </div>
            </div>

            <div className={style.leftPro}>
              <div className={style.rightPro}>
                <img src="/images/progress.png" alt="progres" />
                <p>
                  {" "}
                  <strong>{video.triviaCount}</strong> Questions{" "}
                </p>
              </div>

              <button
                className={style.mark1}
                onClick={() => handleVideoClick(video)}
              >
                Take Quiz
                <span className="material-symbols-outlined">monitoring</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTriviaList;
