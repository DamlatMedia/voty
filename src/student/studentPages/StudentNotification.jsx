import UserSideBar from "../studentComponent/UserSideBar";
import UserHeader from "../studentComponent/UserHeader";
import style from "../studentStyles/student.module.css";

function StudentNotification () {
    return (
        <div>
          {/* {loading ? (
            <p>Loading...</p>
          ) : username ? ( */}
          
              <div className={style.dashSide}>
                <UserSideBar />
                <UserHeader />
    
                <div className={style.dash}>
                  <p>Welcome to ScienceDive!</p>
                </div>
              </div>
        
          {/* ) : (
            <p>No user data available. Redirecting...</p>
          )} */}
        </div>
      );
}

export default StudentNotification;