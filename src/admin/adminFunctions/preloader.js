// Preloader function to be displayed when loading data from the database
import style from '../../admin/adminStyles/Admin.module.css'
export const Preloader = () => {
    return (
      <div className="preloader">
        {/* Ensure the image path is correct */}
        {/* <img className="preloader-image" src="/images/logo.png" alt="Loading..." /> */}
        <p className={style.preloader}>Loading..</p>
      </div>
    );
  };
  