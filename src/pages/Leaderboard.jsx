// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Leaderboard = () => {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         const response = await axios.get("http://localhost:7000/api/leaderboard");
//         setLeaderboard(response.data);
//       } catch (err) {
//         console.error("Error fetching leaderboard:", err);
//         setError("Failed to load leaderboard.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeaderboard();
//   }, []);

//   if (loading) return <p>Loading leaderboard...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Top 1000 Students</h2>
//       <table border="1" cellPadding="8" cellSpacing="0">
//         <thead>
//           <tr>
//             <th>Rank</th>
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaderboard.map((student, index) => (
//             <tr key={student._id}>
//               <td>{index + 1}</td>
//               <td>{student.firstName}</td>
//               <td>{student.lastName}</td>
//               <td>{student.score}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Leaderboard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Leaderboard = ({ ageCategory }) => {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         // const ageCategory = localStorage.getItem("ageCategory");

//         const response = await axios.get(`http://localhost:7000/api/leaderboard?ageCategory=${ageCategory}`);
//         setLeaderboard(response.data);
//       } catch (err) {
//         console.error("Error fetching leaderboard:", err);
//         setError("Failed to load leaderboard.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeaderboard();
//   }, [ageCategory]);

//   if (loading) return <p>Loading leaderboard...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Top 1000 Students - Age Category {ageCategory}</h2>
//       <table border="1" cellPadding="8" cellSpacing="0">
//         <thead>
//           <tr>
//             <th>Rank</th>
//             <th>First Name</th>
//             {/* <th>Last Name</th> */}
//             <th>Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaderboard.map((student, index) => (
//             <tr key={student._id}>
//               <td>{index + 1}</td>
//               <td>{student.username}</td>
//               {/* <td>{student.lastName}</td> */}
//               <td>{student.score}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Leaderboard;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Leaderboard = () => {
  // Default to one category, you can change the default as needed.
  const [ageCategory, setAgeCategory] = useState("11-20");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await axios.get(
          `${API_BASE_URL}/api/leaderboard?ageCategory=${encodeURIComponent(
            ageCategory
          )}`
        );
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [ageCategory]);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Top 1000 Students - Age Category {ageCategory}</h2>

      {/* Toggle between age categories */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setAgeCategory("5-10")}
          className={ageCategory === "5-10" ? "active-button" : ""}
        >
          5-10
        </button>
        <button
          onClick={() => setAgeCategory("11-20")}
          className={ageCategory === "11-20" ? "active-button" : ""}
          style={{ marginLeft: "1rem" }}
        >
          11-20
        </button>
      </div>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((student, index) => (
            <tr key={student._id}>
              <td>{index + 1}</td>
              <td>{student.username}</td>
              <td>{student.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
