import { Routes, Route } from "react-router-dom";
// import Privacy from "../pages/PrivacyPolicy";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";
// import Question from "../pages/Question";
import { useContext } from "react";
import { UserContext } from "./UserContext";

// import Callback from './Callback'

//Admin Routes
import AdminEncouragements from "../admin/adminPages/AdminEncouragement";
import AdminUploadEncouragements from "../admin/adminPages/AdminUploadEncouragements";
import AdminMaterials from "../admin/adminPages/AdminMaterials";
import AdminUploadMaterials from "../admin/adminPages/AdminUploadMaterials";
import AdminQuestions from "../admin/adminPages/AdminQuestion";
import AdminUploadQuestions from "../admin/adminPages/AdminUploadQuestions";
import AdminRegister from "../admin/adminPages/AdminRegister";
import AdminLogin from "../admin/adminPages/AdminLogin";
import AdminTutors from "../admin/adminPages/AdminTutors";
import AdminHome from "../admin/adminPages/AdminHomePage";
import AdminStudents from "../admin/adminPages/AdminStudents";
import AdminStudentFeedback from "../admin/adminPages/AdminStudentFeedback";
import AdminSettings from "../admin/adminPages/AdminSettings";

//Student Routes
import StudentDashboard from "../student/studentPages/StudentDashboard";
import StudentLogin from "../student/studentPages/StudentLogin";
import StudentRegister from "../student/studentPages/StudentRegister";
import StudentSetting from "../student/studentPages/StudentSetting";
import StudentFeedback from "../student/studentPages/StudentFeedback";
import StudentMaterials from "../student/studentPages/StudentMaterials";
import StudentQuiz from "../student/studentPages/StudentQuiz";
import StudentStore from "../student/studentPages/StudentStore";

function Pages() {
  const { username, setUsername } = useContext(UserContext);
  // console.log("UserContext in Pages:", username, setUsername); // Check if undefined

  return (
    <div>
      <Routes>
        {/* Main website routes */}
        {/* <Route path="/question" element={<Question />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/auth/callback" element={<Callback/>}/> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */} */}

        {/* Admin Pages*/}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route
          path="/admin/student-feedbacks"
          element={<AdminStudentFeedback />}
        />
        <Route path="/admin/tutors" element={<AdminTutors />} />
        <Route path="/admin/encouragements" element={<AdminEncouragements />} />
        <Route
          path="/admin/upload-encouragements"
          element={<AdminUploadEncouragements />}
        />
        <Route path="/admin/materials" element={<AdminMaterials />} />
        <Route
          path="/admin/upload-materials"
          element={<AdminUploadMaterials />}
        />
        <Route path="/admin/questions" element={<AdminQuestions />} />
        <Route
          path="/admin/upload-questions"
          element={<AdminUploadQuestions />}
        />

        {/* Student Pages*/}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/" element={<StudentLogin />} />
        {/* <Route path="/student/login" element={<StudentLogin />} /> */}
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/settings" element={<StudentSetting />} />
        <Route path="/student/feedback" element={<StudentFeedback />} />
        <Route path="/student/materials" element={<StudentMaterials />} />
        <Route path="/student/quiz" element={<StudentQuiz />} />
        <Route path="/student/store" element={<StudentStore />} />
      </Routes>
    </div>
  );
}

export default Pages;
