import HeaderTwo from "../components/HeaderTwo";
import Footer from "../components/Footer";
import style from "../styles/About.module.css";
import React, { useState } from "react";

function About() {
  return (
    <>
      <div className={style.body}>
        <div className={style.color}>
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
                type="text"
                placeholder="First Name"
                className={style.input}
              />
              <input
                type="text"
                placeholder="Last Name"
                className={style.input}
              />
            </div>

            <input
              type="text"
              placeholder="Email Address"
              className={style.input1}
            />
            <textarea
              name=""
              id=""
              placeholder="Message"
              className={style.textare}
            ></textarea>

            <button className={style.send}>Send Message</button>
          </form>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default About;
