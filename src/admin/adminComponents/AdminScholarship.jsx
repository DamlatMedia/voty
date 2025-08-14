// import style from "../adminStyles/dashboard.module.css";

// function UserScholarship() {
//   return (
//     <>
//       <div className={style.all}>
//         <img src="/images/advert.png" alt="advert" className={style.adverts} />

//         <div className={style.leaderWeek}>
//           <h2>Leaderboard</h2>
//           <select name="" id="" className={style.progressDate}>
//             <option value="">This Week</option>
//             <option value="">This Week</option>
//             <option value="">This Week</option>
//             <option value="">This Week</option>
//           </select>
//         </div>

//         <div className={style.leadersScholarship}>
//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/gold.png" alt="gold" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>1</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/silver.png" alt="silver" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>2</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/trophy.png" alt="trophy" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>3</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>4</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>5</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>6</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>7</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>8</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>9</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>10</h4>
//           </div>
//           <hr className={style.hr} />

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>24</h4>
//           </div>

//           <div className={style.leaderScho}>
//             <div className={style.profileName}>
//               <img src="/images/win.png" alt="win" />
//               <img src="/images/profile.png" alt="profile" />

//               <div className={style.name}>
//                 <p>Chukwuemeka Miracle</p>
//                 <p>33 points</p>
//               </div>
//             </div>

//             <h4>25</h4>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default UserScholarship;

import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../adminStyles/dashboard.module.css";

function UserScholarship() {
  // Default to one category, you can change the default as needed.
  const [ageCategorys, setAgeCategorys] = useState("11-20");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ageCategory, setAgeCategory] = useState(
    localStorage.getItem("ageCategory") || ""
  );

  const [rank, setRank] = useState(null);

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

        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(
          `${API_BASE_URL}/api/leaderboard/rank?ageCategory=${ageCategory}`,
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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await axios.get(
          `${API_BASE_URL}/api/leaderboard?ageCategorys=${encodeURIComponent(
            ageCategorys
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
  }, [ageCategorys]);

  return (
    <>
      <div className={style.all}>
        <img src="/images/advert.png" alt="advert" className={style.adverts} />
        <div className={style.leaderWeek}>
          <h2>Leaderboard</h2>
        </div>

        <br />
        <div className={style.leadersScholarship}>
          {leaderboard.map((student, index) => (
            <div className={style.leaderScho}>
              <div className={style.profileName}>
                <img src="/images/gold.png" alt="gold" />
                <img src="/images/profile.png" alt="profile" />

                <div className={style.name}>
                  <p>{student.username}</p>
                  <p>{student.score} points</p>
                </div>
              </div>

              <h4>{index + 1}</h4>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserScholarship;
