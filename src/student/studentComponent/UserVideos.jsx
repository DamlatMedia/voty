// import style from "../studentStyles/dashboard.module.css";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import TriviaQuiz from "../studentComponent/TriviaComponent";
// import { useNavigate } from "react-router-dom";

// function UserVideos() {
//   const [videos, setVideos] = useState([]);
//   const [message, setMessage] = useState("");
//   const [selectedVideo, setSelectedVideo] = useState(null);

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

//   const markAsWatched = async (videoId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       console.log(token);
//       if (!token) {
//         setMessage("Authentication required.");
//         return;
//       }

//       const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//       await axios.put(`${API_BASE_URL}/api/videos/${videoId}/watch`, null, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setVideos((prevVideos) =>
//         prevVideos.map((video) =>
//           video._id === videoId ? { ...video, watched: true } : video
//         )
//       );

//       setMessage("Video marked as watched.");
//     } catch (error) {
//       console.error("Error marking video as watched:", error);
//       setMessage("Failed to update watch status.");
//     }
//   };

//   return (
//     <>
//       <div className={style.all}>
//         {/* <h2>Recently Watched</h2>

//         <div className={style.video}>
//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>
//         </div> */}

//         <div className={style.filter}>
//           <div className={style.allCourse}>
//             <p className={style.filter1}>All</p>
//             <select name="" id="" className={style.filter2}>
//               <option value="">Course</option>
//               <option value="">Course</option>
//               <option value="">Course</option>
//             </select>
//           </div>

//           <img src="/images/filter.png" alt="games" className={style.filter3} />
//         </div>

//         {/* <h2>New Videos</h2> */}
//         <h2>Videos</h2>
//         {message && <p>{message}</p>}
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
//                 <button
//                   className={style.mark}
//                   onClick={() => markAsWatched(video._id)}
//                 >
//                   Mark as Watched
//                 </button>

//                 <button
//                   className={style.mark1}
//                   onClick={() => setSelectedVideo(video.title)}
//                 >
//                   Show Trivia
//                   <span className="material-symbols-outlined">
//                     monitoring
//                   </span>{" "}
//                 </button>
//               </div>
//               {selectedVideo === video.title && (
//                 <TriviaQuiz videoTitle={video.title} />
//               )}
//             </div>
//           ))}

//           {/* <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div> */}
//         </div>

//         {/* <div className={style.video}>
//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>
//         </div>

//         <div className={style.video}>
//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>
//         </div>

//         <div className={style.video}>
//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>

//           <div className={style.feature}>
//             <img
//               src="/images/vidStu.png"
//               alt="video"
//               className={style.vidImage}
//             />
//             <p className={style.phTag}>Video Title</p>
//             <p>
//               Separated they live in Bookmarks grove right at the coast of the
//               Semantic, a large language ocean. A small river name..
//             </p>
//           </div>
//         </div> */}
//       </div>
//     </>
//   );
// }

// export default UserVideos;

import style from "../studentStyles/dashboard.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserVideos() {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  // Navigate to the trivia page with the video details
  const handleShowTrivia = (video) => {
    navigate("/student/trivia", { state: { video } });
  };
  
  return (
    <div className={style.all}>
      {/* <div className={style.filter}>
        <div className={style.allCourse}>
          <p className={style.filter1}>All</p>
          <select name="" id="" className={style.filter2}>
            <option value="">Course</option>
            <option value="">Course</option>
            <option value="">Course</option>
          </select>
        </div>
        <img src="/images/filter.png" alt="games" className={style.filter3} />
      </div> */}

      <h2>All Videos</h2>
      {message && <p>{message}</p>}
      <div className={style.video}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        {videos.map((video) => (
          <div className={style.feature} key={video._id}>
            <video className={style.vidImage} controls>
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className={style.phTag}>{video.title}</p>
            <p>{video.description}</p>

            <div className={style.markBtn}>
              <button
                className={style.mark}
                onClick={() => markAsWatched(video._id)}
              >
                Mark as Watched
              </button>

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
        ))}
      </div>
    </div>
  );
}

export default UserVideos;
