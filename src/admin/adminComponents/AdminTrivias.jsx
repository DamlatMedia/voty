// import style from "../../student/studentStyles/dashboard.module.css";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import AdminTrivia from "./TriviaForm";

// function AdminTrivia() {
//   const [videoData, setVideoData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const ageCategory = localStorage.getItem("ageCategory");
//   const navigate = useNavigate();

//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     // Fetch all videos first.
//     const fetchVideosWithTriviaCount = async () => {
//       try {
//         const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//         const videosRes = await axios.get(`${API_BASE_URL}/api/videos`);
//         const videos = videosRes.data;

//         // For each video, fetch trivia for the student's age category.
//         // We'll use Promise.all to make parallel requests.
//         const videosWithTrivia = await Promise.all(
//           videos.map(async (video) => {
//             try {
//               const triviaRes = await axios.get(
//                 `${API_BASE_URL}/api/trivia/video/${encodeURIComponent(
//                   video.title
//                 )}/${encodeURIComponent(ageCategory)}`
//               );
//               // Count how many trivia questions exist for this video.
//               const triviaCount = Array.isArray(triviaRes.data)
//                 ? triviaRes.data.length
//                 : 0;
//               return { ...video, triviaCount };
//             } catch (err) {
//               console.error(
//                 `Error fetching trivia for video ${video.title}:`,
//                 err
//               );
//               return { ...video, triviaCount: 0 };
//             }
//           })
//         );
//         setVideoData(videosWithTrivia);
//       } catch (err) {
//         console.error("Error fetching videos:", err);
//         setError("Failed to load videos.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideosWithTriviaCount();
//   }, [ageCategory]);

//   const handleVideoClick = (video) => {
//     // Navigate to the dedicated trivia quiz page.
//     // Pass the video details in location.state so that the next page can display video title, description, etc.
//     navigate("/admin/trivia/page", { state: { video } });
//   };

//   if (loading) return <p>Loading videos...</p>;
//   if (error) return <p>{error}</p>;
//   return (
//     <>
//       <div className={style.all}>
//         <div className={`${style.content} ${showForm ? style.blur : ""}`}>
//           <div className={style.allInvest}>
//             <h2>Trivia Games</h2>
//             <button
//               className={style.newInvest}
//               onClick={() => setShowForm(true)}
//             >
//               Add New Trivia
//             </button>
//           </div>

//           <div className={style.stu}>
//             <p className={style.act}>10 - 15</p>
//             <p className={style.act}>16 - 20</p>
//           </div>

//           <div
//             className={style.video}
//             style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
//           >
//             {videoData.map((video) => (
//               <div className={style.featured} key={video._id}>
//                 <div className={style.course}>
//                   <div>
//                     <img src="/images/money.png" alt="games" />
//                   </div>

//                   <div className={style.png}>
//                     <p>Course</p>
//                     <p className={style.phTag}>{video.title}</p>
//                     <p>{video.description}</p>
//                   </div>
//                 </div>

//                 <div className={style.leftPro}>
//                   <div className={style.rightPro}>
//                     <img src="/images/progress.png" alt="progres" />
//                     <p>
//                       {" "}
//                       <strong>{video.triviaCount}</strong> Questions{" "}
//                     </p>
//                   </div>

//                   <button
//                     className={style.mark1}
//                     onClick={() => handleVideoClick(video)}
//                   >
//                     Take Quiz
//                     <span className="material-symbols-outlined">
//                       monitoring
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {showForm && (
//           <div className={style.modal}>
//             <div className={style.modalContent}>
//               <button
//                 className={style.closeBtn}
//                 onClick={() => setShowForm(false)}
//               >
//                 ✖
//               </button>
//               <AdminTrivia />
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default AdminTrivia;

import style from "../../student/studentStyles/dashboard.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminTriviaForm from "./TriviaForm";

function AdminTrivia() {
  const [videoData, setVideoData] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ageCategory = localStorage.getItem("ageCategory");
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchVideosWithTriviaCount = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const videosRes = await axios.get(`${API_BASE_URL}/api/videos`);
        const videos = videosRes.data;

        const videosWithTrivia = await Promise.all(
          videos.map(async (video) => {
            try {
              const triviaRes = await axios.get(
                `${API_BASE_URL}/api/trivia/video/${encodeURIComponent(
                  video.title
                )}/${encodeURIComponent(ageCategory)}`
              );
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
        setFilteredVideos(videosWithTrivia);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideosWithTriviaCount();
  }, [ageCategory]);

  // 🛠 Function to filter by age category
  const handleFilterByAge = (age) => {
    setSelectedAgeCategory(age);
    if (age) {
      setFilteredVideos(videoData.filter((video) => video.ageCategory === age));
    } else {
      setFilteredVideos(videoData);
    }
  };

  const handleVideoClick = (video) => {
    navigate("/admin/trivia/page", { state: { video } });
  };

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className={style.all}>
        <div className={`${style.content} ${showForm ? style.blur : ""}`}>
          <div className={style.allInvest}>
            <h2>Trivia Games</h2>
            <button
              className={style.newInvest}
              onClick={() => setShowForm(true)}
            >
              Add New Trivia
            </button>
          </div>

          {/* 🛠 Age Filtering Buttons */}
          {/* <div className={style.stu}>
            <p
              className={`${style.act} ${
                selectedAgeCategory === "10 - 15" ? style.active : ""
              }`}
              onClick={() => handleFilterByAge("10 - 15")}
            >
              10 - 15
            </p>
            <p
              className={`${style.act} ${
                selectedAgeCategory === "16 - 20" ? style.active : ""
              }`}
              onClick={() => handleFilterByAge("16 - 20")}
            >
              16 - 20
            </p>
          </div> */}

          {/* 🛠 Display Filtered Videos */}
          <div
            className={style.video}
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
          >
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div className={style.featured} key={video._id}>
                  <div className={style.courser}>
                    <div>
                      <img src="/images/money.png" alt="games" />
                    </div>

                    <div className={style.pngc}>
                      <p>Course</p>
                      <p className={style.phTag}>{video.title}</p>
                      <p>{video.description}</p>
                    </div>
                  </div>

                  <div className={style.leftPro}>
                    <div className={style.rightPro}>
                      <img src="/images/progress.png" alt="progres" />
                      <p>
                        <strong>{video.triviaCount}</strong> Questions
                      </p>
                    </div>

                    <button
                      className={style.mark1}
                      onClick={() => handleVideoClick(video)}
                    >
                      Take Quiz
                      <span className="material-symbols-outlined">
                        monitoring
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No trivias found for this age category.</p>
            )}
          </div>
        </div>

        {showForm && (
          <div className={style.modal}>
            <div className={style.modalContent}>
              <button
                className={style.closeBtn}
                onClick={() => setShowForm(false)}
              >
                ✖
              </button>
              <AdminTriviaForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminTrivia;
