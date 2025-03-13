// import style from "../adminStyles/student.module.css";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AdminSideBar from "../adminComponents/AdminSideBar";
// import AdminHeader from "../adminComponents/AdminHeader";
// import React, { useEffect, useState } from "react";

// function AdminHome() {
//   const [students, setStudents] = useState([]); // Default to an empty array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null); // Track selected student

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const token = localStorage.getItem("adminAuthToken");
//         if (!token) {
//           console.error("No token found. student might not be logged in.");
//           return;
//         }

//         const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//         const response = await axios.get(`${API_BASE_URL}/admin/all-students`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("students:", response.data);
//         setStudents(response.data.studentData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching students:", err);
//         setError("Failed to fetch students.");
//         toast.error("Failed to fetch student data.");
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);
//   return (
//     <div className={style.dash}>
//       <div className={style.dashSide}>
//         <div className={style.side}>
//           <AdminSideBar />
//         </div>

//         <div className={style.home}>
//           <AdminHeader />

//           <div className={style.content}>
//             <h2>Students</h2>

//             <div className={style.stuact}>
//               <div className={style.stu}>
//                 <p className={style.act}>All Students</p>
//                 <p className={style.act}>Active Students</p>
//                 <p className={style.act}>Top 10 On The Leaderboard</p>
//                 <p className={style.act}>Name A - Z</p>
//               </div>

//               <div className={style.stu}>
//                 <p className={style.act}>Males</p>
//                 <p className={style.act}>Females</p>
//               </div>
//             </div>
//                 {/* <p className={style.act}>New Students</p> */}
//                 {/* <p className={style.act}>Students Taking Game Tests</p> */}
//                 {/* <p className={style.act}>Students Watching Videos</p> */}

//             <div className={style.container}>
//       {/* Blur Effect when form is open */}
//       <div>
//         <br />

//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email Address</th>
//               <th>Phone Number</th>
//               <th>Gender</th>
//               <th>School</th>
//               <th>Date</th>
//               <th>Leaderboard</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length > 0 ? (
//               students.map((student, index) => (
//                 <tr key={index}>
//                   <td>{student.username}</td>
//                   <td>{student.email}</td>
//                   <td>{student.number}</td>
//                   <td>{student.gender}</td>
//                   <td>{student.school}</td>
//                   <td>{student.birth}</td>
//                   <td>{student.score}</td>
//                   <td>
//                     <button
//                       className={style.edi}
//                       onClick={() => setSelectedUser(student)}
//                     >
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7">No students found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminHome;

import style from "../adminStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import React, { useEffect, useState } from "react";

function AdminUserManagement() {
  const [students, setStudents] = useState([]); // Full student list
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered student list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Track selected student
  const [filter, setFilter] = useState("all"); // Default filter

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("adminAuthToken");
        if (!token) {
          console.error("No token found. Student might not be logged in.");
          return;
        }

        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${API_BASE_URL}/admin/all-students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("students:", response.data);
        setStudents(response.data.studentData || []);
        setFilteredStudents(response.data.studentData || []);
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

  // Function to filter students
  const handleFilter = (criteria) => {
    setFilter(criteria);
    let filtered = [...students]; // Clone the original list

    switch (criteria) {
      // case "active":
      //   filtered = filtered.filter((student) => student.active === true);
      //   break;
      case "top10":
        filtered = filtered
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        break;
      case "nameAZ":
        filtered = filtered.sort((a, b) =>
          a.username.localeCompare(b.username)
        );
        break;
      case "males":
        filtered = filtered.filter((student) => student.gender === "male");
        break;
      case "females":
        filtered = filtered.filter((student) => student.gender === "female");
        break;
      default:
        filtered = students; // Show all students
    }

    setFilteredStudents(filtered);
  };

  return (
    <div className={style.dash}>
      <div className={style.dashSide}>
        <div className={style.side}>
          <AdminSideBar />
        </div>

        <div className={style.home}>
          <AdminHeader />

          <div className={style.content}>
            <h2>Students</h2>

            <div className={style.stuact}>
              <div className={style.stu}>
                <p
                  className={style.act}
                  onClick={() => handleFilter("all")}
                  style={{ fontWeight: filter === "all" ? "bold" : "normal" }}
                >
                  All Students
                </p>
                {/* <p
                  className={style.act}
                  onClick={() => handleFilter("active")}
                  style={{ fontWeight: filter === "active" ? "bold" : "normal" }}
                >
                  Active Students
                </p> */}
                <p
                  className={style.act}
                  onClick={() => handleFilter("top10")}
                  style={{ fontWeight: filter === "top10" ? "bold" : "normal" }}
                >
                  Top 10 On The Leaderboard
                </p>
                <p
                  className={style.act}
                  onClick={() => handleFilter("nameAZ")}
                  style={{ fontWeight: filter === "nameAZ" ? "bold" : "normal" }}
                >
                  Name A - Z
                </p>
              </div>

              <div className={style.stu}>
                <p
                  className={style.act}
                  onClick={() => handleFilter("males")}
                  style={{ fontWeight: filter === "males" ? "bold" : "normal" }}
                >
                  Males
                </p>
                <p
                  className={style.act}
                  onClick={() => handleFilter("females")}
                  style={{
                    fontWeight: filter === "females" ? "bold" : "normal",
                  }}
                >
                  Females
                </p>
              </div>
            </div>

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
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUserManagement;
