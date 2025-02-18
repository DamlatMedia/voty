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

          // const response = await axios.get(
          //   `http://localhost:4000/student/one-student?username=${currentUsername}`,
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
    <div className={style.bar}>
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />

        <ul className={style.navUl1}>
          <li className={style.navLi}>
            <NavLink
              className={({ isActive }) => (isActive ? style.active : "")}
              to="/student/dashboard"
            >
              <span class="material-symbols-outlined">grid_view</span>
              <span>Home</span>
            </NavLink>
          </li>
          <li className={style.navLi}>
            <NavLink
              className={({ isActive }) => (isActive ? style.active : "")}
              to="/student/videos"
            >
              <span class="material-symbols-outlined">apartment</span>{" "}
              <span>Moral Videos</span>
            </NavLink>
          </li>
          <li className={style.navLi}>
            <NavLink
              className={({ isActive }) => (isActive ? style.active : "")}
              to="/student/trivia"
            >
              <span class="material-symbols-outlined">monitoring</span>{" "}
              <span>Trivia Games</span>
            </NavLink>
          </li>
          <li className={style.navLi}>
            <NavLink
              className={({ isActive }) => (isActive ? style.active : "")}
              to="/student/scholarship"
            >
              <span class="material-symbols-outlined">
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
              <span class="material-symbols-outlined">business_center</span>{" "}
              <span>Notificaions</span>
            </NavLink>
          </li>
          <li className={style.navLi}>
            <NavLink
              className={({ isActive }) => (isActive ? style.active : "")}
              to="/student/setting"
            >
              <span class="material-symbols-outlined">settings</span>{" "}
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <ul className={style.navUl2}>
        <li
          className={({ isActive }) => (isActive ? style.active : "")}
          onClick={handleLogout}
        >
          {/* <NavLink
            className={({ isActive }) => (isActive ? style.active : "")}
            to="/login"
          > */}
          Log Out
          {/* </NavLink> */}
        </li>
      </ul>
      <ToastContainer />
    </div>
  );
}

export default UserSideBar;
