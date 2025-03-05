import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

//Home Routes
import Home from "../pages/Home";
import TriviaComponent from "../pages/TriviaComponent";
import TriviaForm from "../pages/TriviaForm";
import About from "../pages/About";
import Contact from "../pages/Contact";
import VideoUpload from "../pages/VideoUpload";
import VideoList from "../pages/VideoList";
import Leaderboard from "../pages/Leaderboard";
import UserRank from "../pages/UserRank";


//Admin Routes
import AdminRegister from "../admin/adminPages/AdminRegister";
import AdminLogin from "../admin/adminPages/AdminLogin";
import AdminDashboard from "../admin/adminPages/AdminHomePage";
import AdminUserManagement from "../admin/adminPages/AdminUserManagement";
import AdminContentManagement from "../admin/adminPages/AdminContentManagement";
import AdminNotification from "../admin/adminPages/AdminNotification";
import AdminNotificationForm from "../admin/adminComponents/AdminNotificationForm";
import AdminScholarshipManagement from "../admin/adminPages/AdminScholarshipManagement";


//Student Routes
import StudentLogin from "../student/studentPages/StudentLogin";
import StudentRegister from "../student/studentPages/StudentRegister";
import StudentDashboard from "../student/studentPages/StudentDashboard";
import StudentScholarship from "../student/studentPages/StudentScholarship";
import StudentTrivia from "../student/studentPages/StudentTrivia";
import StudentSetting from "../student/studentPages/StudentSetting";
import StudentVideos from "../student/studentPages/StudentVideos";
import StudentNotification from "../student/studentPages/StudentNotification";
import StudentQuizReview from "../student/studentComponent/UserQuizReview";
import StudentTriviaPage from "../student/studentPages/StudentTriviaPage";
// import Payment from "../components/Payment";

function Pages() {
  return (
    <div>
      <Routes>
        {/* Main website routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/video-upload" element={<VideoUpload />} />
        <Route path="/video-list" element={<VideoList />} />
        {/* <Route path="/trivia" element={<TriviaComponent />} /> */}
        <Route path="/trivia-form" element={<TriviaForm/>} />
        <Route path="/user-rank" element={<UserRank/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        {/* <Route path="/payment" element={<Payment />} /> */}

        {/* Admin Pages*/}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/user-management" element={<AdminUserManagement />}/>
        <Route path="/admin/content-management" element={<AdminContentManagement />}/>
        <Route path="/admin/scholarship-management" element={<AdminScholarshipManagement />}/>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/notification" element={<AdminNotification />} />
        <Route path="/admin/notification/form" element={<AdminNotificationForm />} />
        <Route path="/admin/register" element={<AdminRegister />} />
   
        {/* Student Pages*/}
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/videos" element={<StudentVideos />} />
        <Route path="/student/trivia" element={<StudentTrivia />} />
        <Route path="/student/trivia/page" element={<StudentTriviaPage />} />
        <Route path="/student/scholarship" element={<StudentScholarship />} />
        <Route path="/student/notification" element={<StudentNotification />} />
        <Route path="/student/setting" element={<StudentSetting />} />
        <Route path="/student/review" element={<StudentQuizReview />} />
      </Routes>
    </div>
  );
}

export default Pages;
