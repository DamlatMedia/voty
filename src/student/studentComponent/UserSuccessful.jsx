import style from "../studentStyles/successful.module.css"

function UserSuccessful () {
    return (
<>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div className={style.success}>
<span className={`${style.close} material-symbols-outlined`}>close</span>
<div className={style.successDiv}>

<img src="/images/success.png" alt="success" />
<p className={style.pay}>Payment Successful</p>
<p className={style.thank}>Thank You For Your Payment Your Transaction Has Been Sucessfuly rocessed. You Now Have Access To Our Moral Videos and Trivia Games. Get Ready To Learn, Engage, And Win Scholarships! 🎉</p>
<p className={style.start}>Start Watching Moral Videos</p>
</div>
</div>
</>
    )

}

export default UserSuccessful