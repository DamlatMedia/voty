// import React, { useState, useEffect } from "react";
// import style from "../studentStyles/paystack.module.css";
// import { usePaystackPayment } from "react-paystack";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function UserPaystack({ onPaymentSuccess }) {
//   const [formData, setFormData] = useState({ email: "" });
//   const amount = 1000; // Fixed amount in Naira

//   const config = {
//     reference: `PAY_${new Date().getTime()}`,
//     email: formData.email,
//     amount: amount * 100, // Convert to kobo
//     publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC,
//   };

//   const initializePayment = usePaystackPayment(config);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSuccess = (reference) => {
//     console.log("✅ Payment Successful! Reference:", reference);

//     if (!reference?.reference) {
//       console.error("❌ Invalid Payment Reference:", reference);
//       toast.warn("Payment verification failed. Please contact support.");
//       return;
//     }

//     // ✅ Save reference to localStorage
//     localStorage.setItem("paymentReference", reference.reference);
//     console.log("💾 Payment reference saved to localStorage:", reference.reference);

//     // ✅ Pass the reference to handlePaymentSuccess
//     onPaymentSuccess(reference.reference);
//   };

//   const onClose = () => {
//     console.log("❌ Payment modal closed without payment.");
//     toast.warn("Payment was not completed.");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.email) {
//       toast.warn("Please enter your email before proceeding.");
//       return;
//     }

//     console.log("🔹 Initializing Paystack Payment...");

//     try {
//       initializePayment(onSuccess, onClose);
//     } catch (error) {
//       console.error("⚠️ Error initializing payment:", error);
//       toast.error("Payment initialization failed.");
//     }
//   };

//   return (
//     <div className={style.success}>
//       <form className={style.successDivs} onSubmit={handleSubmit}>
//         <div className={style.textInputs}>
//           <h3>Email Address</h3>
//           <input
//             type="email"
//             placeholder="Enter Your Email"
//             className={style.input}
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className={style.textInputs}>
//           <h3>Amount</h3>
//           <input type="text" className={style.input} value={`₦${amount}`} readOnly />
//         </div>
//         <button className={style.start} type="submit">
//           PAY ₦{amount}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default UserPaystack;

// import React, { useState, useEffect } from "react";
// import style from "../studentStyles/paystack.module.css";
// import { PaystackButton } from "react-paystack";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const UserPaystack = () => {
//   const [formData, setFormData] = useState({ email: "" });
//   // const amount = 1000; // Fixed amount in Naira

//   const amount = 1000 * 100; // Convert Naira to Kobo
//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // const config = {
//   //   reference: new Date().getTime().toString(),
//   //   email: formData.email,
//   //   amount: amount,
//   //   publicKey: "pk_test_c74189507e19c1b0b177495ce964e6ee4c785892",
//   // };

//   const onSuccess = async (reference) => {
//     console.log("✅ Payment Successful!", reference);

//     if (!reference?.reference) {
//       console.error("❌ No payment reference received!");
//       return;
//     }

//     const paymentReference = reference.reference; // Extract the reference properly
//     console.log("📌 Extracted Payment Reference:", paymentReference);

//     localStorage.setItem("paymentReference", paymentReference);

//     // ✅ Step 1: Verify Payment
//     const isVerified = await verifyPaymentWithPaystack(paymentReference);

//     if (!isVerified) {
//       toast.error("Payment verification failed. Contact support.");
//       return;
//     }

//     // ✅ Step 2: Update User Payment Status
//     await updateUserPaymentStatus(formData.email, paymentReference);
//   };

//   // const onSuccess = async (reference) => {
//   //   console.log("✅ Payment Successful!", reference);
//   //   alert(`Payment Successful! Reference: ${reference.reference}`);
//   //   const paymentReference = reference.reference; // Ensure proper reference extraction
//   //   console.log("📌 Extracted Payment Reference:", paymentReference);

//   //   localStorage.setItem("paymentReference", paymentReference);

//   //   // ✅ Step 1: Verify Payment
//   //   const isVerified = await verifyPaymentWithPaystack(paymentReference);

//   //   if (!isVerified) {
//   //     toast.error("Payment verification failed. Contact support.");
//   //     return;
//   //   }

//   //   // ✅ Step 2: Update User Payment Status
//   //   await updateUserPaymentStatus(formData.email, paymentReference);
//   // };
//   const verifyPaymentWithPaystack = async (reference) => {
//     console.log("🔍 Verifying Payment with Paystack. Reference:", reference);

//     if (!reference) {
//       console.error("❌ No reference provided for verification!");
//       return false;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//       const response = await axios.post(
//         `${API_BASE_URL}/student/api/payments/verify`,
//         { reference }, // Send reference in body
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("🔎 Paystack Verification Response:", response.data);

//       // ✅ Update condition to check "success" instead of "status"
//       if (response.data.success) {
//         console.log("✅ Payment Verified with Paystack:", response.data);
//         return true;
//       } else {
//         console.error("❌ Payment verification failed:", response.data);
//         return false;
//       }
//     } catch (error) {
//       console.error(
//         "⚠️ Error verifying payment:",
//         error.response?.data || error
//       );
//       return false;
//     }
//   };

//   // const verifyPaymentWithPaystack = async (reference) => {
//   //   console.log("🔍 Verifying Payment with Paystack. Reference:", reference);

//   //   if (!reference) {
//   //     console.error("❌ No reference provided for verification!");
//   //     return false;
//   //   }

//   //   try {
//   //     const token = localStorage.getItem("authToken");
//   //     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//   //     const response = await axios.post(
//   //       `${API_BASE_URL}/student/api/payments/verify`,
//   //       { reference }, // Pass reference in request body
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     console.log("🔎 Paystack Verification Response:", response.data);

//   //     if (response.data.status && response.data.data.status === "success") {
//   //       console.log("✅ Payment Verified with Paystack:", response.data);
//   //       return true;
//   //     } else {
//   //       console.error("❌ Payment verification failed:", response.data);
//   //       return false;
//   //     }
//   //   } catch (error) {
//   //     console.error(
//   //       "⚠️ Error verifying payment:",
//   //       error.response?.data || error
//   //     );
//   //     return false;
//   //   }
//   // };

//   const updateUserPaymentStatus = async (email, reference) => {
//     console.log(
//       "🔄 Updating User Payment Status for:",
//       email,
//       "Reference:",
//       reference
//     );

//     try {
//       const token = localStorage.getItem("authToken");

//       const response = await axios.patch(
//         `${API_BASE_URL}/student/update-payment`,
//         { email, reference },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log("📌 Update Response:", response.data);

//       if (response.data.success) {
//         console.log("✅ User payment updated successfully:", response.data);
//         localStorage.setItem("isPaid", "true");
//         toast.success("Payment successfully verified and updated!");
//       } else {
//         console.error(
//           "❌ Failed to update user payment status:",
//           response.data
//         );
//         toast.error("Payment verification failed. Please contact support.");
//       }
//     } catch (error) {
//       console.error(
//         "⚠️ Error updating user payment status:",
//         error.response?.data || error
//       );
//       toast.error("Could not update payment. Contact support.");
//     }
//   };

//   const onClose = () => {
//     console.log("❌ Payment Modal Closed.");
//   };

//   return (
//     <div className={style.success}>
//       <form className={style.successDivs} onSubmit={(e) => e.preventDefault()}>
//         <div className={style.textInputs}>
//           <h3>Email Address</h3>
//           <input
//             type="email"
//             placeholder="Enter Your Email"
//             className={style.input}
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className={style.textInputs}>
//           <h3>Amount</h3>
//           <input
//             type="text"
//             className={style.input}
//             value={`₦${amount}`}
//             readOnly
//           />
//         </div>
//         {/* <button className={style.start} type="submit">
//       PAY ₦{amount}
//     </button> */}
//         {/* <PaystackButton {...config} text="Pay Now" onSuccess={onSuccess} onClose={onClose} />; */}
//         <PaystackButton
//           className={style.start}
//           text="Pay Now"
//           publicKey="pk_test_c74189507e19c1b0b177495ce964e6ee4c785892"
//           amount={amount}
//           email={formData.email}
//           currency="NGN"
//           reference={new Date().getTime().toString()}
//           onSuccess={onSuccess}
//           onClose={onClose}
//         />
//       </form>
//     </div>
//   );
// };

// export default UserPaystack;

import React, { useState, useEffect } from "react";
import style from "../studentStyles/paystack.module.css";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UserPaystack = ({ onPaymentSuccess, setUserData }) => {
  const [formData, setFormData] = useState({ email: "" });

  const amount = 1000 * 100; // Convert Naira to Kobo

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSuccess = async (reference) => {
    console.log("✅ Payment Successful!", reference);

    if (!reference?.reference) {
      console.error("❌ No payment reference received!");
      return;
    }

    const paymentReference = reference.reference;
    console.log("📌 Extracted Payment Reference:", paymentReference);

    localStorage.setItem("paymentReference", paymentReference);

    // ✅ Pass `setUserData` to `handlePaymentSuccess`
    onPaymentSuccess(paymentReference, setUserData);
  };

  const onClose = () => {
    console.log("❌ Payment Modal Closed.");
  };

  return (
    <div className={style.success}>
      <form className={style.successDivs} onSubmit={(e) => e.preventDefault()}>
        <div className={style.textInputs}>
          <h3>Email Address</h3>
          <input
            type="email"
            placeholder="Enter Your Email"
            className={style.input}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={style.textInputs}>
          <h3>Amount</h3>
          <input
            type="text"
            className={style.input}
            value={`₦${amount}`}
            readOnly
          />
        </div>
        <PaystackButton
          className={style.start}
          text="Pay Now"
          publicKey="pk_test_c74189507e19c1b0b177495ce964e6ee4c785892"
          amount={amount}
          email={formData.email}
          currency="NGN"
          reference={new Date().getTime().toString()}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </form>
    </div>
  );
};

export default UserPaystack;
