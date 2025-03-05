import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizReview from "./UserQuizReview"; // Review component

const StudentQuiz = ({ videoTitle }) => {
  // Retrieve student's age category and student ID from localStorage.
  const ageCategory = localStorage.getItem("ageCategory");
  const studentId = localStorage.getItem("studentId");
  // Create a unique key for this video's quiz lock.
  const quizLockKey =
    studentId && videoTitle ? `quizLocked_${studentId}_${videoTitle}` : null;

  const [trivias, setTrivias] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // For the current question, track the selected answer.
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Check quiz lock for the current student and video on mount.
  useEffect(() => {
    if (quizLockKey && localStorage.getItem(quizLockKey) === "true") {
      setQuizSubmitted(true);
    }
  }, [quizLockKey]);

  // Fetch trivia questions when videoTitle or ageCategory change.
  useEffect(() => {
    if (!videoTitle || !ageCategory) {
      setLoading(false);
      return;
    }
    const fetchTrivia = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const { data } = await axios.get(
          `${API_BASE_URL}/api/trivia/video/${encodeURIComponent(
            videoTitle
          )}/${encodeURIComponent(ageCategory)}`
        );
        setTrivias(data);
      } catch (error) {
        console.error("Error fetching trivia:", error);
        setTrivias([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrivia();
  }, [videoTitle, ageCategory]);

  // Timer effect: countdown from 120 seconds.
  useEffect(() => {
    if (quizSubmitted) return;
    if (timeRemaining <= 0) {
      handleFinishQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, quizSubmitted]);

  // Format seconds as mm:ss.
  const formatTime = (seconds) => {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Handle answer selection for the current question. Once selected, lock it.
  const handleSelectAnswer = async (option) => {
    if (selectedAnswer || quizSubmitted) return;
    setSelectedAnswer(option);
    const currentTrivia = trivias[currentQuestionIndex];
    if (
      option.toLowerCase().trim() ===
      currentTrivia.correctAnswer.toLowerCase().trim()
    ) {
      setFeedback("Correct answer! 🎉");
      setScore((prev) => prev + 10);
    } else {
      setFeedback("Incorrect answer. ❌");
    }
    await submitCurrentAnswer(currentTrivia._id, option);
  };

  // Submit the current answer to the backend.
  const submitCurrentAnswer = async (triviaId, answer) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to submit an answer.");
        return;
      }
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      await axios.post(
        `${API_BASE_URL}/api/trivia/video/${encodeURIComponent(
          videoTitle
        )}/${encodeURIComponent(ageCategory)}/answer`,
        { triviaId, answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(
        "Error submitting answer for trivia",
        triviaId,
        error.response?.data || error
      );
    }
  };

  // Proceed to the next question (or finish the quiz if it's the last question).
  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setFeedback("");
    if (currentQuestionIndex < trivias.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  // Finish the quiz: lock the quiz for this student and video, then show review.
  const handleFinishQuiz = () => {
    setQuizSubmitted(true);
    if (quizLockKey) {
      localStorage.setItem(quizLockKey, "true");
    }
    setShowReview(true);
  };

  // Calculate progress percentage.
  const progressPercentage =
    trivias.length > 0
      ? ((currentQuestionIndex + 1) / trivias.length) * 100
      : 0;

  if (loading) return <p>Loading quiz...</p>;
  if (!trivias.length)
    return (
      <p className="text-center text-gray-500">
        No trivia available for this video for your age group.
      </p>
    );

  if (quizSubmitted && showReview) {
    return (
      <QuizReview
        videoTitle={videoTitle}
        ageCategory={ageCategory}
        trivias={trivias}
        score={score}
        totalQuestions={trivias.length}
      />
    );
  }

  const currentTrivia = trivias[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Quiz: {videoTitle}</h2>
        <div className="timer">Time Remaining: {formatTime(timeRemaining)}</div>
        <div className="progress-bar-container" style={{ marginTop: "1rem" }}>
          <div
            className="progress-bar"
            style={{
              width: `${progressPercentage}%`,
              height: "10px",
              backgroundColor: "#4caf50",
            }}
          ></div>
          <p>{progressPercentage.toFixed(1)}% Completed</p>
        </div>
      </div>
      <div className="question-container" style={{ marginTop: "2rem" }}>
        <h3>{currentTrivia.question}</h3>
        <ul>
          {Array.isArray(currentTrivia.options) &&
            currentTrivia.options.map((option, index) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                <button
                  onClick={() => handleSelectAnswer(option)}
                  disabled={!!selectedAnswer || quizSubmitted}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#eee",
                    border: "1px solid #ccc",
                    width: "100%",
                    textAlign: "left",
                    cursor: !!selectedAnswer ? "not-allowed" : "pointer",
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
        </ul>
        {selectedAnswer && (
          <p
            style={{
              marginTop: "1rem",
              color: feedback.toLowerCase().includes("correct")
                ? "green"
                : "red",
            }}
          >
            {feedback}
          </p>
        )}
      </div>
      {selectedAnswer && !quizSubmitted && (
        <button
          onClick={handleNextQuestion}
          style={{
            padding: "1rem",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            width: "100%",
            marginTop: "2rem",
          }}
        >
          {currentQuestionIndex < trivias.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </button>
      )}
      {quizSubmitted && (
        <p className="mt-4" style={{ fontWeight: "bold", textAlign: "center" }}>
          You scored {score} out of {trivias.length * 10}.
        </p>
      )}
    </div>
  );
};

export default StudentQuiz;
