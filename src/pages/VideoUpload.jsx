// import { useVideo } from "../components/VideoContext";

import React, { useState } from "react";
import axios from "axios";
import { useVideo } from "../components/VideoContext"; // Import useVideo hook

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const { setVideos } = useVideo(); // Get setVideos from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || file.size === 0) {
      setMessage("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    console.log("FormData content:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Should log 'video', 'title', and 'description'
    }

    try {
      const token = localStorage.getItem("adminAuthToken");
      console.log("Token being sent:", token);

      if (!token) {
        setMessage("Authentication required.");
        return;
      }

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${API_BASE_URL}/api/videos/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Save video title in context and localStorage
      setVideos(title);
      localStorage.setItem("videoTitle", title);

      setMessage("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setMessage("Failed to upload video.");
    }
  };

  return (
    <div>
      <h3>Upload Video</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          name="video"
          // value={video}
          accept="video/*"
          // onChange={(e) => setFile(e.target.files[0])}
          onChange={(e) => {
            console.log("Selected file:", e.target.files[0]); // Debugging
            setFile(e.target.files[0]);
          }}
          required
        />

        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadVideo;
