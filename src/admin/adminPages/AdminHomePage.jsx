import style from "../adminStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import AdminDashboard from "../adminComponents/AdminDashboard";
import AdminHom from "../adminComponents/AdminHom";
import AdminVideo from "../adminComponents/AdminVideo";
import AdminTrivia from "../adminComponents/AdminTrivia";
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
            <div className={style.card}>
              <AdminHom />
              <AdminHom />
              <AdminHom />
            </div>

            <AdminVideo />

            <AdminTrivia />

            <AdminTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
