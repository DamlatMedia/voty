// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UserRank = () => {
//   const [rank, setRank] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRank = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           setError("You are not logged in.");
//           return;
//         }

//         const response = await axios.get("http://localhost:7000/api/leaderboard/rank", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setRank(response.data.rank);
//       } catch (err) {
//         console.error("Error fetching rank:", err);
//         setError("Failed to load your rank.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRank();
//   }, []);

//   if (loading) return <p>Loading your rank...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Your Rank</h2>
//       <p>You are ranked #{rank} in the leaderboard.</p>
//     </div>
//   );
// };

// export default UserRank;

import React, { useState, useEffect } from "react";
import axios from "axios";

const UserRank = () => {
  const [ageCategory, setAgeCategory] = useState(
    localStorage.getItem("ageCategory") || ""
  );

  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ageCategory) {
      setError("Your age category is not set. Please update your profile.");
      setLoading(false);
      return;
    }

    const fetchRank = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("You are not logged in.");
          return;
        }
        const response = await axios.get(
          `http://localhost:7000/api/leaderboard/rank?ageCategory=${ageCategory}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRank(response.data.rank);
      } catch (err) {
        console.error("Error fetching rank:", err);
        setError("Failed to load your rank.");
      } finally {
        setLoading(false);
      }
    };

    fetchRank();
  }, [ageCategory]);

  if (loading) return <p>Loading your rank...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Rank in Age Category {ageCategory}</h2>
      <p>You are ranked #{rank} in the leaderboard.</p>
    </div>
  );
};

export default UserRank;
