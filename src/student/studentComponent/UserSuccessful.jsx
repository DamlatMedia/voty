// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const reference = searchParams.get("reference");
//   const username = localStorage.getItem("username"); // Assuming username is stored in localStorage

//   useEffect(() => {
//     const verifyPayment = async () => {
//       if (!reference || !username) {
//         toast.warn("Invalid transaction. Redirecting...");
//         navigate("/student/dashboard");
//         return;
//       }

//       try {
//         // Step 1: Verify Payment with Paystack
//         const response = await axios.post("http://localhost:8000/student/api/payments/verify", { reference });

//         if (response.data.success) {
//           // Step 2: Update Payment Status in Database
//           await axios.patch(
//             `http://localhost:8000/student/update-payment/${username}`,
//             {},
//             {
//               headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//             }
//           );

//           toast.success("Payment verified successfully! Redirecting...");
//           localStorage.setItem("isPaid", "true"); // Unlock dashboard
//           navigate("/student/dashboard"); // Redirect
//         } else {
//           toast.error("Payment verification failed. Please try again.");
//           navigate("/payment");
//         }
//       } catch (error) {
//         console.error("Error verifying payment:", error);
//         toast.error("An error occurred while verifying payment.");
//         navigate("/payment");
//       }
//     };

//     verifyPayment();
//   }, [reference, username, navigate]);

//   return (
//     <div>
//       <h2>Verifying Payment...</h2>
//     </div>
//   );
// };

// export default PaymentSuccess;

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const username = localStorage.getItem("username"); // Assuming username is stored in localStorage
  const token = localStorage.getItem("token"); // Auth token

  useEffect(() => {
    const verifyAndUpdatePayment = async () => {
      if (!reference || !username) {
        toast.warn("Invalid transaction. Redirecting...");
        navigate("/dashboard");
        return;
      }

      try {
        // Step 1: Verify Payment with Paystack
        const verifyResponse = await axios.post(
          "http://localhost:8000/api/payments/verify",
          { reference }
        );

        if (verifyResponse.data.success) {
          toast.success("Payment verified! Updating your account...");

          // Step 2: Update Student Payment Status
          const updateResponse = await axios.patch(
            `http://localhost:8000/update-payment/${username}`,
            { isPaid: true },
            {
              headers: { Authorization: `Bearer ${token}` }, // Include auth token if needed
            }
          );

          if (updateResponse.status === 200) {
            toast.success("Payment confirmed! Redirecting to dashboard...");
            localStorage.setItem("isPaid", "true"); // Unlock dashboard
            navigate("/dashboard"); // Redirect
          } else {
            toast.error("Failed to update payment status. Contact support.");
            navigate("/payment");
          }
        } else {
          toast.error("Payment verification failed. Try again.");
          navigate("/payment");
        }
      } catch (error) {
        console.error("Error verifying or updating payment:", error);
        toast.error("An error occurred while verifying payment.");
        navigate("/payment");
      }
    };

    verifyAndUpdatePayment();
  }, [reference, username, navigate, token]);

  return (
    <div>
      <h2>Verifying Payment...</h2>
    </div>
  );
};

export default PaymentSuccess;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [isPaid, setIsPaid] = useState(false);

//   useEffect(() => {
//     const paymentStatus = localStorage.getItem("isPaid");
    
//     if (paymentStatus === "true") {
//       setIsPaid(true);
//     } else {
//       console.warn("🔹 Unpaid user detected. Redirecting to payment page...");
//       navigate("/payment"); // Redirect unpaid users
//     }
//   }, [navigate]);

//   return isPaid ? <h1>Welcome to your Dashboard 🎉</h1> : null;
// };

// export default Dashboard;
