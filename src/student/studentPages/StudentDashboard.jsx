import style from "../studentStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import UserSideBar from "../studentComponent/UserSideBar";
import UserHeader from "../studentComponent/UserHeader";

function StudentDashboard() {
  const context = useContext(UserContext) || {};
  const { username, setUsername } = context;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
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

        const API_URL = process.env.REACT_APP_API_URL;
        const response = await axios.get(
          `http://localhost:4000/student/one-student?username=${currentUsername}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(response.data); // Check the response format

        // if (response.data && response.data.studentData?.username) {
        //   setUsername(response.data.studentData.username);
        // }
        if (response.data && response.data.studentData?.username) {
          console.log(response.data.studentData.username);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    //   }, [username, navigate, setUsername]);
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("authToken");
    setUsername(""); // Clear context
    navigate("/student/login");
  };

  return (
    <div>
      {/* {loading ? (
        <p>Loading...</p>
      ) : username ? ( */}
      
          <div className={style.dashSide}>
            <UserSideBar />
            <UserHeader />

            <div className={style.dash}>
              <p>Welcome {username} to ScienceDive!</p>
            </div>
          </div>
    
      {/* ) : (
        <p>No user data available. Redirecting...</p>
      )} */}
    </div>
  );
}

export default StudentDashboard;
