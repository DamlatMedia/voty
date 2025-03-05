import UserSideBar from "../studentComponent/UserSideBar";
import UserHeader from "../studentComponent/UserHeader";
import style from "../studentStyles/student.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserTrivia from "../studentComponent/UserTrivia";

function StudentTrivia () {

  return (
      <div className={style.dash}>
   
        <div className={style.dashSide}>
          <div className={style.side}>
            <UserSideBar />
          </div>

          <div className={style.home}>
            <UserHeader />

            <div className={style.content}>
          <UserTrivia/>
            </div>
          </div>
        </div>
 
    </div>
      );
}

export default StudentTrivia;