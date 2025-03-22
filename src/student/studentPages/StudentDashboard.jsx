import React, { useContext, useState, useEffect } from "react";
import style from "../studentStyles/student.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../components/UserContext";
import { useNavigate } from "react-router-dom";
import UserSideBar from "../studentComponent/UserSideBar";
import UserHeader from "../studentComponent/UserHeader";
import UserPayment from "../studentComponent/UserPayment";
import UserPaystack from "../studentComponent/UserPaystack";
import UserSuccessful from "../studentComponent/UserSuccessful";
import UserDashboardContent from "../studentComponent/UserDashboard";

function StudentDashboard() {
  const { username, setUsername } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStage, setPaymentStage] = useState("payment");
  const [userData, setUserData] = useState(null);

  // Fetch username from localStorage if missing
  useEffect(() => {
    if (!username) {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [username, setUsername]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedUsername = localStorage.getItem("username");
        const token = localStorage.getItem("authToken");

        if (!storedUsername || !token) {
          toast.error("Unauthorized. Redirecting...");
          navigate("/student/login");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/student/one-student/${storedUsername}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data.studentData || response.data.data;
        setUserData(data);

        if (data.isPaid) {
          setPaymentStage("dashboard");
          localStorage.setItem("isPaid", "true");
        } else {
          localStorage.removeItem("isPaid");
        }
      } catch (error) {
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     setLoading(true);
  //     try {
  //       const currentUsername = username || localStorage.getItem("username");
  //       const token = localStorage.getItem("authToken");

  //       if (!currentUsername || !token) {
  //         toast.error("Unauthorized. Redirecting to login...");
  //         navigate("/student/login");
  //         return;
  //       }

  //       const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  //       const endpoint = `${API_BASE_URL}/student/one-student/${currentUsername}`;

  //       const response = await axios.get(endpoint, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       const data = response.data.studentData || response.data.data;
  //       setUserData(data);

  //       // Update payment stage based on payment status
  //       if (data.isPaid) {
  //         setPaymentStage("dashboard");
  //         localStorage.setItem("isPaid", "true");
  //       } else {
  //         localStorage.removeItem("isPaid");
  //       }
  //     } catch (error) {
  //       toast.error("Failed to fetch user data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [username, paymentStage]); // Added paymentStage to dependencies

  const handleProceedPayment = () => setPaymentStage("paystack");

  const handlePaymentSuccess = async (reference) => {
    try {
      console.log("🔹 handlePaymentSuccess triggered:", reference);

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const token = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");

      if (!username) {
        toast.error("An error occurred. Please log in again.");
        return;
      }

      if (!reference) {
        toast.error("Payment reference is missing. Please contact support.");
        return;
      }

      console.log("📢 Verifying payment...");
      await axios.post(
        `${API_BASE_URL}/student/api/payments/verify`,
        { reference },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📢 Updating payment status...");
      await axios.patch(
        `${API_BASE_URL}/student/update-payment/${username}`,
        { isPaid: true, reference },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Refresh user data
      setUserData((prev) => ({ ...prev, isPaid: true }));
      localStorage.setItem("isPaid", "true");
      setPaymentStage("dashboard");

      toast.success("Payment verified! Redirecting...");
    } catch (error) {
      console.error("❌ Payment update failed:", error);
      toast.error("Payment update failed. Please contact support.");
    }
  };

  useEffect(() => {
    if (paymentStage === "success") {
      console.log("✅ Redirecting to success page...");
      navigate("/payment-success");
    }
  }, [paymentStage, navigate]);

  const handleContinue = () => setPaymentStage("dashboard");

  if (loading) return <p>Loading...</p>;

  return (
    <div className={style.dash}>
      <div className={style.dashSide}>
        <div className={style.side}>
          <UserSideBar />
        </div>
        <div className={style.home}>
          <UserHeader />
          <div className={style.content}>
            {paymentStage === "payment" && (
              <UserPayment onProceed={handleProceedPayment} />
            )}
            {paymentStage === "paystack" && (
              <UserPaystack
                onPaymentSuccess={handlePaymentSuccess}
                setUserData={setUserData}
              />
            )}
            {paymentStage === "success" && (
              <UserSuccessful onContinue={handleContinue} />
            )}
            {paymentStage === "dashboard" && <UserDashboardContent />}

            {/* <UserPaystack/> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
