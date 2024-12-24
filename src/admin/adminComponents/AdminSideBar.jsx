import {NavLink} from 'react-router-dom'
import style from '../adminStyles/Admin.module.css'

function AdminSideBar() {
  return <div className={style.bar}>
    
    {/* <img src='/images/logo.png' alt="img" className={style.logos}/> */}
   
    <nav className={style.sideHeader}>
    
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

                <ul className={style.navUl}>
                    <li className={style.navLi} ><NavLink to='/admin/home'><span class="material-symbols-outlined">home</span>Home</NavLink></li>
                    <li className={style.navLi}><NavLink  to='/admin/students' ><span class="material-symbols-outlined">group</span>Students</NavLink></li>
                    <li className={style.navLi}><NavLink  to='/admin/student-feedbacks' ><span class="material-symbols-outlined">person</span>Student Feedbacks</NavLink></li>
                    <li className={style.navLi}><NavLink  to='/admin/tutors' ><span class="material-symbols-outlined">person</span>Tutors</NavLink></li>
                    <li className={style.navLi}><NavLink to='/admin/questions'><span class="material-symbols-outlined">upload</span>Questions</NavLink></li>
                    <li className={style.navLi}><NavLink to='/admin/upload-questions'><span class="material-symbols-outlined">upload</span>Upload Questions</NavLink></li>
                    <li className={style.navLi}><NavLink to='/admin/materials'><span class="material-symbols-outlined">rss_feed</span>Materials</NavLink></li>
                    <li className={style.navLi}><NavLink to='/admin/upload-materials'><span class="material-symbols-outlined">rss_feed</span>Upload Materials</NavLink></li>
                    <li className={style.navLi}><NavLink to='/admin/encouragements'><span class="material-symbols-outlined">upload</span>Encouragements Resources</NavLink></li>
                    <li className={style.navLi}><NavLink to='/admin/upload-encouragements'><span class="material-symbols-outlined">upload</span>Upload Encouragements</NavLink></li>
                    <li className={style.navLi}><NavLink to='/admin/settings'><span class="material-symbols-outlined">settings</span>Profile Settings</NavLink></li>
                    <li className={style.navLi}><NavLink to='/admin/login'><span class="material-symbols-outlined">logout</span>Logout</NavLink></li>
                </ul>
            </nav>
 </div>;
}

export default AdminSideBar;
