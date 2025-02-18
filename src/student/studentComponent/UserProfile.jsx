import style from "../studentStyles/dashboard.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

function UserProfile() {
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
            src={userData?.profilePicture || "/images/default-profile.jpg"}
            alt="person"
            className={style.person}
          />
        </div>

        <div className={style.profileInfo}>
          <p className={style.minimie}>Minimie Bluey</p>
          <p className={style.gender}>Female</p>
          <p className={style.age}>16 years</p>
        </div>

        <h3 className={style.school}>Citadel Model School. Ajah, Lagos</h3>

        <h2>Recently Watched</h2>

        <div className={style.video}>
          <div className={style.feature}>
            <img
              src="/images/vidStu.png"
              alt="video"
              className={style.vidImage}
            />
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>

          <div className={style.feature}>
            <img
              src="/images/vidStu.png"
              alt="video"
              className={style.vidImage}
            />
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>

          <div className={style.feature}>
            <img
              src="/images/vidStu.png"
              alt="video"
              className={style.vidImage}
            />
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>
        </div>

        <h2>Recently Taken</h2>

        <div className={style.triva}>
          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/math.png" alt="math" />
              <p>Course</p>
              <p className={style.phTag}>Mathematics</p>
              <p>Linear Equations</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/english.png" alt="english" />
              <p>Course</p>
              <p className={style.phTag}>English Language</p>
              <p>Passive and Active Voice</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/literature.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Literature-in-English</p>
              <p>Figures of Speech</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
