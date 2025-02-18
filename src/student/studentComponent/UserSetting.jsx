import style from "../studentStyles/dashboard.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

function UserNotification() {
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
            `${API_BASE_URL}/admin/user/user?username=${currentUsername}` ,
      
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
  
  return (
    <>
      <div className={style.all}>

      <div className={style.imageText}>
      <img
              src={
                userData?.profilePicture ||
                "/images/default-profile.jpg"
              }
              alt="person"
              className={style.person}
            />

          <div className={style.texts}>
            <p className={style.text1}>Upload New</p>
            <p className={style.text2}>Delete Avatar</p>
          </div>
        </div>

        <div className={style.labe}>
            <label className={style.lab} htmlFor="">Name</label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Minimie Bluey"
              className={style.input}
            />
          </div>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Username</label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Minimie Bluey"
              className={style.input}
            />
          </div>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Email</label>
            <input
              type="eamil"
              name=""
              id=""
              placeholder="minimiebluey55@gmail.com"
              className={style.input}
            />
          </div>

      <div className={style.labe}>
            <label className={style.lab} htmlFor="">Phone Number</label>
            <input
              type="number"
              name=""
              id=""
              placeholder="09085575634"
              className={style.input}
            />
          </div>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Password</label>
            <input
              type="password"
              name=""
              id=""
              placeholder="***********"
              className={style.input}
            />
          </div>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Confirm Password</label>
            <input
              type="password"
              name=""
              id=""
              placeholder="minimie567"
              className={style.input}
            />
          </div>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Address</label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ajah/Sangotedo, Lagos State, Nigeria"
              className={style.input}
            />
          </div>

          <h2>Profile Information</h2>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Date of Birth</label>
            <input
              type="date"
              name=""
              id=""
              placeholder="23-05-2012"
              className={style.input}
            />
          </div>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Gender</label>
           <select name="" id="" className={style.input}>
            <option value=""> Female</option>
            <option value=""> Male</option>
           </select>
          </div>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Current School Name</label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Citadel Model School. Ajah, Lagos"
              className={style.input}
            />
          </div>

          <div className={style.labe}>
            <label className={style.lab} htmlFor="">Class</label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Senior Secondary 1"
              className={style.input}
            />
          </div>

          <button className={style.save}>Save Changes</button>
      </div>
    </>
  );
}

export default UserNotification;
