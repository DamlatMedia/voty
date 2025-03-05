import React, { useState } from "react";

const NotificationForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [update, setUpdate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const notificationData = {
      title,
      description,
      update,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/notification/all`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If using auth
          },
          body: JSON.stringify(notificationData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Notification sent to all users!");
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Update Type:</label>
        <input
          type="text"
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          required
        />
      </div>

      <button type="submit">Send Notification</button>
    </form>
  );
};

export default NotificationForm;
