// import React, { useEffect, useState } from "react";
// import axios from "axios";


// const VideoList = () => {
//   const [videos, setVideos] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/api/videos");
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

//       await axios.put(
//         `http://localhost:7000/api/videos/${videoId}/watch`,
//         null,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

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
//     <div>
//       <h3>Available Videos</h3>
//       {message && <p>{message}</p>}
//       <ul>
//         {videos.map((video) => (
//           <li key={video._id}>
//             <h4>{video.title}</h4>
//             <p>{video.description}</p>
//             <video width="320" height="240" controls>
//               <source src={video.videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <button onClick={() => markAsWatched(video._id)}>
//               Mark as Watched
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default VideoList;


import React, { useEffect, useState } from "react";
import axios from "axios";
import TriviaQuiz from "./TriviaComponent"; 

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null); 

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/videos");
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

      await axios.put(
        `http://localhost:7000/api/videos/${videoId}/watch`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    <div>
      <h3>Available Videos</h3>
      {message && <p>{message}</p>}
      <ul>
        {videos.map((video) => (
          <li key={video._id}>
            <h4>{video.title}</h4>
            <p>{video.description}</p>
            <video width="320" height="240" controls>
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button onClick={() => markAsWatched(video._id)}>
              Mark as Watched
            </button>
            <button onClick={() => setSelectedVideo(video.title)}>
              Show Trivia
            </button>


            {/* Render TriviaQuiz when a video is selected */}
            {selectedVideo === video.title && <TriviaQuiz videoTitle={video.title} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
