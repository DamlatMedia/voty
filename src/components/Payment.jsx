import React, { useState } from 'react';
import style from '../styles/Payment.module.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePaystackPayment } from 'react-paystack';

function Payment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
  });

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: formData.amount * 100, // Convert to kobo
    publicKey: 'pk_test_c74189507e19c1b0b177495ce964e6ee4c785892', // Replace with your Paystack public key
  };

  const onSuccess = (reference) => {
    console.log(reference);
    alert('Payment successful! Reference: ' + reference.reference);
  };

  const onClose = () => {
    console.log('Payment dialog closed');
    alert('Payment was not completed.');
  };

  const initializePayment = usePaystackPayment(config);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    initializePayment(onSuccess, onClose);
  };

  return (
    <>
      <Header />
      <div className={style.dashboard}>
      
        <form className={style.settings} onSubmit={handleSubmit}>
          <div className={style.login}>
            <div>
              <h1>Donate</h1>
            </div>

            <div className={style.textInputs}>
              <h3>Your Full Name</h3>
              <input
                type="text"
                placeholder="Enter Your Full Name"
                className={style.input}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
              <h3>Phone Number</h3>
              <input
                type="text"
                placeholder="Enter Your Phone Number"
                className={style.input}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className={style.textInputs}>
              <h3>Enter Amount</h3>
              <input
                type="text"
                placeholder="Enter Amount"
                className={style.input}
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <button className={style.button} type="submit">PAY</button>
         
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Payment;
