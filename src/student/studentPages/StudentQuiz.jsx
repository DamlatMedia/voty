import Footer from "../studentComponent/Footer";
import Header from "../studentComponent/Header";
import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "../studentStyles/quiz.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/UserContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentQuiz() {
  const { username, setUsername } = useContext(UserContext);
  console.log("Username from context:", username);

  const chapters = {
    Fundamental: [
      {
        questionText: "What is 11 + 11?",
        options: [21, 22, 23, 24],
        answer: 22,
        hint: "This is a hint to help you answer correctly 1",
        reference: "refer to pages of the book 1",
      },
      {
        questionText: "What is 10 * 2?",
        options: [10, 20, 30, 40],
        answer: 20,
        hint: "This is a hint to help you answer correctly  2",
        reference: "refer to pages of the book 2",
      },
      {
        questionText: "What is 25 - 5?",
        options: [15, 20, 25, 30],
        answer: 20,
        hint: "This is a hint to help you answer correctly  3",
        reference: "refer to pages of the book 3",
      },
      {
        questionText: "What is 30 / 5?",
        options: [5, 6, 7, 8],
        answer: 6,
        hint: "This is a hint to help you answer correctly  4",
        reference: "refer to pages of the book 4",
      },
      {
        questionText: "What is 18 + 2?",
        options: [15, 18, 20, 22],
        answer: 20,
        hint: "This is a hint to help you answer correctly  5",
        reference: "refer to pages of the book 5",
      },
    ],
    Fraction: [
      {
        questionText: "What is 1/2 + 1/2?",
        options: ["1/2", "1", "2", "1/4"],
        answer: "1",
        hint: "This is a hint to help you answer correctly 6",
        reference: "refer to pages of the book 6",
      },
      {
        questionText: "What is 1/4 of 8?",
        options: [1, 2, 3, 4],
        answer: 2,
        hint: "This is a hint to help you answer correctly  7",
        reference: "refer to pages of the book 7",
      },
      {
        questionText: "What is 3/4 of 16?",
        options: [8, 10, 12, 14],
        answer: 12,
        hint: "This is a hint to help you answer correctly  8",
        reference: "refer to pages of the book 8",
      },
      {
        questionText: "What is 1/5 of 25?",
        options: [2, 3, 4, 5],
        answer: 5,
        hint: "This is a hint to help you answer correctly  9",
        reference: "refer to pages of the book 9",
      },
      {
        questionText: "What is 3/8 + 1/8?",
        options: ["1/4", "1/2", "3/4", "1"],
        answer: "1/2",
        hint: "This is a hint to help you answer correctly  10",
        reference: "refer to pages of the book 10",
      },
    ],
    Decimal: [
      {
        questionText: "What is 0.5 + 0.5?",
        options: [0.5, 1, 1.5, 2],
        answer: 1,
        hint: "This is a hint to help you answer correctly 11",
        reference: "refer to pages of the book 11",
      },
      {
        questionText: "What is 0.1 * 10?",
        options: [0.1, 1, 10, 0.01],
        answer: 1,
        hint: "This is a hint to help you answer correctly 12",
        reference: "refer to pages of the book 12",
      },
      {
        questionText: "What is 1.2 + 1.3?",
        options: [2.4, 2.5, 2.6, 2.7],
        answer: 2.5,
        hint: "This is a hint to help you answer correctly 13",
        reference: "refer to pages of the book 13",
      },
      {
        questionText: "What is 2.5 - 1.5?",
        options: [0.5, 1, 1.5, 2],
        answer: 1,
        hint: "This is a hint to help you answer correctly  14",
        reference: "refer to pages of the book 14",
      },
      {
        questionText: "What is 3.2 / 2?",
        options: [1.1, 1.4, 1.6, 1.8],
        answer: 1.6,
        hint: "This is a hint to help you answer correctly 15",
        reference: "refer to pages of the book 15",
      },
    ],
  };

  const [scores, setScores] = useState({});
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answerSelected, setAnswerSelected] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null); // To track if the answer was correct or not

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const username = localStorage.getItem("username");
        console.log("username:", username);
        if (!username) {
          // throw new Error("Username is not available for fetching scores");
          toast.error("Username is not available for fetching scores");
          navigate("/student/login");
          return;
        }

        const token = localStorage.getItem("authToken");
        console.log("Token:", token); // Debugging line

        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          navigate("/student/login");
          return;
        }
        // const API_URL = process.env.REACT_APP_API_URL;
        // const response = await axios.get(`${API_URL}/quiz/one-score?type=username&username=${username}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });

        const response = await axios.get(
          `http://localhost:4000/score/one-score?type=username&username=${username}`,
          {
            // const response = await axios.get(`https://quiz-interfaces-backend.onrender.com/quiz/one-score?type=username&username=${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data); // Check the response format

        //      Check if scoreData exists and is an array
        if (Array.isArray(response.data.scoreData)) {
          const scoresData = response.data.scoreData.reduce((acc, score) => {
            acc[score.chapter] = score.score;
            return acc;
          }, {});
          setScores(scoresData);
        } else {
          console.error("scoreData is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
        toast.error("Failed to fetch scores.");
      }
    };
    fetchScores();
  }, [username, navigate]);

  const startQuiz = (chapter) => {
    if (scores[chapter]) {
      retakeQuiz(chapter);
    } else {
      initializeQuiz(chapter);
    }
  };

  const initializeQuiz = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentQuestionIndex(0);
    setCurrentScore(0);
    setQuizStarted(true);
    setAnswerSelected(false);
    setAnswerStatus(null);
  };

  const retakeQuiz = async (chapter) => {
    try {
      await axios.delete(
        "http://localhost:4000/score/delete-score",
        { data: { username, chapter } }
      );
      setScores((prevScores) => {
        const updatedScores = { ...prevScores };
        delete updatedScores[chapter];
        return updatedScores;
      });
      initializeQuiz(chapter);
      toast.success("Score deleted. You can retake the quiz.");
    } catch (error) {
      toast.error("Failed to delete score.");
      console.error(error);
    }
  };

  const handleSelectAnswer = (option) => {
    if (!answerSelected) {
      if (option === chapters[selectedChapter][currentQuestionIndex].answer) {
        setCurrentScore(currentScore + 1);
        setAnswerStatus("correct");
      } else {
        setAnswerStatus("incorrect");
      }
      setAnswerSelected(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < chapters[selectedChapter].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerSelected(false);
      setAnswerStatus(null);
    } else {
      submitQuizScore();
      const message =
        currentScore < 3
          ? `You can do better! You scored ${currentScore} out of ${chapters[selectedChapter].length}.`
          : `Quiz Complete! You scored ${currentScore} out of ${chapters[selectedChapter].length}. Well done!`;
      alert(message);
      setQuizStarted(false);
    }
  };

  const submitQuizScore = async () => {
    const chapter = selectedChapter;
    const score = currentScore;
    const totalQuestions = chapters[selectedChapter].length;

    try {
      await axios.post(
        "http://localhost:4000/score/score",
        { username, chapter, score, totalQuestions }
      );
      toast.success("Score submitted successfully!");
    } catch (error) {
      toast.error("You already attempted this quiz chapter!");
      console.error(error);
    }
  };

  const resetQuiz = () => {
    setSelectedChapter(null);
    setCurrentScore(0);
    setCurrentQuestionIndex(0);
    setQuizStarted(false);
    setAnswerSelected(false);
    setAnswerStatus(null);
  };

  // Function to retry the question by resetting the answer states
  const handleRetry = () => {
    setAnswerSelected(false);
    setAnswerStatus(null); // Reset the answer status for retry
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("authToken");
    navigate("/user/login");
  };
  return (
    <>
      <Header />
    <div className={styles.body1}>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {!quizStarted ? (
        <div className={styles.card}>
          <div className={styles.header}>
            <p>Welcome {username} to ScienceDive!</p>
            <h2>Select a Chapter to Start the Quiz</h2>
            <p>Choose a chapter to start your quiz</p>
          </div>

          <select
            className={styles.select}
            onChange={(e) => setSelectedChapter(e.target.value)}
            value={selectedChapter || ""}
          >
            <option value="" disabled>
              Select Chapter
            </option>
            <option value="Fundamental">Fundamental Arithmetic</option>
            <option value="Fraction">Fractions, Decimal, & Percentage</option>
            <option value="Decimal">Decimal Operations</option>
          </select>

          {selectedChapter && (
            <>
              {scores[selectedChapter] ? (
                <div>
                  <p>
                    Your score for {selectedChapter}: {scores[selectedChapter]}
                  </p>
                  <button
                    className={styles.button}
                    onClick={() => retakeQuiz(selectedChapter)}
                  >
                    Retake Chapter
                  </button>
                </div>
              ) : (
                <button
                  className={styles.button}
                  onClick={() => startQuiz(selectedChapter)}
                >
                  Start Quiz
                </button>
              )}
            </>
          )}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          />

          {/* <button className={styles.logout} onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span> Logout
          </button> */}
        </div>
      ) : (
        <div className={styles.quizCard}>
          <div className={styles.quizHeader}>
            <div className={styles.topic}>
              <h2 className={styles.gy}>Math Quiz</h2>
              <p>{selectedChapter}</p>
            </div>

            <div className={styles.topicHead}>
              <div className={styles.topic}>
                <p>
                  {currentScore} / {chapters[selectedChapter].length}
                </p>
                <p>Score </p>
              </div>

              <div className={styles.topic}>
                <p>{username}</p>
              </div>
            </div>
          </div>

          <div className={styles.questionProgress}>
            <div className={styles.progressContainer}>
              <p>
                Progress:{" "}
                {(
                  ((currentQuestionIndex + 1) /
                    chapters[selectedChapter].length) *
                  100
                ).toFixed(1)}
                %
              </p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) /
                        chapters[selectedChapter].length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className={styles.question}>
              <div className={styles.questionHeader}>
                <h3>
                  {chapters[selectedChapter][currentQuestionIndex].questionText}
                </h3>
                <p className={styles.easy}>Easy</p>
              </div>

              <div className={styles.optionsContainer}>
                {chapters[selectedChapter][currentQuestionIndex].options.map(
                  (option, index) => (
                    <button
                      className={styles.options}
                      key={index}
                      onClick={() => handleSelectAnswer(option)}
                    >
                      {" "}
                      {option}{" "}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className={styles.correct}>
              {answerStatus && (
                <p
                  style={{
                    color: answerStatus === "correct" ? "green" : "red",
                  }}
                >
                  {answerStatus === "correct"
                    ? "Correct!"
                    : "Incorrect! Try again"}
                </p>
              )}

              {answerStatus === "incorrect" && (
                <div>
                  <p className={styles.hint}>
                    Hint: {chapters[selectedChapter][currentQuestionIndex].hint}
                  </p>
                  <p>
                    {" "}
                    Reference:{" "}
                    {chapters[selectedChapter][currentQuestionIndex].reference}
                  </p>
                  <button className={styles.button} onClick={handleRetry}>
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.accuracyBtn}>
            <h4 className={styles.accuracy}>
              Accuracy:{" "}
              {((currentScore / (currentQuestionIndex + 1)) * 100).toFixed(1)}%
            </h4>

            <div className={styles.buttonCompo}>
              <button className={styles.buttonQuiz} onClick={resetQuiz}>
                Return to Chapter Selection
              </button>
            </div>

            {answerStatus && (
              <button
                onClick={handleNextQuestion}
                className={styles.buttonQuiz}
              >
                {currentQuestionIndex < chapters[selectedChapter].length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </button>
            )}
          </div>
        </div>
      )}
      {/* <Footer /> */}
    </div>
    </>
  );
}

export default StudentQuiz;
