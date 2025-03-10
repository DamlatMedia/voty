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
import React, { useState } from "react";
import style from "../studentStyles/paystack.module.css";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserPaystack({ onPaymentSuccess }) {
  const [formData, setFormData] = useState({ email: "" });
  const amount = 1000; // Fixed amount in Naira

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: amount * 100, // Convert to kobo
    // publicKey: "pk_test_c74189507e19c1b0b177495ce964e6ee4c785892", // Your Paystack public key
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  // Debug: Log config on every render/update.
  console.log("Paystack config:", config);

  const initializePayment = usePaystackPayment(config);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSuccess = (reference) => {
    console.log("Payment Success callback triggered!");
    if (!reference || !reference.reference) {
      console.error("Invalid payment reference received:", reference);
      toast.warn("Payment verification failed. Please contact support.", {
        position: "top-right",
      });
      return;
    }

    console.log("Paystack reference object:", reference);
    console.log("Payment Success:", reference);
    onPaymentSuccess(reference); // Pass the reference back to the parent
  };

  const onClose = () => {
    console.log("Payment dialog closed");
    toast.warn("Payment was not completed.", { position: "top-right" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.warn("Please enter your email before proceeding.", {
        position: "top-right",
      });
      return;
    }

    try {
      initializePayment(onSuccess, onClose);
    } catch (error) {
      console.error("Error during payment initialization:", error);
      toast.warn(`An error occurred: ${JSON.stringify(error)}`, {
        position: "top-right",
      });
    }
  };

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
          <input
            type="text"
            className={style.input}
            value={`₦${amount}`}
            readOnly
          />
        </div>
        <button className={style.start} type="submit">
          PAY ₦{amount}
        </button>
      </form>
    </div>
  );
}

export default UserPaystack;
