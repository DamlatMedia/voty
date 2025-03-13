import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import style from "../adminStyles/dashboard.module.css";

const Transactions = () => {
  const [students, setStudents] = useState([]); // Default to an empty array

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Track selected student

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("adminAuthToken");
        if (!token) {
          console.error("No token found. student might not be logged in.");
          return;
        }

        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${API_BASE_URL}/admin/all-students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("students:", response.data);
        setStudents(response.data.studentData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students.");
        toast.error("Failed to fetch student data.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);
  return (
    <div className={style.container}>
      {/* Blur Effect when form is open */}
      <div>
        <br />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>School</th>
              <th>Date</th>
              <th>Leaderboard</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.slice(0, 3).map((student, index) => (
                <tr key={index}>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                  <td>{student.number}</td>
                  <td>{student.gender}</td>
                  <td>{student.school}</td>
                  <td>{student.birth}</td>
                  <td>{student.score}</td>
                  <td>
                    <button
                      className={style.edi}
                      onClick={() => setSelectedUser(student)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
