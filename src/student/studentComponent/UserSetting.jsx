import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import style from "../studentStyles/dashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";

const UserSettings = () => {
  const { username, setUsername } = useContext(UserContext);
  const navigate = useNavigate();

  // Local state to hold fetched user data
  const [userData, setUserData] = useState(null);
  // Local state for editable fields
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let currentUsername = username || localStorage.getItem("username");
        if (!currentUsername) {
          toast.error("Username is not available. Redirecting to login...");
          navigate("/student/login");
          return;
        }
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          navigate("/student/login");
          return;
        }
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(
          // `${API_BASE_URL}/student/one-student?username=${currentUsername}`,
          `${API_BASE_URL}/student/one-student/${currentUsername}`,
          // `${API_BASE_URL}/student/one-student`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.data;
        setUserData(data);
        // Set editable fields from data
        setPhone(data.number || "");
        setAddress(data.address || "");
        setSchool(data.school || "");
        setGrade(data.grade || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, navigate]);

  // Handle profile picture file change
  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  // Handle saving changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      let currentUsername = username || localStorage.getItem("username");
      console.log("Current username:", currentUsername);

      const token = localStorage.getItem("authToken");

      console.log(" Token:", token);

      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      // Prepare payload for updating editable fields
      const updatePayload = {
        number: phone,
        address,
        school,
        grade,
      };

      // If a new profile picture is provided, create a FormData and upload it first.
      if (newProfilePic) {
        const formData = new FormData();
        formData.append("profilePicture", newProfilePic);
        // Call your endpoint for updating profile picture. Adjust the URL as needed.
        const picResponse = await axios.put(
          `${API_BASE_URL}/student/update-profile-picture/${currentUsername}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Assume the endpoint returns the new picture URL.
        updatePayload.profilePicture = picResponse.data.profilePicture;
      }

      // Now update the rest of the profile details.
      const response = await axios.patch(
        `${API_BASE_URL}/student/update-profile/${currentUsername}`,
        updatePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated successfully!");
      // Optionally update local state
      setUserData((prev) => ({ ...prev, ...response.data.updatedData }));
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      toast.error("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!userData) return <p>No user data found.</p>;

  return (
    <div className={style.all}>
      <ToastContainer />
      <h2>Settings</h2>
      <form onSubmit={handleSaveChanges}>
        {/* Profile Picture Section */}
        <div className={style.imageText}>
          <img
            src={
              newProfilePic
                ? URL.createObjectURL(newProfilePic)
                : userData.profilePicture || "/images/default-profile.jpg"
            }
            alt="Profile"
            className={style.person}
          />
          <div className={style.texts}>
            <label className={style.text1} htmlFor="profilePic">
              Upload New
            </label>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
            />
            <p className={style.text2}>Delete Avatar</p>
          </div>
        </div>

        {/* Non-editable fields */}
        <div className={style.labe}>
          <label className={style.lab}>Username</label>
          <input
            type="text"
            value={userData.username}
            readOnly
            className={style.input}
          />
        </div>

        <div className={style.labe}>
          <label className={style.lab}>Email</label>
          <input
            type="email"
            value={userData.email}
            readOnly
            className={style.input}
          />
        </div>

        <div className={style.labe}>
          <label className={style.lab}>Date of Birth</label>
          {/* <input
            type="date"
            value={new Date(userData.birth).toISOString().split("T")[0]}
            readOnly
            className={style.input}
          /> */}

          <input
            type="date"
            value={
              userData?.birth && !isNaN(new Date(userData.birth))
                ? new Date(userData.birth).toISOString().split("T")[0]
                : ""
            }
            readOnly
            className={style.input}
          />
        </div>

        <div className={style.labe}>
          <label className={style.lab}>Password</label>
          <input
            type="password"
            value="********" // Display masked password
            readOnly
            className={style.input}
          />
        </div>

        {/* Editable fields */}
        <div className={style.labe}>
          <label className={style.lab}>Phone Number</label>
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={style.input}
          />
        </div>

        <div className={style.labe}>
          <label className={style.lab}>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={style.input}
          />
        </div>

        <div className={style.labe}>
          <label className={style.lab}>Current School Name</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className={style.input}
          />
        </div>

        <div className={style.labe}>
          <label className={style.lab}>Class</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className={style.input}
          />
        </div>

        <button type="submit" className={style.save}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserSettings;
