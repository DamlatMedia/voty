import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import style from "../adminStyles/dashboard.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdmin } from "../../components/AdminContext";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
    const context = useContext(useAdmin) || {};
    const { username, setUsername } = context;
    const navigate = useNavigate();
    
    // Local state to hold fetched user data
    const [adminData, setadminData] = useState(null);

    const [newProfilePic, setNewProfilePic] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Fetch user data on mount
    useEffect(() => {
      const fetchadminData = async () => {
        try {
        let currentUsername = username || localStorage.getItem("adminUsername");
    
        if (!currentUsername) {
          toast.error("Username is not available. Redirecting to login...");
          navigate("/admin/login");
          return;
        }
        const token = localStorage.getItem("adminAuthToken");
        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          navigate("/admin/login");
          return;
        }
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        // const response = await axios.get(
        //   `${API_BASE_URL}/admin/one-admin?username=${currentUsername}`,
       
        //   { headers: { Authorization: `Bearer ${token}` } }
        // );
        
        const response = await axios.get(
          `${API_BASE_URL}/admin/one-admin?username=${currentUsername}`,
      
       {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        setadminData(data);
       
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchadminData();
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
      let currentUsername = username || localStorage.getItem("adminUsername");
      console.log("Current username:", currentUsername);

      const token = localStorage.getItem("adminAuthToken");

      console.log(" Token:", token);

      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      // Prepare payload for updating editable fields
      const updatePayload = {
     
      };

      // If a new profile picture is provided, create a FormData and upload it first.
      if (newProfilePic) {
        const formData = new FormData();
        formData.append("profilePicture", newProfilePic);
        // Call your endpoint for updating profile picture. Adjust the URL as needed.
        const picResponse = await axios.put(
          `${API_BASE_URL}/admin/update-profile-picture/${currentUsername}`,
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

      toast.success("Profile updated successfully!");
      // // Optionally update local state
      // setadminData((prev) => ({ ...prev, ...response.data.updatedData }));
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      toast.error("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!adminData) return <p>No user data found.</p>;

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
                : adminData.profilePicture || "/images/default-profile.jpg"
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
            value={adminData.username}
            readOnly
            className={style.input}
          />
        </div>

        <div className={style.labe}>
          <label className={style.lab}>Email</label>
          <input
            type="email"
            value={adminData.email}
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

        <button type="submit" className={style.save}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
