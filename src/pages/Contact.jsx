import HeaderTwo from "../components/HeaderTwo";
import Footer from "../components/Footer";
import style from "../styles/About.module.css";
import React, { useState } from "react";
import axios from "axios"

function About() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // phone: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:7000/contact/api/contact", formData);  // Point to your backend
      alert(response.data.message); // success feedback
   
     // Clear the form
     setFormData({
      firstName: "",
      lastName: "",
      // phone: "",
      email: "",
      message: ""
  });
  
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <div className={style.body}>
        <div className={style.colo}>
          <HeaderTwo />
          <p className={style.about}>Contact Us</p>
        </div>

        <div className={style.partner}>
          <img
            src="/images/Schol2.png"
            alt="partner"
            className={style.partPic}
          />
          <img
            src="/images/Schol5.png"
            alt="partner"
            className={style.partPic}
          />
          <img
            src="/images/Schol1.png"
            alt="partner"
            className={style.partPic}
          />
          <img
            src="/images/Schol2.png"
            alt="partner"
            className={style.partPic}
          />
        </div>

        <div className={style.about2}>
          <div className={style.desc}>
            <p className={style.head2}>Let's Chat, reach Out to Us</p>
            <p className={style.headText}>
              Your concern is our priority, send us a message and let us review
              your needs
            </p>
          </div>

          <form action="" className={style.form}>
            <div className={style.name}>
            <input
                  className={style.input}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
               <input
                  className={style.input}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
            </div>

            <input
                className={style.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
             <textarea
                className={style.input}
                name="message"
                value={formData.message}
                onChange={handleChange}
                id=""
                placeholder="Enter your message"
                required
              ></textarea>

            <button className={style.send}  onClick={handleSubmit}>Send Message</button>
          </form>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default About;
