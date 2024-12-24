import style from "../studentStyles/student.module.css";
import Footer from "../studentComponent/Footer";
import Header from "../studentComponent/Header";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

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

  // const handleLogout = () => {
  //   localStorage.removeItem("username");
  //   localStorage.removeItem("authToken");
  //   setUsername(""); // Clear context
  //   navigate("/student/login");
  // };

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : username ? (
        <>
          <p>Welcome {username} to ScienceDive!</p>

          <div className={style.dashBody}>
            <button className={style.btnNew}>
              Announcing our next round of advanced courses.{" "}
              <a href="#" className={style.more}>
                Read more
              </a>
            </button>

            <h1 className={style.dashHead}>
              DsZAK - Master Mathematics with Interactive Learning
            </h1>

            <p className={style.dashP}>
              Engage with our interactive quizzes, in-depth tutorials, and
              personalized learning paths to enhance your math skills and
              achieve your academic goals.
            </p>

            <button className={style.btnFeedback}>Give Your Feedback</button>

            {/* <button className={style.logout} onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span> Logout
            </button> */}
          </div>
        </>
      ) : (
        <p>No user data available. Redirecting...</p>
      )}
      <Footer />
    </div>
  );
}

export default StudentDashboard;
