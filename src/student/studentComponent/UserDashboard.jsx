import style from "../studentStyles/dashboard.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import TriviaQuiz from "./UserQuiz";
import { NavLink } from "react-router-dom";

function UserDashboard() {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ageCategory = localStorage.getItem("ageCategory");
  const navigate = useNavigate();
  const [ageCategorys, setAgeCategory] = useState("11-20");
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await axios.get(
          `${API_BASE_URL}/api/leaderboard?ageCategory=${encodeURIComponent(
            ageCategorys
          )}`
        );
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [ageCategorys]);

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

  const handleShowVideo = (video) => {
    navigate("/student/videos", { state: { video } });
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${API_BASE_URL}/api/videos`);
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setMessage("Failed to load videos.");
      }
    };

    fetchVideos();
  }, []);

  const markAsWatched = async (videoId) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log(token);
      if (!token) {
        setMessage("Authentication required.");
        return;
      }

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      await axios.put(`${API_BASE_URL}/api/videos/${videoId}/watch`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId ? { ...video, watched: true } : video
        )
      );

      setMessage("Video marked as watched.");
    } catch (error) {
      console.error("Error marking video as watched:", error);
      setMessage("Failed to update watch status.");
    }
  };

  return (
    <>
      <div className={style.all}>
        <div className={style.top}>
          {videoData.slice(0, 1).map((video) => (
            <div className={style.resume}>
              <div className={style.namResume}>
                <div className={style.syste}>
                  <img src="/images/money.png" alt="money" />
                  <div className={style.syst}>
                    <p className={style.black}>{video.title}</p>
                    <p className={style.grey}>{video.description}</p>
                  </div>
                </div>
                <div className={style.videos}>
                  <button
                    className={style.watch}
                    onClick={() => handleShowVideo(video)}
                  >
                    Watch Video
                  </button>
                </div>
              </div>

              <div className={style.numResume}>
                <div className={style.econ}>
                  <p className={style.grey}>Course</p>
                  <p className={style.black}>{video.title}</p>
                </div>

                <div className={style.progress}>
                  <img src="" alt="" />
                  <p>{video.triviaCount} Questions</p>
                </div>
              </div>
            </div>
          ))}

          <div className={style.leaders}>
            {leaderboard.slice(0, 3).map((student, index) => (
              <div className={style.leader} key={student._id}>
                <div className={style.profileName}>
                  <img src="/images/profile.png" alt="profile" />

                  <div className={style.name}>
                    <p>{student.username}</p>
                    <p>{student.score} points</p>
                  </div>
                </div>

                <h4>{index + 1}</h4>
              </div>
            ))}
            <hr className={style.hr} />
          </div>
        </div>

        {/* <div className={style.leader}>
              <div className={style.profileName}>
                <img src="/images/profile.png" alt="profile" />

                <div className={style.name}>
                  <p>Chukwuemeka Miracle</p>
                  <p>33 points</p>
                </div>
              </div>

              <h4>2</h4>
            </div> */}

        {/* <hr className={style.hr} /> */}

        {/* <div className={style.leader}>
              <div className={style.profileName}>
                <img src="/images/profile.png" alt="profile" />

                <div className={style.name}>
                  <p>Chukwuemeka Miracle</p>
                  <p>33 points</p>
                </div>
              </div>

              <h4>33</h4>
            </div> */}

        {/* <div className={style.video}>
        <div className={style.feature}>
          <img
            src="/images/vidStu.png"
            alt="video"
            className={style.vidImage}
          />
          <p className={style.phTag}>Video Title</p>
          <p>
            Separated they live in Bookmarks grove right at the coast of the
            Semantic, a large language ocean. A small river name..
          </p>
        </div>

        <div className={style.feature}>
          <img
            src="/images/vidStu.png"
            alt="video"
            className={style.vidImage}
          />
          <p className={style.phTag}>Video Title</p>
          <p>
            Separated they live in Bookmarks grove right at the coast of the
            Semantic, a large language ocean. A small river name..
          </p>
        </div>

        <div className={style.feature}>
          <img
            src="/images/vidStu.png"
            alt="video"
            className={style.vidImage}
          />
          <p className={style.phTag}>Video Title</p>
          <p>
            Separated they live in Bookmarks grove right at the coast of the
            Semantic, a large language ocean. A small river name..
          </p>
        </div>
      </div> */}

        <div className={style.video}>
          {videos.slice(0, 2).map((video) => (
            <div className={style.feature} key={video._id}>
              <video className={style.vidImage} controls>
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className={style.phTag}>{video.title}</p>
              <p>{video.description}</p>

              <div className={style.markBtn}>
                {/* <button
                  className={style.mark}
                  onClick={() => markAsWatched(video._id)}
                >
                  Mark as Watched
                </button> */}

                <button className={style.mark3}>
                  {" "}
                  <NavLink to="/student/videos" className={style.mark2}>
                    {" "}
                    Show More
                  </NavLink>
                </button>
              </div>

              {selectedVideo === video.title && (
                <TriviaQuiz videoTitle={video.title} />
              )}
            </div>
          ))}
        </div>

        {/* <div className={style.triva}>
          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>
        </div> */}

        <div className={style.advertProgress}>
          <img src="/images/advert.png" alt="advert" className={style.advert1} />
        </div>
        {/* <div className={style.advertProgress}>
          <img src="/images/advert.png" alt="advert" className={style.advert} />

          <div className={style.progressBar}>
            <div className={style.progressName}>
              <p>Progress Bar</p>
              <select name="" id="" className={style.progressDate}>
                <option value="">This Week</option>
                <option value="">This Week</option>
                <option value="">This Week</option>
                <option value="">This Week</option>
              </select>
            </div>
            <img
              src="/images/progressStat.png"
              alt="progress"
              className={style.progressStat}
            />
          </div>
        </div> */}
      </div>
    </>
  );
}

export default UserDashboard;
