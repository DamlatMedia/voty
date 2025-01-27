import HeaderTwo from "../components/HeaderTwo";
import Footer from "../components/Footer";
import style from "../styles/About.module.css";
import React, { useState } from "react";

function About() {
  return (
    <>
  <div className={style.body}>
        <div className={style.colo}>
          <HeaderTwo />
          <p className={style.about}>About Us</p>
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
            <p className={style.head}>
              Learn Values, Answer Questions, Win Scholarships!
            </p>
            <p className={style.para}>
              At <span className={style.bold}>Voice of the Teenagers</span> and
              the Youths (VOTY), we are committed to inspiring young minds and
              shaping a brighter future. Our platform combines education,
              entertainment, and opportunities to foster moral development and
              reward academic excellence. VOTY provides students with access to
              engaging moral videos that teach ethical values, paired with
              trivia questions to test their understanding. By participating,
              students not only gain valuable life lessons but also stand a
              chance to win monthly scholarships, giving them the support they
              need to pursue their dreams. This initiative is proposed to run
              for eight months:{" "}
              <span className={style.bold}>First Three Months:</span> Creating
              awareness and registering students on the platform.{" "}
              <span className={style.bold}>. Next Five Months:</span> Hosting
              trivia games and awarding monthly scholarships to deserving
              winners. The VOTY project,{" "}
              <span className={style.bold}>
                in partnership with key ministries and organizations,
              </span>{" "}
              is a collaboration among{" "}
              <span className={style.bold}>Damlat Media Concept Limited</span>{" "}
              and the{" "}
              <span className={style.bold}>
                Lagos State Ministry of Basic & Secondary Education.
              </span>{" "}
              Together, we aim to empower the next generation. Join us as we
              inspire, educate, and reward young talents across the country.
              Together, we can create a generation of responsible, ethical, and
              driven individuals.
            </p>
          </div>

          <div className={style.how}>
            <div className={style.step}>
              <img
                src="./images/aboutImg.png"
                alt="about"
                className={style.stek}
              />
            </div>

            <div className={style.howStep}>
              <p className={style.head2}>Steps to win a scholarship</p>

              <div className={style.stepby}>
                <div>
                  <img src="./images/Book.png" alt="" className={style.book} />
                </div>

                <div>
                  <p className={style.head1}>Register on the platform</p>
                  <p className={style.para2}>
                    Sign up by providing your details and creating an account
                  </p>
                </div>
              </div>
              <div className={style.stepby}>
                <div>
                  <img
                    src="./images/Youtube.png"
                    alt=""
                    className={style.book}
                  />
                </div>

                <div>
                  <p className={style.head1}>Register on the platform</p>
                  <p className={style.para2}>
                    Sign up by providing your details and creating an account
                  </p>
                </div>
              </div>
              <div className={style.stepby}>
                <div>
                  <img src="./images/Essay.png" alt="" className={style.book} />
                </div>

                <div>
                  <p className={style.head1}>Register on the platform</p>
                  <p className={style.para2}>
                    Sign up by providing your details and creating an account
                  </p>
                </div>
              </div>
              <div className={style.stepby}>
                <div>
                  <img
                    src="./images/Trophy.png"
                    alt=""
                    className={style.book}
                  />
                </div>

                <div>
                  <p className={style.head1}>Register on the platform</p>
                  <p className={style.para2}>
                    Sign up by providing your details and creating an account
                  </p>
                </div>
              </div>
              <div className={style.stepby}>
                <div>
                  <img src="./images/Party.png" alt="" className={style.book} />
                </div>

                <div>
                  <p className={style.head1}>Register on the platform</p>
                  <p className={style.para2}>
                    Sign up by providing your details and creating an account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        </div>
    </>
  );
}

export default About;
