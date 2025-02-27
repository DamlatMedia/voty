// import React from "react";
// import TriviaComponent from "./TriviaComponent";
// import TriviaForm from "./TriviaForm";

// const VideoItem = ({ video }) => {
//   return (
//     <div>
//       <h3>{video.title}</h3>
//       <p>{video.description}</p>
//       <video src={video.videoUrl} controls width="400" />

//       {/* Trivia Form (Only for Admins or Users Allowed to Post Trivia) */}
//       <TriviaForm videoId={video._id} />

//       {/* Trivia Questions */}
//       <TriviaComponent videoId={video._id} />
//     </div>
//   );
// };

// export default VideoItem;


import React, { useEffect } from "react";
import TriviaComponent from "./TriviaComponent";
import TriviaForm from "./TriviaForm";
import { useVideo } from "../components/VideoContext";

const VideoItem = ({ video }) => {
  const { fetchTrivia, trivia } = useVideo();
  const userType = localStorage.getItem("userType"); // 'admin' or 'student'

  useEffect(() => {
    fetchTrivia(video._id);
  }, [video._id]);

  return (
    <div>
      <h3>{video.title}</h3>
      <p>{video.description}</p>
      <video src={video.videoUrl} controls width="400" />

      {/* Only show TriviaForm to Admins */}
      {userType === "admin" && <TriviaForm videoId={video._id} />}

      {/* Trivia Questions */}
      {trivia ? <TriviaComponent videoId={video._id} /> : <p>Loading trivia...</p>}
    </div>
  );
};

export default VideoItem;
