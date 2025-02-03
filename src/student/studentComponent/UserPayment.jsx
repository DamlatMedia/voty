import style from "../studentStyles/successful.module.css";

function UserPayment() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div className={style.success}>
        <div className={style.successDivs}>
          <p className={style.pay}>Make a Payment of #1000</p>
          <p className={style.thank}>
            Gain access to engaging more videos and exciting trvia games! Your
            payment of 31000 opens the door to a world of learning, fun and the
            chnace to win monthly scholarships. Join us today and take the first
            step toward personal growth and academic excellence.
          </p>

          <p className={style.start}>Proceed To Make Payment</p>
        </div>
      </div>
    </>
  );
}

export default UserPayment;
