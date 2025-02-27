// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const VideoContext = createContext();

// export const VideoProvider = ({ children }) => {
//   const [videos, setVideos] =  useState(() => {
//     // Check if the username is saved in localStorage
//     const videoTitle = localStorage.getItem("videoTitle");
//     return videoTitle || "";
//   });

//    useEffect(() => {
//     if (videos) {
//       localStorage.setItem("videoTitle", videos);  // Save username to localStorage
//     }
//   }, [videos]);

//   const submitTriviaAnswer = async (videoId, answer) => {
//     try {
//       const token = localStorage.getItem("authToken"); // User token
//       if (!token) {
//         throw new Error("User authentication token is missing");
//       }

//       const response = await axios.post(
//         `http://localhost:7000/api/trivia/${videoId}/answer`,
//         { answer },
//         {
//           headers: { Authorization: `Bearer ${token}` }, // Send user token
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error("Error submitting answer:", error);
//       return { message: "Submission failed" };
//     }
//   };

//   return (
//     <VideoContext.Provider value={{ videos, setVideos }}>
//       {children}
//     </VideoContext.Provider>

    
//   );
// };


import React, { createContext, useContext, useState, useEffect } from "react";

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState(() => {
    return localStorage.getItem("videoTitle") || "";
  });

  useEffect(() => {
    if (videos) {
      localStorage.setItem("videoTitle", videos);
    }
  }, [videos]);

  return (
    <VideoContext.Provider value={{ videos, setVideos }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);
