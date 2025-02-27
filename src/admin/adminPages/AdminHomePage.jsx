import style from "../adminStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import AdminHom from "../adminComponents/AdminHom";
import AdminVideo from "../adminComponents/AdminVideo";
import AdminTrivia from "../adminComponents/AdminTrivia";
import AdminTable from "../adminComponents/AdminTable";
import {useAdmin } from "../../components/AdminContext";

function AdminHome() {
  const context =  useContext(useAdmin) || {};
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
        console.log(token)
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
    localStorage.removeItem("adminAuthToken");
    setUsername(""); // Clear context
    navigate("/admin/login");
  };
  return (
    <div className={style.dash}>
      <div className={style.dashSide}>
        <div className={style.side}>
          <AdminSideBar />
        </div>

        <div className={style.home}>
          <AdminHeader />

          <div className={style.content}>
            <div className={style.card}>
              <AdminHom />
              <AdminHom />
              <AdminHom />
            </div>

            <AdminVideo />

            <AdminTrivia />

            <AdminTable />
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default AdminHome;
