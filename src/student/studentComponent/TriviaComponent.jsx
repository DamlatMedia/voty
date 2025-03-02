// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import QuizReview from "../studentComponent/StudentQuizReview"; // Review component

// const StudentQuiz = ({ videoTitle }) => {
//   // Retrieve the student's age category from localStorage
//   const ageCategory = localStorage.getItem("ageCategory");

//   const [trivias, setTrivias] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   // For sequential quiz, we store the selected answer for the current question only.
//   const [selectedAnswer, setSelectedAnswer] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [score, setScore] = useState(0);
//   const [loading, setLoading] = useState(true);
//   // Timer: 2 minutes = 120 seconds
//   const [timeRemaining, setTimeRemaining] = useState(120);
//   // Flag to indicate quiz submission (finalized)
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   // Flag to show review screen after submission
//   const [showReview, setShowReview] = useState(false);

//   // Prevent reattempt on reload by reading a "quizLocked" flag from localStorage
//   useEffect(() => {
//     if (localStorage.getItem("quizLocked") === "true") {
//       setQuizSubmitted(true);
//     }
//   }, []);

//   // Fetch trivia questions when videoTitle or ageCategory change
//   useEffect(() => {
//     if (!videoTitle || !ageCategory) {
//       setLoading(false);
//       return;
//     }
//     const fetchTrivia = async () => {
//       try {
//         const { data } = await axios.get(
//           `http://localhost:7000/api/trivia/video/${encodeURIComponent(
//             videoTitle
//           )}/${encodeURIComponent(ageCategory)}`
//         );
//         setTrivias(data);
//       } catch (error) {
//         console.error("Error fetching trivia:", error);
//         setTrivias([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTrivia();
//   }, [videoTitle, ageCategory]);

//   // Timer effect: countdown from 120 seconds
//   useEffect(() => {
//     if (quizSubmitted) return;
//     if (timeRemaining <= 0) {
//       handleFinishQuiz();
//       return;
//     }
//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [timeRemaining, quizSubmitted]);

//   // Format seconds as mm:ss
//   const formatTime = (seconds) => {
//     const mm = Math.floor(seconds / 60)
//       .toString()
//       .padStart(2, "0");
//     const ss = (seconds % 60).toString().padStart(2, "0");
//     return `${mm}:${ss}`;
//   };

//   // When a student selects an answer, lock it and show immediate feedback.
//   const handleSelectAnswer = async (option) => {
//     // If already answered, do nothing.
//     if (selectedAnswer || quizSubmitted) return;
//     setSelectedAnswer(option);
//     const currentTrivia = trivias[currentQuestionIndex];
//     // Check answer locally first:
//     if (
//       option.toLowerCase().trim() ===
//       currentTrivia.correctAnswer.toLowerCase().trim()
//     ) {
//       setFeedback("Correct answer! 🎉");
//       setScore((prev) => prev + 10);
//     } else {
//       setFeedback("Incorrect answer. ❌");
//     }
//     // Optionally, you can submit the answer to the backend here (if needed)
//     // so that score updates in the database. For example:
//     await submitCurrentAnswer(currentTrivia._id, option);
//   };

//   // Submits the current answer to the backend (ensuring one attempt per question)
//   const submitCurrentAnswer = async (triviaId, answer) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         alert("You must be logged in to submit an answer.");
//         return;
//       }
//       await axios.post(
//         `http://localhost:7000/api/trivia/video/${encodeURIComponent(
//           videoTitle
//         )}/${encodeURIComponent(ageCategory)}/answer`,
//         { triviaId, answer },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     } catch (error) {
//       console.error(
//         "Error submitting answer for trivia",
//         triviaId,
//         error.response?.data || error
//       );
//     }
//   };

//   // Proceed to the next question (or finish quiz if last question)
//   const handleNextQuestion = () => {
//     // Reset selected answer and feedback for next question
//     setSelectedAnswer("");
//     setFeedback("");
//     if (currentQuestionIndex < trivias.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       handleFinishQuiz();
//     }
//   };

//   // Finish quiz: lock quiz and set a flag to prevent reattempts
//   const handleFinishQuiz = () => {
//     setQuizSubmitted(true);
//     localStorage.setItem("quizLocked", "true");
//     // Optionally, you could auto-submit any unanswered questions.
//     setShowReview(true);
//   };

//   // Calculate progress
//   const progressPercentage =
//     trivias.length > 0
//       ? ((currentQuestionIndex + 1) / trivias.length) * 100
//       : 0;

//   if (loading) return <p>Loading quiz...</p>;
//   if (!trivias.length)
//     return (
//       <p className="text-center text-gray-500">
//         No trivia available for this video for your age group.
//       </p>
//     );

//   // If quiz is submitted and review should be shown, render the review component.
//   if (quizSubmitted && showReview) {
//     return (
//       <QuizReview
//         videoTitle={videoTitle}
//         ageCategory={ageCategory}
//         trivias={trivias}
//         score={score}
//         totalQuestions={trivias.length}
//       />
//     );
//   }

//   // Display the current question only
//   const currentTrivia = trivias[currentQuestionIndex];

//   return (
//     <div className="quiz-container">
//       <div className="quiz-header">
//         <h2>Quiz: {videoTitle}</h2>
//         <div className="timer">Time Remaining: {formatTime(timeRemaining)}</div>
//         <div className="progress-bar-container" style={{ marginTop: "1rem" }}>
//           <div
//             className="progress-bar"
//             style={{
//               width: `${progressPercentage}%`,
//               height: "10px",
//               backgroundColor: "#4caf50",
//             }}
//           ></div>
//           <p>{progressPercentage.toFixed(1)}% Completed</p>
//         </div>
//       </div>
//       <div className="question-container" style={{ marginTop: "2rem" }}>
//         <h3>{currentTrivia.question}</h3>
//         <ul>
//           {Array.isArray(currentTrivia.options) &&
//             currentTrivia.options.map((option, index) => (
//               <li key={index} style={{ marginBottom: "0.5rem" }}>
//                 <button
//                   onClick={() => handleSelectAnswer(option)}
//                   disabled={!!selectedAnswer || quizSubmitted}
//                   style={{
//                     padding: "0.5rem 1rem",
//                     backgroundColor: "#eee",
//                     border: "1px solid #ccc",
//                     width: "100%",
//                     textAlign: "left",
//                     cursor: !!selectedAnswer ? "not-allowed" : "pointer",
//                   }}
//                 >
//                   {option}
//                 </button>
//               </li>
//             ))}
//         </ul>
//         {selectedAnswer && (
//           <p
//             style={{
//               marginTop: "1rem",
//               color: feedback.toLowerCase().includes("correct")
//                 ? "green"
//                 : "red",
//             }}
//           >
//             {feedback}
//           </p>
//         )}
//       </div>
//       {selectedAnswer && !quizSubmitted && (
//         <button
//           onClick={handleNextQuestion}
//           style={{
//             padding: "1rem",
//             backgroundColor: "#2196F3",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             width: "100%",
//             marginTop: "2rem",
//           }}
//         >
//           {currentQuestionIndex < trivias.length - 1
//             ? "Next Question"
//             : "Finish Quiz"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default StudentQuiz;

import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizReview from "../studentComponent/StudentQuizReview"; // Review component

const StudentQuiz = ({ videoTitle }) => {
  // Retrieve student's age category and student ID from localStorage.
  const ageCategory = localStorage.getItem("ageCategory");
  const studentId = localStorage.getItem("studentId");

  const [trivias, setTrivias] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(""); // for current question
  const [feedback, setFeedback] = useState(""); // feedback for current question
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Check quiz lock for the current student on mount.
  useEffect(() => {
    if (studentId && localStorage.getItem(`quizLocked_${studentId}`) === "true") {
      setQuizSubmitted(true);
    }
  }, [studentId]);

  // Fetch trivia questions when videoTitle or ageCategory change.
  useEffect(() => {
    if (!videoTitle || !ageCategory) {
      setLoading(false);
      return;
    }
    const fetchTrivia = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:7000/api/trivia/video/${encodeURIComponent(
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

  // Timer: countdown from 120 seconds.
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
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Handle answer selection for the current question. Once selected, lock it.
  const handleSelectAnswer = async (option) => {
    // Do nothing if an answer is already selected or quiz is submitted.
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
    // Optionally submit the answer to the backend.
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
      await axios.post(
        `http://localhost:7000/api/trivia/video/${encodeURIComponent(
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
      console.error("Error submitting answer for trivia", triviaId, error.response?.data || error);
    }
  };

  // Proceed to the next question (or finish quiz if last question).
  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setFeedback("");
    if (currentQuestionIndex < trivias.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  // Finish the quiz: lock the quiz for this student and show the review.
  const handleFinishQuiz = () => {
    setQuizSubmitted(true);
    if (studentId) {
      localStorage.setItem(`quizLocked_${studentId}`, "true");
    }
    setShowReview(true);
  };

  // Calculate progress percentage.
  const progressPercentage =
    trivias.length > 0 ? ((currentQuestionIndex + 1) / trivias.length) * 100 : 0;

  // Prevent reattempt if quiz is already submitted.
  if (loading) return <p>Loading quiz...</p>;
  if (!trivias.length)
    return (
      <p className="text-center text-gray-500">
        No trivia available for this video for your age group.
      </p>
    );

  // Show review screen if quiz is finished.
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

  // Display only the current question.
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
                    cursor: !!selectedAnswer ? "not-allowed" : "pointer"
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
        </ul>
        {selectedAnswer && (
          <p style={{ marginTop: "1rem", color: feedback.toLowerCase().includes("correct") ? "green" : "red" }}>
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
            marginTop: "2rem"
          }}
        >
          {currentQuestionIndex < trivias.length - 1 ? "Next Question" : "Finish Quiz"}
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



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import QuizReview from "../studentComponent/StudentQuizReview"; // Import the review component

// const StudentQuiz = ({ videoTitle }) => {
//   // Retrieve the student's age category and id from localStorage
//   const ageCategory = localStorage.getItem("ageCategory");
//   const studentId = localStorage.getItem("studentId");

//   const [trivias, setTrivias] = useState([]);
//   // For sequential quiz, we show one question at a time.
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   // For the current question, track the selected answer.
//   const [selectedAnswer, setSelectedAnswer] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [score, setScore] = useState(0);
//   const [loading, setLoading] = useState(true);
//   // Timer state: 2 minutes (120 seconds)
//   const [timeRemaining, setTimeRemaining] = useState(120);
//   // Flag to indicate quiz submission (locked)
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   // Flag to show review screen after submission
//   const [showReview, setShowReview] = useState(false);

//   // On mount, check if the quiz is already locked for this student.
//   useEffect(() => {
//     if (studentId && localStorage.getItem(`quizLocked_${studentId}`) === "true") {
//       setQuizSubmitted(true);
//     }
//   }, [studentId]);

//   // Fetch trivia questions when videoTitle or ageCategory change.
//   useEffect(() => {
//     if (!videoTitle || !ageCategory) {
//       setLoading(false);
//       return;
//     }
//     const fetchTrivia = async () => {
//       try {
//         const { data } = await axios.get(
//           `http://localhost:7000/api/trivia/video/${encodeURIComponent(videoTitle)}/${encodeURIComponent(ageCategory)}`
//         );
//         setTrivias(data);
//       } catch (error) {
//         console.error("Error fetching trivia:", error);
//         setTrivias([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTrivia();
//   }, [videoTitle, ageCategory]);

//   // Timer effect: countdown from 120 seconds.
//   useEffect(() => {
//     if (quizSubmitted) return;
//     if (timeRemaining <= 0) {
//       handleFinishQuiz();
//       return;
//     }
//     const timer = setInterval(() => {
//       setTimeRemaining((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [timeRemaining, quizSubmitted]);

//   // Format seconds as mm:ss.
//   const formatTime = (seconds) => {
//     const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
//     const ss = (seconds % 60).toString().padStart(2, "0");
//     return `${mm}:${ss}`;
//   };

//   // When a student selects an answer for the current question, lock it and show feedback.
//   const handleSelectAnswer = async (option) => {
//     // If already answered or quiz is submitted, do nothing.
//     if (selectedAnswer || quizSubmitted) return;
//     setSelectedAnswer(option);
//     const currentTrivia = trivias[currentQuestionIndex];

//     // Check locally first.
//     if (
//       option.toLowerCase().trim() === currentTrivia.correctAnswer.toLowerCase().trim()
//     ) {
//       setFeedback("Correct answer! 🎉");
//       setScore((prev) => prev + 10);
//     } else {
//       setFeedback("Incorrect answer. ❌");
//     }
//     // Submit the answer to the backend.
//     await submitCurrentAnswer(currentTrivia._id, option);
//   };

//   const submitCurrentAnswer = async (triviaId, answer) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         alert("You must be logged in to submit an answer.");
//         return;
//       }
//       await axios.post(
//         `http://localhost:7000/api/trivia/video/${encodeURIComponent(videoTitle)}/${encodeURIComponent(ageCategory)}/answer`,
//         { triviaId, answer },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     } catch (error) {
//       console.error("Error submitting answer for trivia", triviaId, error.response?.data || error);
//     }
//   };

//   // Proceed to the next question (or finish the quiz if it's the last question)
//   const handleNextQuestion = () => {
//     // Reset the answer and feedback for the next question.
//     setSelectedAnswer("");
//     setFeedback("");
//     if (currentQuestionIndex < trivias.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       handleFinishQuiz();
//     }
//   };

//   // Finish the quiz: lock the quiz for this student and show review.
//   const handleFinishQuiz = () => {
//     setQuizSubmitted(true);
//     if (studentId) {
//       localStorage.setItem(`quizLocked_${studentId}`, "true");
//     }
//     setShowReview(true);
//   };

//   // Calculate progress percentage for the current question.
//   const progressPercentage =
//     trivias.length > 0
//       ? ((currentQuestionIndex + 1) / trivias.length) * 100
//       : 0;

//   if (loading) return <p>Loading quiz...</p>;
//   if (!trivias.length)
//     return (
//       <p className="text-center text-gray-500">
//         No trivia available for this video for your age group.
//       </p>
//     );

//   // If the quiz is submitted and review is enabled, render the review component.
//   if (quizSubmitted && showReview) {
//     return (
//       <QuizReview
//         videoTitle={videoTitle}
//         ageCategory={ageCategory}
//         trivias={trivias}
//         score={score}
//         totalQuestions={trivias.length}
//       />
//     );
//   }

//   // Display the current question only.
//   const currentTrivia = trivias[currentQuestionIndex];

//   return (
//     <div className="quiz-container">
//       <div className="quiz-header">
//         <h2>Quiz: {videoTitle}</h2>
//         <div className="timer">Time Remaining: {formatTime(timeRemaining)}</div>
//         <div className="progress-bar-container" style={{ marginTop: "1rem" }}>
//           <div
//             className="progress-bar"
//             style={{
//               width: `${progressPercentage}%`,
//               height: "10px",
//               backgroundColor: "#4caf50",
//             }}
//           ></div>
//           <p>{progressPercentage.toFixed(1)}% Completed</p>
//         </div>
//       </div>
//       <div className="question-container" style={{ marginTop: "2rem" }}>
//         <h3>{currentTrivia.question}</h3>
//         <ul>
//           {Array.isArray(currentTrivia.options) &&
//           currentTrivia.options.map((option, index) => (
//             <li key={index} style={{ marginBottom: "0.5rem" }}>
//               <button
//                 onClick={() => handleSelectAnswer(option)}
//                 disabled={!!selectedAnswer || quizSubmitted}
//                 style={{
//                   padding: "0.5rem 1rem",
//                   backgroundColor: "#eee",
//                   border: "1px solid #ccc",
//                   width: "100%",
//                   textAlign: "left",
//                   cursor: !!selectedAnswer ? "not-allowed" : "pointer"
//                 }}
//               >
//                 {option}
//               </button>
//             </li>
//           ))}
//         </ul>
//         {selectedAnswer && (
//           <p style={{ marginTop: "1rem", color: feedback.toLowerCase().includes("correct") ? "green" : "red" }}>
//             {feedback}
//           </p>
//         )}
//       </div>
//       {selectedAnswer && !quizSubmitted && (
//         <button
//           onClick={handleNextQuestion}
//           style={{
//             padding: "1rem",
//             backgroundColor: "#2196F3",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             width: "100%",
//             marginTop: "2rem"
//           }}
//         >
//           {currentQuestionIndex < trivias.length - 1 ? "Next Question" : "Finish Quiz"}
//         </button>
//       )}
//       {quizSubmitted && (
//         <p className="mt-4" style={{ fontWeight: "bold", textAlign: "center" }}>
//           You scored {score} out of {trivias.length * 10}.
//         </p>
//       )}
//     </div>
//   );
// };

// export default StudentQuiz;
