import style from "../adminStyles/dashboard.module.css";

function UserTrivia() {
  return (
    <>
      <div className={style.all}>
        <h2>Popular Games</h2>

        <div className={style.triva}>
          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/money.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Economics</p>
              <p>Systems of Government</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/math.png" alt="math" />
              <p>Course</p>
              <p className={style.phTag}>Mathematics</p>
              <p>Linear Equations</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/english.png" alt="english" />
              <p>Course</p>
              <p className={style.phTag}>English Language</p>
              <p>Passive and Active Voice</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>

          <div className={style.trivDiv}>
            <div className={style.course}>
              <img src="/images/literature.png" alt="games" />
              <p>Course</p>
              <p className={style.phTag}>Literature-in-English</p>
              <p>Figures of Speech</p>
            </div>

            <div>
              <img src="/images/progress.png" alt="progres" />
            </div>
          </div>
       
        </div>
      </div>
    </>
  );
}

export default UserTrivia;
