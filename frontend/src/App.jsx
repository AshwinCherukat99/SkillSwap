import Login from './pages/user/login/Login' 
import {BrowserRouter,Routes,Route,Navigate,} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute' 
import PublicRoute from './components/PublicRoute'
import Feed from './pages/user/feed/Feed'
import Profile from './pages/user/profile/profile'
import MentorDashboard from './pages/mentor/dashboard/MentorDashboard'
import MentorLogin from './pages/mentor/login/MentorLogin' 
import Home from './pages/Home' 
import Register from './pages/user/register/Register'
import VerifyEmail from './pages/user/verify_email/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword' 
import ResetPassword from './pages/ResetPassword'
import AdminLogin from './pages/AdminLogin'
import MentorRegister from './pages/mentor/register/MentorRegister'
import MentorVerifyEmail from './pages//mentor/verify_email/MentorVerifyEmail' 
import MentorForgotPassword from './pages/mentor/forgot_password/MentorForgotPassword'  
import MentorResetPassword from './pages/mentor/reset_password/MentorResetPassword'
import AdminDashboard from './pages/admin/dashboard/AdminDashboard'
import MentorVerification from './pages/MentorVerification'
import SkillsWant from './pages/SkillsWant'
import SkillsOffer from './pages/SkillsOffer'
import MentorProtectedRoute from './MentorProtectedRoute'
import MentorPublicRoute from './MentorPublicRoute'
import AdminProtectedRoute from './AdminProtectedRoute'
import MySkills from './pages/user/my_skills/my_skills'
import FindMentors from './pages/user/find_mentors/FindMentors'
import MentorProfile from './pages/user/mentor_profile/MentorProfile'
import EditProfile from './pages/user/edit_profile/edit_profile'
import Skills_Offer from './pages/user/skills_offer/Skills_Offer'
import Skills_Want from './pages/user/skills_want/Skills_Want'
import Recommendations from './pages/user/recommendations/Recommendations'
import MyPosts from './pages/user/my_posts/MyPosts'
import Notifications from './pages/user/notifications/Notifications'
import Badges from './pages/user/badges/Badges'
import LeaderBoard from './pages/user/leaderboard/LeaderBoard'
import MentorEditProfile from './pages/mentor/edit_profile/MentorEditProfile'
import MainLayout from './layouts/MainLayout'
import MentorGroupChat from './pages/mentor/group_chat/MentorGroupChat'
import MentorCourseManagement from './pages/mentor/course_mgmt/MentorCourseManagement'
import MentorStudents from './pages/mentor/student_mgmt/MentorStudents'  
import MentorRevenue from './pages/mentor/revenue_mgmt/MentorRevenue'
import MentorReviews from './pages/mentor/reviews/MentorReviews'
import CreateCourse from './pages/mentor/create_course/CreateCourse'
import SessionHistory from './pages/user/session_history/SessionHistory'
import UpcomingSessions from './pages/user/upcoming_sessions/UpcomingSessions'
import MentorCourseDetail from './pages/mentor/course_detail/MentorCourseDetail'
import MentorUpcomingSessions from './pages/mentor/upcoming_sessions/MentorUpcomingSessions'
import Friends from './pages/user/friends/Friends'
import Courses from './pages/user/courses/Courses'
import Certificates from './pages/user/certificates/Certificates'
import CourseDetail from './pages/user/course_detail/CourseDetail'
import DocumentVerification from './pages/admin/document_verification/DocumentVerification'
import MentorSessionHistory from './pages/mentor/session_history/MentorSessionHistory'
import Chat from './pages/user/chat/Chat'
import VerificationList from './pages/admin/verification_list/VerificationList'
import NotificationManagement from './pages/admin/notif_mgmt/NotificationManagement'
import EditCourse from './pages/mentor/edit_course/EditCourse'
import AdminCourseManagement from './pages/admin/course_mgmt/AdminCourseManagement'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <Home/>
        }
        />
        <Route path='/login/' element={
          <PublicRoute>
            <Login/>
          </PublicRoute>
          }/>
          <Route path='/forgot-password/' element={
            <ForgotPassword/>
          }/>
          <Route path='/reset-password/' element={
            <ResetPassword/>
          }/>
        <Route path='/register' element={
          <PublicRoute>
            <Register/>
          </PublicRoute>
        }/>
        <Route path='/verify-email/' element={
          <VerifyEmail/>
        }/>
        <Route path='/skills/want/' element={
          <ProtectedRoute>
            <SkillsWant/>
          </ProtectedRoute>
        }/>
        <Route path='/skills/offer/' element={
          <ProtectedRoute>
            <SkillsOffer/>
          </ProtectedRoute>
        }/>
      <Route element={<MainLayout/>}>
        <Route path='/feed/' element={
          <ProtectedRoute>
            <Feed />
        </ProtectedRoute>  
        }/>
        <Route path='/profile/' element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }/>
        <Route path='/profile/edit/' element={
          <ProtectedRoute>
            <EditProfile/>
          </ProtectedRoute>
        }/>
        <Route path='/my_skills/' element={
          <ProtectedRoute>
            <MySkills/>
          </ProtectedRoute>
        }/>
        <Route path='/my_skills/offer/' element={
          <ProtectedRoute>
            <Skills_Offer/>
          </ProtectedRoute>
        }/>
        <Route path='/my_skills/want/' element={
          <ProtectedRoute>
            <Skills_Want/>
          </ProtectedRoute>
        }/>
        <Route path='/mentors/' element={
          <ProtectedRoute>
            <FindMentors/>
          </ProtectedRoute>
        }/>
        <Route path='/mentors/mentor-profile/:mentorId' element={
          <ProtectedRoute>
            <MentorProfile/>
          </ProtectedRoute>
        }/>
        <Route path='/recommendations/' element={
          <ProtectedRoute>
            <Recommendations/>
          </ProtectedRoute>
        }/>
        <Route path='/my_posts/' element={
          <ProtectedRoute>
            <MyPosts/>
          </ProtectedRoute>
        }/>
        <Route path='/notifications/' element={
          <ProtectedRoute>
            <Notifications/>
          </ProtectedRoute>
        }/>
        <Route path='/badges/' element={
          <ProtectedRoute>
            <Badges/>
          </ProtectedRoute>
        }/>
        <Route path='/leaderboard/' element={
          <ProtectedRoute>
            <LeaderBoard/>
          </ProtectedRoute>
        }/>
        <Route path='/session_history/' element={
          <ProtectedRoute>
            <SessionHistory/>
          </ProtectedRoute>
        }/>   
        <Route path='/upcoming_sessions/' element={
          <ProtectedRoute>
            <UpcomingSessions/>
          </ProtectedRoute>
        }/>
        <Route path='/friends/' element={
          <ProtectedRoute>
            <Friends/>
          </ProtectedRoute>
        }/>
        <Route path='/courses/' element={
          <ProtectedRoute>
            <Courses/>
          </ProtectedRoute>
        }/>
        <Route path='/certificates/' element={
          <ProtectedRoute>
            <Certificates/>
          </ProtectedRoute>
        }/>
        <Route path='/courses/:courseId' element={
          <ProtectedRoute>
            <CourseDetail/>
          </ProtectedRoute>
        }/>
        <Route path='/chat' element={
          <ProtectedRoute>
            <Chat/>
          </ProtectedRoute>
        }/>
        </Route>
        <Route path='/mentor/login/' element={
          <MentorPublicRoute>
            <MentorLogin/>
          </MentorPublicRoute>
        }/>
        <Route path='/mentor/register/' element={
          <MentorRegister/>
        }/>
        <Route path='/mentor/verify-email/' element={
          <MentorVerifyEmail/>
        }/>
        <Route path='/mentor/forgot-password/' element={
          <MentorForgotPassword/>
        }/>
        <Route path='/mentor/reset-password/' element={
          <MentorResetPassword/>
        }/>
        <Route path='/mentor/dashboard/' element={
          <MentorProtectedRoute>
            <MentorDashboard/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/profile/' element={
          <MentorProtectedRoute>
            <MentorEditProfile/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/group-chat/' element={
          <MentorProtectedRoute>
            <MentorGroupChat/>
          </MentorProtectedRoute>
        }/>     
        <Route path='/mentor/courses/' element={
          <MentorProtectedRoute>
            <MentorCourseManagement/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/students/' element={
          <MentorProtectedRoute>
            <MentorStudents/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/revenue/' element={
          <MentorProtectedRoute>
            <MentorRevenue/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/reviews/' element={
          <MentorProtectedRoute>
            <MentorReviews/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/courses/create_course/' element={
          <MentorProtectedRoute>
            <CreateCourse/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/courses/:courseId/' element={
          <MentorProtectedRoute>
            <MentorCourseDetail/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/upcoming_sessions/' element={
          <MentorProtectedRoute>
            <MentorUpcomingSessions/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/session_history/' element={
          <MentorProtectedRoute>
            <MentorSessionHistory/>
          </MentorProtectedRoute>
        }/>
        <Route path='/mentor/courses/:courseId/edit' element={
          <MentorProtectedRoute>
            <EditCourse/>
          </MentorProtectedRoute>
        }/>
        <Route path='/admin/login/' element={
          <AdminLogin/>
        }/>
        <Route path='/admin/dashboard/' element={
          <AdminProtectedRoute>
            <AdminDashboard/>
          </AdminProtectedRoute>
        }/>
        <Route path='/admin/mentor-verification/:mentorId/documents/' element={
          <AdminProtectedRoute>
            <DocumentVerification/>
          </AdminProtectedRoute>
        }/>
        <Route path='/admin/verification-list' element={
          <AdminProtectedRoute>
            <VerificationList/>
          </AdminProtectedRoute>
        }/>
        <Route path='/admin/notification-management' element={
          <AdminProtectedRoute>
            <NotificationManagement/>
          </AdminProtectedRoute>
        }/>
        <Route path='/admin/course-management' element={
          <AdminProtectedRoute>
            <AdminCourseManagement/>
          </AdminProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App