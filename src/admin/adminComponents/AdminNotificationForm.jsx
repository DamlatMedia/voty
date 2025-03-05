

import React, { useState } from "react";
import axios from "axios";

function PostUserNotification() {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [update, setUpdate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/notification`,
        { username, title, update, description }
      );
      alert("Notification sent successfully!");
      setUsername("");
      setTitle("");
      setUpdate("");
      setDescription("");
    } catch (error) {
      console.error("Error posting notification:", error);
      alert("Failed to send notification.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Update:</label>
        <input
          type="text"
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send Notification</button>
    </form>
  );
}

export default PostUserNotification;
