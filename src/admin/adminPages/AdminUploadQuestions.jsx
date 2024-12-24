import style from '../../admin/adminStyles/Admin.module.css';
import AdminSideBar from '../adminComponents/AdminSideBar';
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

function QuizUpload() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Convert the file to JSON format using XLSX library
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        setQuestions(jsonData); // Set the data to state
      };
      reader.readAsArrayBuffer(file);

      toast.success("File uploaded successfully and converted to JSON!");
    } catch (error) {
      console.error("Error uploading or converting file:", error);
      toast.error("File upload failed!");
    }
  };

  return (
      // <div >
     <div className={style.componentContent}>
        <AdminSideBar />

        <div className={style.headerContent}>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".xlsx" />
        <button type="submit">Upload Quiz</button>
      </form>
      <ToastContainer />

      {questions.length > 0 && (
        <div>
          <h2>Quiz</h2>
          {questions.map((question, index) => (
            <div key={index}>
              <h3>{question.Question}</h3>
              <ul>
                <li><strong>Correct Answer:</strong> {question.Correct_Answer}</li>
                <li><strong>Wrong Answer 9:</strong> {question.Wrong_Answer1}</li>
                <li><strong>Wrong Answer 2:</strong> {question.Wrong_Answer2}</li>
                <li><strong>Wrong Answer 3:</strong> {question.Wrong_Answer3}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default QuizUpload;