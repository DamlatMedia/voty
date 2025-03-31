import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import style from "../adminStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdmin } from "../../components/AdminContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AdminSet from "../adminComponents/AdminSet";

function AdminSetting () {
  const context = useContext(useAdmin) || {};
  const { username, setUsername } = context;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
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

        const response = await axios.get(
          `${API_BASE_URL}/admin/one-admin?username=${currentUsername}`,
      
       {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(response.data); // Check the response format

        if (response.data && response.data.adminData?.username) {
          console.log(response.data.adminData.username);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to fetch admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    //   }, [username, navigate, setUsername]);
  }, [username, navigate]);
   
  return (
      <div className={style.dash}>
      {loading ? (
        <p>Loading...</p>
      ) : username ? (
        <div className={style.dashSide}>
          <div className={style.side}>
            <AdminSideBar />
          </div>
 
          <div className={style.home}>
            <AdminHeader />

            <div className={style.content}>
          <AdminSet/>
       
            </div>
          </div>
        </div>
      ) : (
        <p>No user data available. Redirecting...</p>
      )}
    </div>
      );
}

export default AdminSetting;