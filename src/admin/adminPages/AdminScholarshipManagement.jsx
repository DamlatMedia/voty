import style from "../adminStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import AdminScholarship from "../adminComponents/AdminScholarship";

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
            <p className={style.new}>Upload A New Scholarship Flyer +</p>
          </div>

          {/* 
            <AdminTrivia/>
            <UserTrivias/> */}

          <AdminScholarship />
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
