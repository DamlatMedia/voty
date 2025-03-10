// import React, { useState } from "react";
// import style from "../studentStyles/paystack.module.css";
// import { usePaystackPayment } from "react-paystack";

// function UserPaystack() {
//   const [formData, setFormData] = useState({
//     email: "",
//   });

//   const amount = 1000; // Fixed amount in Naira

//   const config = {
//     reference: new Date().getTime().toString(),
//     email: formData.email,
//     amount: amount * 100, // Convert to kobo
//     publicKey: "pk_test_c74189507e19c1b0b177495ce964e6ee4c785892", // Replace with your Paystack public key
//   };

//   const initializePayment = usePaystackPayment(config);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const onSuccess = (reference) => {
//     console.log("Payment Success:", reference);
//     alert("Payment successful! Reference: " + reference.reference);
//   };

//   const onClose = () => {
//     console.log("Payment dialog closed");
//     alert("Payment was not completed.");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       initializePayment(onSuccess, onClose);
//     } catch (error) {
//       // Log the full error object for debugging
//       console.error("Error during payment initialization:", error);
//       alert(`An error occurred: ${JSON.stringify(error)}`);
//     }
//   };

//   return (
//     <>
//       <div className={style.success}>
//         <form className={style.successDivs} onSubmit={handleSubmit}>
//           <div className={style.textInputs}>
//             <h3>Email Address</h3>
//             <input
//               type="email"
//               placeholder="Enter Your Email"
//               className={style.input}
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={style.textInputs}>
//             <h3>Amount</h3>
//             <input
//               type="text"
//               className={style.input}
//               value={`₦${amount}`}
//               readOnly // Make the input field read-only
//             />
//           </div>

//           <button className={style.start} type="submit">
//             PAY ₦{amount}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }

// export default UserPaystack;

// UserPaystack.jsx
// import React, { useState } from "react";
// import style from "../studentStyles/paystack.module.css";
// import { PaystackButton, usePaystackPayment } from "react-paystack";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function UserPaystack({ onPaymentSuccess }) {
//   const [formData, setFormData] = useState({ email: "" });
//   const [paymentSuccess, setPaymentSuccess] = useState(false); // New state for success
//   const amount = 1000; // Fixed amount in Naira

//   const config = {
//     reference: new Date().getTime().toString(),
//     email: formData.email,
//     amount: amount * 100, // Convert to kobo
//     publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
//   };

//   console.log("UserPaystack: onPaymentSuccess received?", !!onPaymentSuccess);

//   const componentProps = {
//     email: formData.email, // Use entered email
//     amount: amount * 100, // Convert to kobo
//     metadata: { name: "User", phone: "1234567890" },
//     publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
//     text: "Pay Now",
//     onSuccess: (reference) => onSuccess(reference), // Call onSuccess properly
//     onClose: () => alert("Wait! You need this oil, don't go!!!!"),
//   };

//   // Debug: Log config on every render/update.
//   console.log("Paystack config:", config);

//   const initializePayment = usePaystackPayment(config);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   console.log(
//     "UserPaystack: onPaymentSuccess function received:",
//     onPaymentSuccess
//   );

//   console.log(
//     "🔹 UserPaystack: Received onPaymentSuccess?",
//     typeof onPaymentSuccess
//   );

//   const onSuccess = (reference) => {
//     console.log("✅ onSuccess triggered with reference:", reference);

//     if (!reference || !reference.reference) {
//       console.error("❌ Invalid Payment Reference:", reference);
//       toast.warn("Payment verification failed. Please contact support.");
//       return;
//     }

//     // onPaymentSuccess(reference);
//     onPaymentSuccess()

//     console.log("🔹 Checking if onPaymentSuccess is a function...");
//     console.log("🔹 onPaymentSuccess Type:", typeof onPaymentSuccess);

//     if (typeof onPaymentSuccess === "function") {
//       console.log("✅ Calling onPaymentSuccess function...");
//       onPaymentSuccess(reference);
//       console.log("✅ onPaymentSuccess function executed.");
//     } else {
//       console.error("❌ onPaymentSuccess is not a function!");
//     }
//   };

//   const onClose = () => {
//     console.log("Payment dialog closed");
//     toast.warn("Payment was not completed.", { position: "top-right" });
//   };

  

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.email) {
//       toast.warn("Please enter your email before proceeding.", {
//         position: "top-right",
//       });
//       return;
//     }

//     try {
//     //   initializePayment(onSuccess, onClose);
//     //   setPaymentSuccess(true);
//     // } catch (error) {
//     //   console.error("Error during payment initialization:", error);
//     //   toast.warn(`An error occurred: ${JSON.stringify(error)}`, {
//     //     position: "top-right",
//     //   });
//     // }

//     console.log("it")
//     initializePayment(
//       (reference) => {
//         console.log("✅ Payment successful. Reference:", reference);
//         if (typeof onPaymentSuccess === "function") {
//           console.log("✅ Calling onPaymentSuccess...");
//           onPaymentSuccess(reference);
//         }
//         setPaymentSuccess(true);
//       },
//       () => {
//         console.log("❌ Payment modal closed without payment.");
//         toast.warn("Payment was not completed.");
//       })
//     } catch (error) {
//       console.error("⚠️ Error during payment initialization:", error);
//       toast.warn(`An error occurred: ${JSON.stringify(error)}`);
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
//           <input
//             type="text"
//             className={style.input}
//             value={`₦${amount}`}
//             readOnly
//           />
//         </div>
//         <button className={style.start} type="submit">
//           PAY ₦{amount}
//         </button>

//         {/* <PaystackButton className="paystack-button" {...componentProps} /> */}
//       </form>

//       {paymentSuccess && (
//         <div className={style.successMessage}>
//           <h2>Payment Successful!</h2>
//           <p>Thank you for your payment. Your transaction was successful.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserPaystack;

import React, { useState, useEffect } from "react";
import style from "../studentStyles/paystack.module.css";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserPaystack({ onPaymentSuccess }) {
  const [formData, setFormData] = useState({ email: "" });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const amount = 1000; // Fixed amount in Naira

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: amount * 100, // Convert to kobo
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const onSuccess = (reference) => {
  //   console.log("✅ Payment Successful:", reference);

  //   if (!reference?.reference) {
  //     console.error("❌ Invalid Payment Reference:", reference);
  //     toast.warn("Payment verification failed. Please contact support.");
  //     return;
  //   }


  // console.log("🔹 Calling onPaymentSuccess with reference:", reference);

  //   if (typeof onPaymentSuccess === "function") {
  //     onPaymentSuccess(reference);
  //     setPaymentSuccess(true);
  //   } else {
  //     console.error("❌ onPaymentSuccess is not a function!");
  //   }

  //   if (typeof onPaymentSuccess === "function") {
  //     try {
  //       await onPaymentSuccess(reference);
  //       console.log("✅ onPaymentSuccess executed successfully.");
  //       setPaymentSuccess(true);
  //     } catch (error) {
  //       console.error("❌ Error in onPaymentSuccess execution:", error);
  //     }
  //   } else {
  //     console.error("❌ onPaymentSuccess is not a function!");
  //   }
  // };

  const onSuccess = (reference) => {
    console.log("✅ Payment Successful! Reference:", reference);
  
    if (!reference?.reference) {
      console.error("❌ Invalid Payment Reference:", reference);
      toast.warn("Payment verification failed. Please contact support.");
      return;
    }
  
    console.log("🔹 Calling onPaymentSuccess with reference:", reference);
  
    if (typeof onPaymentSuccess === "function") {
      onPaymentSuccess(reference); // Calls handlePaymentSuccess in StudentDashboard
      setPaymentSuccess(true);
      console.log("✅ onPaymentSuccess function executed.");
    } else {
      console.error("❌ onPaymentSuccess is not a function!");
    }
  };
  
  
  

  const onClose = () => {
    console.log("❌ Payment modal closed without payment.");
    toast.warn("Payment was not completed.");
  };

  // useEffect(() => {
    const handleSubmit = (e) => {
      e.preventDefault();
    
      if (!formData.email) {
        toast.warn("Please enter your email before proceeding.");
        return;
      }
    
      console.log("🔹 Initializing Paystack Payment...");
    
      try {
        initializePayment(onSuccess, onClose);  // Pass our success function here
        console.log("✅ Paystack Payment Initialized.");
      } catch (error) {
        console.error("⚠️ Error initializing payment:", error);
        toast.error("Payment initialization failed.");
      }
    };
    
// })
  

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!formData.email) {
  //     toast.warn("Please enter your email before proceeding.");
  //     return;
  //   }

  //   try {
  //     initializePayment(onSuccess, onClose);
  //   } catch (error) {
  //     console.error("⚠️ Error initializing payment:", error);
  //     toast.error("Payment initialization failed.");
  //   }
  // };

  return (
    <div className={style.success}>
      <form className={style.successDivs} onSubmit={handleSubmit}>
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
          <input type="text" className={style.input} value={`₦${amount}`} readOnly />
        </div>
        <button className={style.start} type="submit">
          PAY ₦{amount}
        </button>
      </form>

      {paymentSuccess && (
        <div className={style.successMessage}>
          <h2>Payment Successful!</h2>
          <p>Thank you for your payment. Your transaction was successful.</p>
        </div>
      )}
    </div>
  );
}

export default UserPaystack;



