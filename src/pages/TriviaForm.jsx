import { useState, useEffect } from "react";
import axios from "axios";

const AdminTrivia = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [file, setFile] = useState(null);

    // ✅ Retrieve `videoTitle` from localStorage
    useEffect(() => {
      const storedVideoTitle = localStorage.getItem("videoTitle");
      if (storedVideoTitle) {
        console.log("Retrieved videoTitle from localStorage:", storedVideoTitle);
        setVideoTitle(storedVideoTitle);
      }
    }, []);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitle || !question || !correctAnswer || options.some(opt => !opt)) {
      alert("All fields are required!");
      return;
    }

    try {
      const token = localStorage.getItem("adminAuthToken");

      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

  console.log("Sending Trivia Data:", { videoTitle, question, options, correctAnswer });

      console.log("Token being sent:", token);

      const response = await axios.post(
        "http://localhost:7000/api/trivia/add",
        {
          videoTitle, // Convert to string
          question,
          options,
          correctAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Change to JSON format if not uploading files
          },
        }
      );

      alert("Trivia added successfully!");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (error) {
      console.error("Error response:", error.response);
      alert(
        `Error adding trivia: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:7000/api/trivia/upload-excel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Trivia uploaded successfully!");
    } catch (error) {
      alert("Error uploading file");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Trivia Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Video Title"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
        ))}
        <input
          type="text"
          placeholder="Correct Answer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Add Trivia
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6 mb-4">Upload Trivia (Excel)</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleFileUpload}
        className="w-full p-2 bg-green-500 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
};

export default AdminTrivia;
