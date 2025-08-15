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
              {/* At <span className={style.bold}>Voice of the Teenagers</span> and
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
              driven individuals.*/}

              Moral Values Development
The process of actively absorbing and incorporating moral principles and values into one's character and behaviour which shape the mind of the youths is what VOTY.NG stands for in the course of Nation Building. It involves learning, understanding, and internalizing ethical guidelines, which then influence one's thoughts, actions, and overall conduct. It was once quoted by Lao Tzu "Watch your thoughts, they become your words, Watch your words, they become your actions. Watch your actions, they become your habits. Watch your habits, they become your character. Watch your character, it becomes or shape your destiny."
</p> <br />

<p className={style.para}>
This process is crucial for personal development, social harmony, and building a positive society.     </p>
 
<p className={style.para}> ✓ Learning and Understanding: Imbibing morals begins with learning about ethical principles, values, and standards of behaviour from various sources, including family, education, religion, and community.   </p>

<p className={style.para}> ✓ Internalization: It's not enough to just know about morals; one needs to internalize them, making them a part of their own belief system and value structure.   </p>

<p className={style.para}> ✓ Application: Moral imbibing involves applying these principles to real-life situations, making ethical decisions, and acting in accordance with one's moral compass.   </p>

<p className={style.para}> ✓ Positive Impact: By imbibing moral values, individuals can cultivate positive character traits like honesty, integrity, empathy, and respect, which contribute to a more just and compassionate society.   </p>

<p className={style.para}> ✓ Personal Growth: Moral development is an ongoing process, and imbibing moral principles throughout life helps individuals grow into more responsible, ethical, and well-rounded individuals.   </p> <br />
 
<p className={style.head}>
WHAT PROMPTED OUR ZEAL TOWARDS THIS COURSE   </p> 

<p className={style.para}>
1.1 We found paraphernalia of addiction, rebellion and deep rooted pain in the lives of many Nigerian teenagers and youths which is a pandemic. Let’s stop covering our eyes to these challenges which cut across all the classes of citizenship of the Nigerian society. The present crops of our youths are desperate for early prosperity, fame, success etc. without minding its consequences.
 
Majority of these youths lack discipline, hard work, integrity, honesty but digress their strength to cybercrimes, drugs addiction, alcoholism, hookup, prostitution, kidnapping, banditry and lots of vices which have affected the sane society we used to have. It’s a burden within us and it behooves us as a citizen to start the work of redirecting their steps and attention towards positive values hence the VOTY.NG Project. When to start the work of reconciliation, redirection is now, it’s better late than never attempting at all.   </p> <br />
 
<p className={style.para}> 1.2 Why voty.ng is necessary as a catalyst in this project is that it serves as a tool to bringing awareness and engaging the youths in a more positive way by imbibing moral values, ethical principles as against vices and abstaining from attitudes that are self-destructive.  </p> <br />
 
<p className={style.para}> 1.3 The voty.ng app also seeks to appreciate and reward youths that imbibe the moral values and align with its principles by engaging with the mind-building contents that resides on the voty.ng app through scholarships, training, social responsibility etc.
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
                    Sign up by providing your details and creating an account.
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
                  <p className={style.head1}>Watch Moral Videos</p>
                  <p className={style.para2}>
                   Explore our library of engaging moral videos and learn valuable lifelessons.
                  </p>
                </div>
              </div>
              <div className={style.stepby}>
                <div>
                  <img src="./images/Essay.png" alt="" className={style.book} />
                </div>

                <div>
                  <p className={style.head1}>Answer Trivia Questions</p>
                  <p className={style.para2}>
                    After watching a video, answer related trivia questions to test your understanding.
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
                  <p className={style.head1}>Climb the Leaderboard</p>
                  <p className={style.para2}>
                   Earn points for correct answers and secure your spot among the Top 1,000 students.
                  </p>
                </div>
              </div>
              <div className={style.stepby}>
                <div>
                  <img src="./images/Party.png" alt="" className={style.book} />
                </div>

                <div>
                  <p className={style.head1}>Win a Monthly Scholarship</p>
                  <p className={style.para2}>
                    The top 1,000 students are eligible for the scholarship, and a winner is randomly selcted each month.
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
