import React from "react";

const QuizReview = ({
  videoTitle,
  ageCategory,
  trivias,
  score,
  totalQuestions,
}) => {
  return (
    <div
      className="quiz-review-container"
      style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}
    >
      <h2>
        Quiz Review for {videoTitle} ({ageCategory})
      </h2>
      <p>
        You scored {score} out of {totalQuestions * 10}.
      </p>
      <hr style={{ margin: "1rem 0" }} />
      {trivias.map((trivia, index) => (
        <div
          key={trivia._id}
          style={{
            marginBottom: "1rem",
            borderBottom: "1px solid #ccc",
            paddingBottom: "1rem",
          }}
        >
          <h3>
            Question {index + 1}: {trivia.question}
          </h3>
          <p>
            <strong>Correct Answer:</strong> {trivia.correctAnswer}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuizReview;
