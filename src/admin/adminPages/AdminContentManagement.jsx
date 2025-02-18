import style from "../adminStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import AdminVideo from "../adminComponents/AdminVideo";
import AdminTrivia from "../adminComponents/AdminTrivia";
import UserVideos from "../adminComponents/AdminVideos";
import UserTrivias from "../adminComponents/AdminTrivias";

function AdminHome() {
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
            <p className={style.act}>Moral Videos</p>
            <p className={style.act}>Trivia Games</p>
            <p className={style.act}>Drafts</p>
           </div>

            {/* <AdminVideo /> */}

            {/* <UserVideos/> */}

            <AdminTrivia/>
            <UserTrivias/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
