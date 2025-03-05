import { useNavigate } from "react-router-dom";
import SideBar from "../components/UserSideBar";
import UserHeader from "../components/UserHeader";
import style from "../styles/usernotification.module.css";
import Setting from "../components/Setting";

function UserSetting() {
  const navigate = useNavigate();

  return (
    <>
      <div className={style.componentContent}>
        <SideBar />

        <div className={style.headerContent}>
          <UserHeader />

          <div className={style.outline}>
          <Setting/>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSetting;
