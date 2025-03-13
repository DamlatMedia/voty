// import { NavLink } from "react-router-dom";
// import style from "../adminStyles/student.module.css";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import AdminSideBar from "../adminComponents/AdminSideBar";
// import AdminHeader from "../adminComponents/AdminHeader";
// import AdminTrivias from "../adminComponents/AdminTrivias";
// import AdminVideos from "../adminComponents/AdminVideos";

// function AdminHome() {
//   return (
//     <div className={style.dash}>
//       <div className={style.dashSide}>
//         <div className={style.side}>
//           <AdminSideBar />
//         </div>

//         <div className={style.home}>
//           <AdminHeader />

//           <div className={style.content}>
//             <div className={style.stud}>
//               <p className={style.act}>
//                 {" "}
//                 <NavLink
//                   className={({ isActive }) => (isActive ? style.active : "")}
//                   to="/admin/videos"
//                 >
//                   Moral Videos
//                 </NavLink>
//               </p>
//               <p className={style.act}>
//                 {" "}
//                 <NavLink
//                   className={({ isActive }) => (isActive ? style.active : "")}
//                   to="/admin/trivias"
//                 >
//                   Trivia Games{" "}
//                 </NavLink>
//               </p>
//             </div>
//             <AdminVideos />
//             <AdminTrivias />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminHome;


import style from "../adminStyles/student.module.css";
import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import AdminTrivias from "../adminComponents/AdminTrivias";
import AdminVideos from "../adminComponents/AdminVideos";
import { useState } from "react";

function AdminHome() {
  const [activeTab, setActiveTab] = useState("videos"); // Default to Moral Videos

  return (
    <div className={style.dash}>
      <div className={style.dashSide}>
        <div className={style.side}>
          <AdminSideBar />
        </div>

        <div className={style.home}>
          <AdminHeader />

          <div className={style.content}>
            <div className={style.stud}>
              <p
                className={`${style.act} ${activeTab === "videos" ? style.active : ""}`}
                onClick={() => setActiveTab("videos")}
              >
                Moral Videos
              </p>
              <p
                className={`${style.act} ${activeTab === "trivias" ? style.active : ""}`}
                onClick={() => setActiveTab("trivias")}
              >
                Trivia Games
              </p>
            </div>

            {/* Conditionally Render Components */}
            {activeTab === "videos" && <AdminVideos />}
            {activeTab === "trivias" && <AdminTrivias />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
