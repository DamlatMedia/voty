import {NavLink} from 'react-router-dom'
import style from '../studentStyles/header.module.css'

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

function Header() {

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
        <>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div className={style.bar}>
    
            <nav className={style.headNav}>
                <h1>LOGO</h1>
                
                <ul className={style.navUl}>
                <li className={style.navLi}><NavLink to='/student/dashboard' className={({ isActive }) => (isActive ? style.active : '')}>Home </NavLink></li>
                <li className={style.navLi} ><NavLink to='/student/quiz' className={({ isActive }) => (isActive ? style.active : '')}>Quiz</NavLink></li>
                <li className={style.navLi} ><NavLink to='/student/materials' className={({ isActive }) => (isActive ? style.active : '')}>Materials</NavLink></li>
                <li className={style.navLi} ><NavLink to='/student/store' className={({ isActive }) => (isActive ? style.active : '')}>Store</NavLink></li>
                </ul>

            <button className={style.logout} onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span> Logout
            </button>

                <div className={style.headSetting}>
                    <li className={style.navLi}><NavLink to='/student/setting'><span class="material-symbols-outlined">rss_feed</span></NavLink></li>
                </div>
            </nav>

        </div>
        </>
    )
}

export default Header
