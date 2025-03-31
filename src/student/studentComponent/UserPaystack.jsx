

// import React, { useState, useEffect, useContext } from "react";
// import style from "../studentStyles/paystack.module.css";
// import { PaystackButton } from "react-paystack";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "../../components/UserContext";
// import axios from "axios";

// const UserPaystack = ({ onPaymentSuccess, setUserData }) => {
//   const { email, setEmail } = useContext(UserContext);
//   // const [formData, setFormData] = useState({ email: "" });

//     // Fetch email from localStorage if missing
//     useEffect(() => {
//       if (!email) {
//         const storedEmail = localStorage.getItem("email");
//         if (storedEmail) {
//           setEmail(storedEmail);
//         }
//       }
//     }, [email, setEmail]);

//   const amount = 1000; // Convert Naira to Kobo

//   // const handleChange = (e) => {
//   //   setFormData({ ...formData, [e.target.name]: e.target.value });
//   // };

//   const onSuccess = async (reference) => {
//     console.log("✅ Payment Successful!", reference);

//     if (!reference?.reference) {
//       console.error("❌ No payment reference received!");
//       return;
//     }

//     const paymentReference = reference.reference;
//     console.log("📌 Extracted Payment Reference:", paymentReference);

//     localStorage.setItem("paymentReference", paymentReference);

//     // ✅ Pass `setUserData` to `handlePaymentSuccess`
//     onPaymentSuccess(paymentReference, setUserData);
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
//             // value={formData.email}
//             value={email}
//             // onChange={handleChange}
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
//         <PaystackButton
//           className={style.start}
//           text="Pay Now"
//           publicKey="pk_test_c74189507e19c1b0b177495ce964e6ee4c785892"
//           amount={amount}
//           // email={formData.email}
//           email={email}
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


import React, { useState, useEffect, useContext } from "react";
import style from "../studentStyles/paystack.module.css";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../components/UserContext";
import axios from "axios";

const UserPaystack = ({ onPaymentSuccess, setUserData }) => {
  const { email, setEmail } = useContext(UserContext);

  // Fetch email from localStorage if missing
  useEffect(() => {
    if (!email) {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [email, setEmail]);

  const amount = 100000; // Amount in kobo (₦1,000)

  const onSuccess = async (reference) => {
    console.log("✅ Payment Successful!", reference);

    if (!reference?.reference) {
      console.error("❌ No payment reference received!");
      return;
    }

    const paymentReference = reference.reference;
    console.log("📌 Extracted Payment Reference:", paymentReference);

    localStorage.setItem("paymentReference", paymentReference);

    // Pass `setUserData` to `handlePaymentSuccess`
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
            value={email}
            required
          />
        </div>
        <div className={style.textInputs}>
          <h3>Amount</h3>
          <input
            type="text"
            className={style.input}
            value={`₦${(amount / 100).toLocaleString()}`}
            readOnly
          />
        </div>
        <PaystackButton
          className={style.start}
          text="Pay Now"
          publicKey="pk_test_c74189507e19c1b0b177495ce964e6ee4c785892"
          amount={amount}
          email={email}
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
