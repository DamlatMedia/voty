import React, { useEffect, useState } from "react";
// import style from "../styles/usernotification.module.css";
import axios from "axios";
import style from "../studentStyles/dashboard.module.css";

function UserNotification() {
  const [notifications, setNotifications] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("authToken");

  // useEffect(() => {
  //   const markAllAsRead = async () => {
  //     try {
  //       await axios.put(
  //         `${process.env.REACT_APP_API_BASE_URL}/api/notification/${username}/mark-read`,
  //         {},
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       console.log("Notifications marked as read");
  //     } catch (error) {
  //       console.error("Error marking notifications as read:", error);
  //     }
  //   };

  //   markAllAsRead();
  // }, [username]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/notification/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [username]);
  return (
    <>
      <div className={style.all}>
        <div className={style.notiWeeks}>
          <select name="" id="" className={style.notiWeek}>
            <option value="">This Week</option>
            <option value="">This Week</option>
            <option value="">This Week</option>
            <option value="">This Week</option>
          </select>
        </div>

        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.notificationId || index}>
              <div className={style.lead}>
                <div className={style.leaderN}>
                  <div className={style.profileName}>
                    <img
                      src="/images/logo.jpg"
                      alt="logo"
                      className={style.logs}
                    />

                    <div className={style.name}>
                      <p className={style.h4}>{notification.title}</p>
                      <p>{notification.update}</p>
                    </div>
                  </div>

                  <h4>{notification.date}</h4>
                </div>
              </div>
              {expandedRow === index && (
                <div className={style.expandedDetails}>
                  <p>
                    <strong>Notification ID:</strong> {notification._id}
                  </p>
                  <p>
                    <strong>Title:</strong> {notification.title}
                  </p>
                  <p>
                    <strong>Update:</strong> {notification.update}
                  </p>
                  <p>
                    <strong>Description:</strong> {notification.description}
                  </p>
                  <p>
                    <strong>Date:</strong> {notification.date}
                  </p>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <p colSpan="6">No notifications found</p>
        )}
{/*
         <div className={style.leaderN}>
            <div className={style.profileName}>
              <img src="/images/logo.jpg" alt="logo"  className={style.logs}/>
          
              <div className={style.name}>
                <p className={style.h4}>New Moral Video Available</p>
                <p>A new trivia has been uploaded: Trivia Game! Take now</p>
              </div>
            </div>

            <h4>May 10: 1:30pm</h4>
          </div>

          <div className={style.leaderN}>
            <div className={style.profileName}>
              <img src="/images/logo.jpg" alt="logo"  className={style.logs}/>
          
              <div className={style.name}>
                <p className={style.h4}>New Moral Video Available</p>
                <p>A new trivia has been uploaded: Trivia Game! Take now</p>
              </div>
            </div>

            <h4>May 10: 1:30pm</h4>
          </div>

          <div className={style.leaderN}>
            <div className={style.profileName}>
              <img src="/images/logo.jpg" alt="logo"  className={style.logs}/>
          
              <div className={style.name}>
                <p className={style.h4}>New Moral Video Available</p>
                <p>A new trivia has been uploaded: Trivia Game! Take now</p>
              </div>
            </div>

            <h4>May 10: 1:30pm</h4>
          </div>

          <div className={style.leaderN}>
            <div className={style.profileName}>
              <img src="/images/logo.jpg" alt="logo"  className={style.logs}/>
          
              <div className={style.name}>
                <p className={style.h4}>New Moral Video Available</p>
                <p>A new trivia has been uploaded: Trivia Game! Take now</p>
              </div>
            </div>

            <h4>May 10: 1:30pm</h4>
          </div>

          <div className={style.leaderN}>
            <div className={style.profileName}>
              <img src="/images/logo.jpg" alt="logo"  className={style.logs}/>
          
              <div className={style.name}>
                <p className={style.h4}>New Moral Video Available</p>
                <p>A new trivia has been uploaded: Trivia Game! Take now</p>
              </div>
            </div>

            <h4>May 10: 1:30pm</h4>
          </div>

          <div className={style.leaderN}>
            <div className={style.profileName}>
              <img src="/images/logo.jpg" alt="logo"  className={style.logs}/>
          
              <div className={style.name}>
                <p className={style.h4}>New Moral Video Available</p>
                <p>A new trivia has been uploaded: Trivia Game! Take now</p>
              </div>
            </div>

            <h4>May 10: 1:30pm</h4>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default UserNotification;
