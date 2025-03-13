// import style from "../adminStyles/dashboard.module.css";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import UploadVideo from "./VideoUpload";
// function AdminVideos() {
//   const [showForm, setShowForm] = useState(false);
//   const [videos, setVideos] = useState([]);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//         const response = await axios.get(`${API_BASE_URL}/api/videos`);
//         setVideos(response.data);
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//         setMessage("Failed to load videos.");
//       }
//     };

//     fetchVideos();
//   }, []);

//   // const markAsWatched = async (videoId) => {
//   //   try {
//   //     const token = localStorage.getItem("authToken");
//   //     if (!token) {
//   //       setMessage("Authentication required.");
//   //       return;
//   //     }
//   //     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//   //     await axios.put(`${API_BASE_URL}/api/videos/${videoId}/watch`, null, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     });
//   //     setVideos((prevVideos) =>
//   //       prevVideos.map((video) =>
//   //         video._id === videoId ? { ...video, watched: true } : video
//   //       )
//   //     );
//   //     setMessage("Video marked as watched.");
//   //   } catch (error) {
//   //     console.error("Error marking video as watched:", error);
//   //     setMessage("Failed to update watch status.");
//   //   }
//   // };

//   // Navigate to the trivia page with the video details

//   const handleShowTrivia = (video) => {
//     navigate("/admin/trivia", { state: { video } });
//   };

//   return (
//     <>
//       <div className={style.all}>
//         <div className={style.filt}>

//         <div className={`${style.content} ${showForm ? style.blur : ""}`}>
//           <div className={style.allInvest}>
//           <h2>Moral Video</h2>
//           <button className={style.newInvest} onClick={() => setShowForm(true)}>
//             Add New Videos
//           </button>
//         </div>

//           <div className={style.stu}>
//             <p className={style.act}>5 - 10</p>
//             <p className={style.act}>11 - 20</p>
//           </div>
//         </div>

//         <div className={style.video}>
//           {videos.map((video) => (
//             <div className={style.feature} key={video._id}>
//               <video className={style.vidImage} controls>
//                 <source src={video.videoUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <p className={style.phTag}>{video.title}</p>
//               <p>{video.description}</p>

//               <div className={style.markBtn}>
//                 {/* <button
//                 className={style.mark}
//                 onClick={() => markAsWatched(video._id)}
//               >
//                 Mark as Watched
//               </button> */}

//                 <button
//                   className={style.mark1}
//                   onClick={() => handleShowTrivia(video)}
//                 >
//                   Show Trivia
//                   <span className="material-symbols-outlined">monitoring</span>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {showForm && (
//         <div className={style.modal}>
//           <div className={style.modalContent}>
//             <button className={style.closeBtn} onClick={() => setShowForm(false)}>
//               ✖
//             </button>
//             <UploadVideo/>
//           </div>
//         </div>
//       )}
//       </div>
//     </>
//   );
// }

// export default AdminVideos;

import style from "../adminStyles/dashboard.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UploadVideo from "./VideoUpload";

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
        <div className={style.filt}>
          <div className={`${style.content} ${showForm ? style.blur : ""}`}>
            <div className={style.allInvest}>
              <h2>Moral Video</h2>
              <button
                className={style.newInvest}
                onClick={() => setShowForm(true)}
              >
                Add New Videos
              </button>
            </div>

            {/* Age ageCategory Filters */}
            <div className={style.stu}>
              <p
                className={`${style.act} ${
                  selectedAgeCategory === "5 - 10" ? style.active : ""
                }`}
                onClick={() => handleFilterByAge("5 - 10")}
              >
                5 - 10
              </p>
              <p
                className={`${style.act} ${
                  selectedAgeCategory === "11 - 20" ? style.active : ""
                }`}
                onClick={() => handleFilterByAge("11 - 20")}
              >
                11 - 20
              </p>
            </div>
          </div>

          {/* Video List */}
          <div className={style.video}>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div className={style.feature} key={video._id}>
                  <video className={style.vidImage} controls>
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p className={style.phTag}>{video.title}</p>
                  <p>{video.description}</p>

                  <div className={style.markBtn}>
                    <button
                      className={style.mark1}
                      onClick={() => handleShowTrivia(video)}
                    >
                      Show Trivia
                      <span className="material-symbols-outlined">
                        monitoring
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No videos found for this age category.</p>
            )}
          </div>
        </div>

        {/* Video Upload Modal */}
        {showForm && (
          <div className={style.modal}>
            <div className={style.modalContent}>
              <button
                className={style.closeBtn}
                onClick={() => setShowForm(false)}
              >
                ✖
              </button>
              <UploadVideo />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminVideos;
