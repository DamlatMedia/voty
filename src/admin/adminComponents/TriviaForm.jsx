import { useState, useEffect } from "react";
import axios from "axios";

const AdminTrivia = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [file, setFile] = useState(null);
  const [ageCategory, setAgeCategory] = useState(""); // e.g., "5-10" or "11-20"
  const [manualMessage, setManualMessage] = useState("");

  const [excelMessage, setExcelMessage] = useState("");

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
    if (
      !videoTitle ||
      !question ||
      !correctAnswer ||
      options.some((opt) => !opt) ||
      !ageCategory
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const token = localStorage.getItem("adminAuthToken");

      if (!token) {
        setManualMessage("Authentication token is missing. Please log in.");
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      console.log("Sending Trivia Data:", {
        videoTitle,
        question,
        options,
        correctAnswer,
        ageCategory,
      });

      console.log("Token being sent:", token);

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${API_BASE_URL}/api/trivia/add`,
        {
          videoTitle, // Convert to string
          question,
          options,
          correctAnswer,
          ageCategory,
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
      setAgeCategory("");
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      setManualMessage(
        `Error adding trivia: ${error.response?.data?.message || error.message}`
      );
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
      const token = localStorage.getItem("adminAuthToken");
      if (!token) {
        setExcelMessage("Authentication token is missing. Please log in.");
        return;
      }

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      await axios.post(`${API_BASE_URL}/api/trivia/upload-excel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setExcelMessage("Trivia questions uploaded successfully!");
      setFile(null);
      alert("Trivia uploaded successfully!");
    } catch (error) {
      console.error(
        "Error uploading Excel file:",
        error.response?.data || error.message
      );
      setExcelMessage("Error uploading file");
      alert("Error uploading file");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Trivia Question Manually</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Video Title:</label>
          <input
            type="text"
            placeholder="Video Title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label>Question:</label>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>

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
        <div className="mb-2">
          <label>Correct Answer:</label>
          <input
            type="text"
            placeholder="Correct Answer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label>Age Category:</label>
          <select
            value={ageCategory}
            onChange={(e) => setAgeCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Age Category</option>
            <option value="5-10">5-10</option>
            <option value="11-20">11-20</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Add Trivia
        </button>
      </form>

      {manualMessage && <p className="mt-2">{manualMessage}</p>}

      <hr className="my-6" />

      <h2 className="text-xl font-bold mt-6 mb-4">Upload Trivia (Excel)</h2>
      <div className="mb-2">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleFileUpload}
        className="w-full p-2 bg-green-500 text-white rounded"
      >
        Upload
      </button>

      {excelMessage && <p className="mt-2">{excelMessage}</p>}
    </div>
  );
};

export default AdminTrivia;
