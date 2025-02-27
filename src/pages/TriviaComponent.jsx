import axios from "axios";
import { useState, useEffect } from "react";

const TriviaQuiz = ({ videoTitle }) => {
  const [trivia, setTrivia] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    console.log("videoTitle received:", videoTitle); // Debugging
    if (!videoTitle) return; // Prevent API call if videoTitle is undefined

    const fetchTrivia = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:7000/api/trivia/video/${encodeURIComponent(
            videoTitle
          )}`
        );
        if (data.length > 0) {
          setTrivia(data[0]);
        } else {
          setTrivia(null);
        }
      } catch (error) {
        console.error("Error fetching trivia", error);
        setTrivia(null);
      }
    };

    fetchTrivia();
  }, [videoTitle]);

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      alert("Please select an answer");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      console.log(localStorage.getItem("authToken"));

      if (!token) {
        alert("You must be logged in to submit an answer.");
        return;
      }

      const { data } = await axios.post(
        `http://localhost:7000/api/trivia/video/${encodeURIComponent(
          videoTitle
        )}/answer`,
        { answer: selectedAnswer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFeedback(data.message);
    } catch (error) {
      console.error("Error submitting answer:", error.response?.data || error);
      alert("Error submitting answer");
    }
  };

  if (!trivia)
    return (
      <p className="text-center text-gray-500">
        No trivia available for this video.
      </p>
    );

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">{trivia.question}</h2>
      {trivia.options.map((option, index) => (
        <div key={index} className="mb-2">
          <input
            type="radio"
            name="answer"
            value={option}
            checked={selectedAnswer === option}
            onChange={() => setSelectedAnswer(option)}
            className="mr-2"
          />
          <label>{option}</label>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="w-full p-2 bg-blue-500 text-white rounded mt-4"
      >
        Submit Answer
      </button>
      {feedback && (
        <p
          className={`mt-4 text-lg ${
            feedback.includes("correct") ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
};

export default TriviaQuiz;
