import React from "react";
import { useLocation } from "react-router-dom";
import StudentQuiz from "../studentComponent/UserQuiz"; // your existing quiz component
import UserSideBar from "../studentComponent/UserSideBar";
import UserHeader from "../studentComponent/UserHeader";
import style from "../studentStyles/student.module.css";

const StudentTriviaPage = () => {
  const location = useLocation();
  const { video } = location.state || {};

  if (!video) return <p>No video details provided.</p>;

  return (
    <div className={style.dashSide}>
      <div className={style.side}>
        <UserSideBar />
      </div>

      <div className={style.home}>
        <UserHeader />

        <div className={style.content}>
          <h1>{video.title}</h1>
          <p>{video.description}</p>
          <p>
            Number of Trivia Questions:{" "}
            {video.triviaCount !== undefined ? video.triviaCount : "N/A"}
          </p>
          <StudentQuiz videoTitle={video.title} />
        </div>
      </div>
    </div>
  );
};

export default StudentTriviaPage;
