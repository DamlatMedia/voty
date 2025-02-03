import { NavLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import style from "../styles/Home.module.css";
import React, { useState } from "react";

function Home() {
  const faqs = [
    {
      question: "What Is VOTY",
      answer:
        "VOTY (Voice of the Teenagers and the Youths) is a platform designed to inspire and educate students through moral videos, engaging trivia games, and scholarship opportunities.",
    },
    {
      question: "Who Can Participate On The Platform",
      answer:
        "VOTY (Voice of the Teenagers and the Youths) is a platform designed to inspire and educate students through moral videos, engaging trivia games, and scholarship opportunities.",
    },
    {
      question: "How Does The Scholarship Program Work?",
      answer:
        "VOTY (Voice of the Teenagers and the Youths) is a platform designed to inspire and educate students through moral videos, engaging trivia games, and scholarship opportunities.",
    },
    {
      question: "Is There Any Cost To Join The Platform?",
      answer:
        "VOTY (Voice of the Teenagers and the Youths) is a platform designed to inspire and educate students through moral videos, engaging trivia games, and scholarship opportunities.",
    },
    {
      question: "How Do I Get Started?",
      answer:
        "VOTY (Voice of the Teenagers and the Youths) is a platform designed to inspire and educate students through moral videos, engaging trivia games, and scholarship opportunities.",
    },
    {
      question: "How Will I Know If I've Won A Scholarship?",
      answer:
        "VOTY (Voice of the Teenagers and the Youths) is a platform designed to inspire and educate students through moral videos, engaging trivia games, and scholarship opportunities.",
    },
    {
      question: "Can I Track My Progress",
      answer:
        "VOTY (Voice of the Teenagers and the Youths) is a platform designed to inspire and educate students through moral videos, engaging trivia games, and scholarship opportunities.",
    },
  ];

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <div>
        <Header />
        <div className={style.bout}>
        <div className={style.home}>
          <div className={style.home1}>
            <div className={style.voty}>
              <p>
                Voice of the Teenagers and the Youths (VOTY)
                </p>
                <img src="./images/GroupIMG.png" alt="groupImg"  className={style.groupImg}/>
                </div>
            <p className={style.head}>Unlock Your Potential Shape Your Tomorrow</p>
          </div>

          <div className={style.home2}>
            <p className={style.dico}>
              Discover stories that inspire, test your skills, and qualify for
              life changing opportunities.  </p>
        

                <div className={style.buttons}>
                  <p className={style.start}> <NavLink to="/student/register">Start Now</NavLink></p>
               
                  <p className={style.claim}> <NavLink to="/student/register">Claim Your Spot</NavLink></p>
                </div>
          
          
          </div>
        </div>

        <div className={style.triGam}>
          <p className={style.tri}>Featured Videos</p>

          <div className={style.seeAll}>
          <p className={style.tri}>See All</p>
          <img src="./images/arrow_right.png" alt="arrow_right" className={style.arrow}/>
          </div>
        </div>

        <div className={style.video}>
          <div className={style.feature}>
            <img src="./images/vidImage.png" alt="video" className={style.vidImage}/>
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>

          <div className={style.feature}>
            <img src="./images/vidImage.png" alt="video" className={style.vidImage}/>
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>

          <div className={style.feature}>
            <img src="./images/vidImage.png" alt="video" className={style.vidImage}/>
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>
        </div>

        <div className={style.triGam}>
          <p className={style.tri}>Trivia Games</p>

          <div className={style.seeAll}>
          <p className={style.tri}>See All</p>
          <img src="./images/arrow_right.png" alt="arrow_right" className={style.arrow}/>
          </div>
        </div>

        <div className={style.triva}>
          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="./images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="./images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="./images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="./images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="./images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="./images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="./images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="./images/progress.png" alt="progres" />
            </div>
          </div>
       
        </div>

        <p className={style.partTag}> About us</p>

        <div className={style.about}>
          <div className={style.aboutP}>
            <p className={style.aboutp}>
              At Voice of the Teenagers and the Youths (VOTY), we inspire young
              minds through moral stories, engaging trivia, and opportunities to
              win scholarships. Our platform teaches ethical values, rewards
              academic excellence, and empowers students to shape their future.
              In partnership with key ministries and organizations, VOTY is
              dedicated to building a generation of responsible, ethical, and
              ambitious youth.
            </p>
          </div>

          <div className={style.aboutP}>
            <img src="./images/about.png" alt="aboutImg" className={style.aboutImg} />
          </div>
        </div>

        <p className={style.partTag}>Testimonials</p>
        <p className={style.tellTag}>What our students tell about us.</p>

        <div className={style.testimonials}>
          <div className={style.testimonial1}>
            <div className={style.lorem}>
            <p >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis
              pellentesque mattis lectus aliquam pharetra elementum. At posuere
              sem venenatis sagittis, pretium justo aliquam. Semper mauris arcu
              vitae, tortor. Tellus enim duis ultricies integer lacus, donec
              nulla sollicitudin urna.
            </p>
            <p className={style.testP}>Clinton</p>
            </div>
          
          </div>
          <div className={style.testimonial2}>
            <div className={style.lorem}>
            <p >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis
              pellentesque mattis lectus aliquam pharetra elementum. At posuere
              sem venenatis sagittis, pretium justo aliquam. Semper mauris arcu
              vitae, tortor. Tellus enim duis ultricies integer lacus, donec
              nulla sollicitudin urna.
            </p>
            <p className={style.testP}>Clinton</p>
            </div>
          
          </div>
          <div className={style.testimonial3}>
            <div className={style.lorem}>
            <p >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis
              pellentesque mattis lectus aliquam pharetra elementum. At posuere
              sem venenatis sagittis, pretium justo aliquam. Semper mauris arcu
              vitae, tortor. Tellus enim duis ultricies integer lacus, donec
              nulla sollicitudin urna.
            </p>
            <p className={style.testP}>Clinton</p>
            </div>
          
          </div>
          <div className={style.testimonial4}>
            <div className={style.lorem}>
            <p >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis
              pellentesque mattis lectus aliquam pharetra elementum. At posuere
              sem venenatis sagittis, pretium justo aliquam. Semper mauris arcu
              vitae, tortor. Tellus enim duis ultricies integer lacus, donec
              nulla sollicitudin urna.
            </p>
            <p className={style.testP}>Clinton</p>
            </div>
          
          </div>

         
        </div>

        <p  className={style.partTag}>Frequently Asked Question</p>

        <div className={style.faqContainer}>
     
          {faqs.map((faq, index) => (
            <div key={index} className={style.faqItem}>
              <div
                className={style.question}
                onClick={() => toggleAnswer(index)}
              >
                {faq.question}
              </div>
              {openIndex === index && (
                <div className={style.answer}>{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        <p  className={style.partTag}>Scholarships</p>
        <div className={style.partner}>
        <img src="/images/Schol1.png" alt="partner" className={style.partPic}/>
        <img src="/images/Schol2.png" alt="partner" className={style.partPic}/>
        <img src="/images/Schol3.png" alt="partner" className={style.partPic} />
        <img src="/images/Schol4.png" alt="partner" className={style.partPic} />
        <img src="/images/Schol5.png" alt="partner" className={style.partPic}/>
        <img src="/images/Schol1.png" alt="partner" className={style.partPic}/>
        <img src="/images/Schol2.png" alt="partner" className={style.partPic}/>
        <img src="/images/Schol3.png" alt="partner" className={style.partPic} />
        <img src="/images/Schol4.png" alt="partner" className={style.partPic} />
        <img src="/images/Schol5.png" alt="partner" className={style.partPic}/>
         </div>

        <p className={style.partTag}>Our Partners</p>
        <div className={style.partner}>
        <img src="/images/partner.png" alt="partner" className={style.partPic}/>
        <img src="/images/partner.png" alt="partner" className={style.partPic}/>
        <img src="/images/partner.png" alt="partner" className={style.partPic} />
        <img src="/images/partner.png" alt="partner" className={style.partPic} />
        <img src="/images/partner.png" alt="partner" className={style.partPic}/>
        <img src="/images/partner.png" alt="partner" className={style.partPic}/>
        <img src="/images/partner.png" alt="partner" className={style.partPic} />
        <img src="/images/partner.png" alt="partner" className={style.partPic} />
        </div>

      </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
