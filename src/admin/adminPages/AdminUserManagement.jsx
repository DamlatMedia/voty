import style from "../adminStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import AdminTable from "../adminComponents/AdminTable";

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
            <h2>Students</h2>

            <div className={style.stuact}>
              <div className={style.stu}>
                <p className={style.act}>All Students</p>
                <p className={style.act}>Active Students</p>
                <p className={style.act}>Top 10 On The Leaderboard</p>
                <p className={style.act}>New Students</p>
                <p className={style.act}>Name A - Z</p>
              </div>

              <div className={style.stu}>
                <p className={style.act}>Females</p>
                <p className={style.act}>Males</p>
                <p className={style.act}>Students Taking Game Tests</p>
                <p className={style.act}>Students Watching Videos</p>
              </div>
            </div>
            <AdminTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
