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
