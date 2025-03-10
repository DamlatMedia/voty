// import style from "../studentStyles/student.module.css";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "../../components/UserContext";
// import { useNavigate } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import UserSideBar from "../studentComponent/UserSideBar";
// import UserHeader from "../studentComponent/UserHeader";

// // Import the different payment components
// import UserSuccessful from "../studentComponent/UserSuccessful";
// import UserPayment from "../studentComponent/UserPayment";
// import UserPaystack from "../studentComponent/UserPaystack";
// import UserDashboard from "../studentComponent/UserDashboard";

// function StudentDashboard() {
//   const context = useContext(UserContext) || {};
//   const { username, setUsername } = context;
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   // paymentStage can be: "payment", "paystack", "success", or "dashboard"
//   const [paymentStage, setPaymentStage] = useState("payment");
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       try {
//         let currentUsername = username || localStorage.getItem("username");

//         const studentId = localStorage.getItem("studentId");

//         if (!currentUsername) {
//           toast.error("Username is not available. Redirecting to login...");
//           navigate("/student/login");
//           return;
//         }

//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           toast.error("Unauthorized access. Please log in.");
//           navigate("/student/login");
//           return;
//         }
//         const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//         const response = await axios.get(
//           `${API_BASE_URL}/student/one-student/${currentUsername}`,

//           // const response = await axios.get(
//           //   `http://localhost:4000/student/one-student?username=${currentUsername}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         console.log(response.data); // Check the response format

//         // if (response.data && response.data.studentData?.username) {
//         //   setUsername(response.data.studentData.username);
//         // }
//         if (response.data && response.data.studentData?.username) {
//           console.log(response.data.studentData.username);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         toast.error("Failed to fetch user data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//     //   }, [username, navigate, setUsername]);
//   }, [username, navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("username");
//     localStorage.removeItem("authToken");
//     setUsername(""); // Clear context
//     navigate("/student/login");
//   };

//   return (
//     <div className={style.dash}>
//       {loading ? (
//         <p>Loading...</p>
//       ) : username ? (
//         <div className={style.dashSide}>
// <div className={style.side}>
//   <UserSideBar />
// </div>

// <div className={style.home}>
//   <UserHeader />

//             <div className={style.content}>
//               <UserPayment/>
//               {/* <UserPaystack /> */}
//               {/* <UserSuccessful/> */}

//               {/* <UserDashboard /> */}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p>No user data available. Redirecting...</p>
//       )}
//     </div>
//   );
// }

// export default StudentDashboard;

// StudentDashboard.jsx
// import React, { useContext, useState, useEffect } from "react";
// import style from "../studentStyles/student.module.css";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { UserContext } from "../../components/UserContext";
// import { useNavigate } from "react-router-dom";

// import UserSideBar from "../studentComponent/UserSideBar";
// import UserHeader from "../studentComponent/UserHeader";

// // Import the different payment components
// import UserPayment from "../studentComponent/UserPayment";
// import UserPaystack from "../studentComponent/UserPaystack";
// import UserSuccessful from "../studentComponent/UserSuccessful";
// import UserDashboardContent from "../studentComponent/UserDashboard"; // The actual dashboard content

// function StudentDashboard() {
//   const { username, setUsername } = useContext(UserContext);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   // paymentStage can be: "payment", "paystack", "success", or "dashboard"
//   const [paymentStage, setPaymentStage] = useState("payment");
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {

//     console.log("Fetching user data...");

//     const fetchUserData = async () => {
//       setLoading(true);
//       try {
//         const currentUsername = username || localStorage.getItem("username");
//         const token = localStorage.getItem("authToken");
//         if (!currentUsername || !token) {
//           toast.error("Unauthorized. Redirecting to login...");
//           navigate("/student/login");
//           return;
//         }
//         const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//         const response = await axios.get(
//           `${API_BASE_URL}/student/one-student/${currentUsername}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const data = response.data.studentData || response.data.data;
//         setUserData(data);
//         // Also update local storage payment flag (if stored here)
//         // if (data.isPaid) {
//         //   setPaymentStage("dashboard");
//         //   localStorage.setItem("isPaid", "true");
//         // }
//           // If the student has paid (backend flag) OR localStorage is set, go to dashboard.
//           if (data.isPaid || localStorage.getItem("isPaid") === "true") {
//             setPaymentStage("dashboard");
//             localStorage.setItem("isPaid", "true");
//           }
//       } catch (error) {
//         toast.error("Failed to fetch user data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, [username, navigate]);

//   const handleProceedPayment = () => {
//     // Transition from UserPayment to Paystack view
//     setPaymentStage("paystack");
//   };

//   const handlePaymentSuccess = async (paystackReference) => {
//     // On success, update the user's payment flag on backend:
//     try {
//       const currentUsername = username || localStorage.getItem("username");
//       const token = localStorage.getItem("authToken");
//       const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//       // Assume you have an endpoint to update payment status
//       await axios.patch(
//         `${API_BASE_URL}/student/update-payment/${currentUsername}`,
//         { isPaid: true },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Update local state and storage
//       setPaymentStage("success");
//       localStorage.setItem("isPaid", "true");
//     } catch (error) {
//       toast.error("Payment update failed.");
//     }
//   };

//   const handleContinue = () => {
//     // After showing success, continue to dashboard
//     setPaymentStage("dashboard");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("username");
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("isPaid");
//     setUsername("");
//     navigate("/student/login");
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className={style.dash}>
//       <div className={style.dashSide}>
//       <div className={style.side}>
//             <UserSideBar />
//           </div>

//           <div className={style.home}>
//             <UserHeader />

//         <div className={style.content}>
//           {paymentStage === "payment" && (
//             <UserPayment onProceed={handleProceedPayment} />
//           )}
//           {paymentStage === "paystack" && (
//             <UserPaystack onPaymentSuccess={handlePaymentSuccess} />
//           )}
//           {paymentStage === "success" && (
//             <UserSuccessful onContinue={handleContinue} />
//           )}
//           {paymentStage === "dashboard" && <UserDashboardContent />}
//         </div>
//       </div>
//       {/* <button onClick={handleLogout}>Logout</button> */}
//     </div>
//     </div>
//   );
// }

// export default StudentDashboard;

// StudentDashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import style from "../studentStyles/student.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  // paymentStage can be: "payment", "paystack", "success", or "dashboard"
  const [paymentStage, setPaymentStage] = useState("payment");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log("Fetching user data...");
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // When fetching user data, use:

        const currentUsername = username || localStorage.getItem("username");
        console.log("Current username:", currentUsername);
        const token = localStorage.getItem("authToken");
        console.log("Auth token:", token);
        if (!currentUsername || !token) {
          toast.error("Unauthorized. Redirecting to login...");
          navigate("/student/login");
          return;
        }
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const endpoint = `${API_BASE_URL}/student/one-student/${currentUsername}`;
        console.log("User data endpoint:", endpoint);
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User data fetched:", response.data);
        const data = response.data.studentData || response.data.data;
        setUserData(data);
        // Check payment status
        if (data.isPaid || localStorage.getItem("isPaid") === "true") {
          console.log("User is paid. Setting paymentStage to 'dashboard'.");
          setPaymentStage("dashboard");
          localStorage.setItem("isPaid", "true");

          console.log("User is marked as paid.");
        } else {
          console.log("User is not paid. Payment stage remains 'payment'.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, navigate]);

  const handleProceedPayment = () => {
    console.log("Proceeding to payment step: switching to 'paystack' stage.");
    setPaymentStage("paystack");
  };

  const handlePaymentSuccess = async (paystackReference) => {
    console.log(
      "Payment success callback triggered with reference:",
      paystackReference
    );
    try {
      const currentUsername = username || localStorage.getItem("username");
      const token = localStorage.getItem("authToken");
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      console.log("handlePaymentSuccess: currentUsername =", currentUsername);
      console.log("handlePaymentSuccess: token =", token);
      console.log(
        "handlePaymentSuccess: paystackReference =",
        paystackReference
      );

      // Call backend endpoint to update payment status
      const response = await axios.patch(
        `${API_BASE_URL}/student/update-payment/${currentUsername}`,
        { isPaid: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Payment status updated successfully on backend.");
      setPaymentStage("success");
      localStorage.setItem("isPaid", "true");
    } catch (error) {
      console.error(
        "Error updating payment status:",
        error.response?.data || error.message
      );
      toast.error("Payment update failed.");
    }
  };

  const handleContinue = () => {
    console.log("Continuing to dashboard.");
    setPaymentStage("dashboard");
  };

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
              <UserPaystack onPaymentSuccess={handlePaymentSuccess} />
            )}
            {paymentStage === "success" && (
              <UserSuccessful onContinue={handleContinue} />
            )}
            {paymentStage === "dashboard" && <UserDashboardContent />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
