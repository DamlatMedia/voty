import { NavLink } from "react-router-dom";
import style from "../studentStyles/sidebar.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

function UserSideBar() {
  const context = useContext(UserContext) || {};
  const { username, setUsername } = context;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await axios.get(
          `${API_BASE_URL}/student/one-student?username=${currentUsername}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("authToken");
    setUsername(""); // Clear context
    navigate("/student/login");
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        className={style.toggleButton}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      <div className={`${style.bar} ${isSidebarOpen ? style.open : ""}`}>
        <div className={style.lname}>
          <img
            src="/images/default-profile.jpg"
            alt="img"
            className={style.logos}
          />
          <div className={style.nameInf}>
            <p className={style.name}>{username}</p>
            <p>Profile Information</p>
          </div>
        </div>

        <nav className={style.sideHeader}>
          <ul className={style.navUl1}>
            <li className={style.navLi}>
              <NavLink
                className={({ isActive }) => (isActive ? style.active : "")}
                to="/student/dashboard"
              >
                <span className="material-symbols-outlined">grid_view</span>
                <span>Home</span>
              </NavLink>
            </li>
            <li className={style.navLi}>
              <NavLink
                className={({ isActive }) => (isActive ? style.active : "")}
                to="/student/videos"
              >
                <span className="material-symbols-outlined">apartment</span>{" "}
                <span>Moral Videos</span>
              </NavLink>
            </li>
            <li className={style.navLi}>
              <NavLink
                className={({ isActive }) => (isActive ? style.active : "")}
                to="/student/trivia"
              >
                <span className="material-symbols-outlined">monitoring</span>{" "}
                <span>Trivia Games</span>
              </NavLink>
            </li>
            <li className={style.navLi}>
              <NavLink
                className={({ isActive }) => (isActive ? style.active : "")}
                to="/student/scholarship"
              >
                <span className="material-symbols-outlined">
                  account_balance_wallet
                </span>{" "}
                <span>Scholarships</span>
              </NavLink>
            </li>
            <li className={style.navLi}>
              <NavLink
                className={({ isActive }) => (isActive ? style.active : "")}
                to="/student/notification"
              >
                <span className="material-symbols-outlined">
                  business_center
                </span>{" "}
                <span>Notifications</span>
              </NavLink>
            </li>
            <li className={style.navLi}>
              <NavLink
                className={({ isActive }) => (isActive ? style.active : "")}
                to="/student/setting"
              >
                <span className="material-symbols-outlined">settings</span>{" "}
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <ul className={style.navUl2}>
          <li onClick={handleLogout}>Log Out</li>
        </ul>
        <ToastContainer />
      </div>
    </>
  );
}

export default UserSideBar;
