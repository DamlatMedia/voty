import style from "../adminStyles/dashboard.module.css";

function UserVideos() {
  return (
    <>
      <div className={style.all}> 
        <h2>Popular Videos</h2>

        <div className={style.video}>
          <div className={style.feature}>
            <img
              src="/images/vidStu.png"
              alt="video"
              className={style.vidImage}
            />
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>

          <div className={style.feature}>
            <img
              src="/images/vidStu.png"
              alt="video"
              className={style.vidImage}
            />
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>

          <div className={style.feature}>
            <img
              src="/images/vidStu.png"
              alt="video"
              className={style.vidImage}
            />
            <p className={style.phTag}>Video Title</p>
            <p>
              Separated they live in Bookmarks grove right at the coast of the
              Semantic, a large language ocean. A small river name..
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserVideos;
