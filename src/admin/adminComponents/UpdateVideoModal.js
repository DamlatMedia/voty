import React, { useState } from "react";
import style from "../adminStyles/dashboard.module.css";
import axios from "axios";

function UpdateVideoModal({ video, onClose, onUpdated }) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (videoFile) {
        formData.append("video", videoFile);
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/videos/${video._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onUpdated(response.data.video); // Notify parent
      onClose(); // Close modal
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <button className={style.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h3>Update Video</h3>
        <form onSubmit={handleSubmit} className={style.form}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Description</label>
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Replace Video (optional)</label>
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Video"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateVideoModal;
