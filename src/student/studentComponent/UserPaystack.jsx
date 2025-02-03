import React, { useState } from "react";
import style from "../studentStyles/paystack.module.css";
import { usePaystackPayment } from "react-paystack";

function UserPaystack() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const amount = 1000; // Fixed amount in Naira

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: amount * 100, // Convert to kobo
    publicKey: "pk_test_c74189507e19c1b0b177495ce964e6ee4c785892", // Replace with your Paystack public key
  };

  const initializePayment = usePaystackPayment(config);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSuccess = (reference) => {
    console.log("Payment Success:", reference);
    alert("Payment successful! Reference: " + reference.reference);
  };

  const onClose = () => {
    console.log("Payment dialog closed");
    alert("Payment was not completed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      initializePayment(onSuccess, onClose);
    } catch (error) {
      // Log the full error object for debugging
      console.error("Error during payment initialization:", error);
      alert(`An error occurred: ${JSON.stringify(error)}`);
    }
  };

  return (
    <>
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
              readOnly // Make the input field read-only
            />
          </div>

          <button className={style.start} type="submit">
            PAY ₦{amount}
          </button>
        </form>
      </div>
    </>
  );
}

export default UserPaystack;
