import style from "../studentStyles/userheader.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

function UserHeader() {
  const context = useContext(UserContext) || {};
  const { username, setUsername } = context;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        let currentUsername = username || localStorage.getItem("username");

        const studentId = localStorage.getItem("studentId");

        if (!currentUsername) {
          toast.error("Username is not available. Redirecting to login...");
          navigate("/user/login");
          return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          navigate("/user/login");
          return;
        }

        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await axios.get(
          // `${API_BASE_URL}/admin/user/user?username=${currentUsername}`,

          `${API_BASE_URL}/student/one-student/${studentId}`,

          // const response = await axios.get(
          //   `http://localhost:4000/user/user?username=${currentUsername}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(response.data); // Check the response format

        // if (response.data && response.data.userData?.username) {
        //   console.log(response.data.userData.username);
        // }

        setUserData(response.data.userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 404) {
          toast.error("User not found. Please check the username.");
        } else {
          toast.error("Failed to fetch user data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, navigate]);

  // if (loading) {
  //   return <p>Loading...</p>; // Or a spinner component
  // }
  return (
    <>
      <div className={style.haeder}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />

        <div className={style.dashName}>
          <p>Hello {username} 👋🏿</p>
          <p>what are you today?</p>
        </div>

        <div className={style.dashLogos}>
          <img
            src={userData?.profilePicture || "/images/default-profile.jpg"}
            alt="person"
            className={style.person}
          />
        </div>
      </div>
    </>
  );
}

export default UserHeader;
