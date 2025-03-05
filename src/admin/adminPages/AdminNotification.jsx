import { useState } from "react";
import AdminSideBar from "../adminComponents/AdminSideBar";
import AdminHeader from "../adminComponents/AdminHeader";
import style from "../adminStyles/dashboard.module.css";
import AdminNotificationForm from "../adminComponents/AdminNotificationForm";
import AdminAllUserNotificationForm from "../adminComponents/AdminAllUserNotificationForm";
import Notifications from "../adminComponents/AdminNotificationHistory";
function AdminAllInvest() {
  // const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal visibility

  return (
    <>
       <div className={style.dash}>
      <div className={style.dashSide}>
        <div className={style.side}>
          <AdminSideBar />
        </div>

        <div className={style.home}>
          <AdminHeader />
          <div className={style.content}>
            <div >
              <div className={style.allInvest}>
                <p>List of All Notification</p>
                <button
                  className={style.newInvest}
                >
                  Upload A Notification
                </button>
              </div>
            </div>

            <AdminNotificationForm />
            <Notifications />
            
            <AdminAllUserNotificationForm />
          </div>
        </div>
        </div>
      </div>

     
    </>
  );
}

export default AdminAllInvest;
