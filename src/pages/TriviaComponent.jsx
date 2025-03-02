import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentTrivia = ({ videoTitle }) => {
  // Retrieve the student's age category from localStorage (set during login)
  const ageCategory = localStorage.getItem("ageCategory");

  const [trivias, setTrivias] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // keyed by trivia._id
  const [feedbacks, setFeedbacks] = useState({}); // keyed by trivia._id
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("videoTitle received:", videoTitle);
    console.log("ageCategory received:", ageCategory);
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
        // Set all trivia documents instead of just the first one
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

  const handleAnswerChange = (triviaId, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [triviaId]: option }));
  };

  const handleSubmitAnswer = async (triviaId) => {
    if (!selectedAnswers[triviaId]) {
      alert("Please select an answer for this question.");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to submit an answer.");
        return;
      }

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const { data } = await axios.get(
        `${API_BASE_URL}/api/trivia/video/${encodeURIComponent(
          videoTitle
        )}/${encodeURIComponent(ageCategory)}/answer`,
        { triviaId, answer: selectedAnswers[triviaId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFeedbacks((prev) => ({ ...prev, [triviaId]: data.message }));
    } catch (error) {
      console.error("Error submitting answer:", error.response?.data || error);
      alert("Error submitting answer for this question.");
    }
  };

  if (loading) return <p>Loading trivia...</p>;
  if (!trivias.length)
    return (
      <p className="text-center text-gray-500">
        No trivia available for this video for your age group.
      </p>
    );

  return (
    <div>
      {trivias.map((trivia) => (
        <div
          key={trivia._id}
          className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg mb-4"
        >
          <h2 className="text-xl font-bold mb-4">{trivia.question}</h2>
          <ul>
            {Array.isArray(trivia.options) && trivia.options.length > 0 ? (
              trivia.options.map((option, index) => (
                <li key={index} className="mb-2">
                  <label>
                    <input
                      type="radio"
                      name={`answer-${trivia._id}`}
                      value={option}
                      checked={selectedAnswers[trivia._id] === option}
                      onChange={() => handleAnswerChange(trivia._id, option)}
                      className="mr-2"
                      disabled={!!feedbacks[trivia._id]} // Disable if feedback exists
                    />
                    {option}
                  </label>
                </li>
              ))
            ) : (
              <p>No options available for this question.</p>
            )}
          </ul>
          <button
            onClick={() => handleSubmitAnswer(trivia._id)}
            className="w-full p-2 bg-blue-500 text-white rounded mt-4"
          >
            Submit Answer
          </button>
          {feedbacks[trivia._id] && (
            <p
              className={`mt-4 text-lg ${
                feedbacks[trivia._id].toLowerCase().includes("correct")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {feedbacks[trivia._id]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentTrivia;
