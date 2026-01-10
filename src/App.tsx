
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Mission from './pages/Mission';
import Leadership from './pages/Leadership';
import ServiceTimes from './pages/ServiceTimes';
import Contact from './pages/Contact';
import PlanVisit from './pages/PlanVisit';
import Events from './pages/Events';
import Newcomers from './pages/Newcomers';
import PrayerRequests from './pages/PrayerRequests';
import Sermons from './pages/Sermons';
import DecisionCards from './pages/DecisionCards';
import Feedback from './pages/Feedback';
import News from './pages/News';
import TestimonyCards from './pages/TestimonyCards';
import EventDetail from './pages/EventDetail';
import Groups from './pages/Groups';
import Give from './pages/Give';
import Volunteer from './pages/Volunteer';
import Salvation from './pages/Salvation';
import NeedPrayer from './pages/NeedPrayer';
import Baptism from './pages/Baptism';
import { StoreProvider } from './context/StoreContext';
import CartSidebar from './components/store/CartSidebar';
import StoreHome from './pages/store/StoreHome';
import ProductDetail from './pages/store/ProductDetail';
import Checkout from './pages/store/Checkout';
import OrderSuccess from './pages/store/OrderSuccess';
import BibleStudyHome from './pages/bible-study/BibleStudyHome';
import StudyGuideDetail from './pages/bible-study/StudyGuideDetail';
import UserDashboard from './pages/bible-study/UserDashboard';
import SEOHead from './components/SEOHead';

// Admin Imports
import AdminRoute from './components/store/AdminRoute';
import AdminLogin from './pages/store/admin/AdminLogin';
import AdminLayout from './pages/store/admin/AdminLayout';
import AdminDashboard from './pages/store/admin/AdminDashboard';
import ProductManager from './pages/store/admin/ProductManager';
import OrderManager from './pages/store/admin/OrderManager';
import BibleStudyManager from './pages/store/admin/BibleStudyManager';
import SEOManager from './pages/store/admin/SEOManager';
import VolunteerManager from './pages/store/admin/VolunteerManager';

// Volunteer Imports
import VolunteerLogin from './pages/volunteer/VolunteerLogin';
import VolunteerRoute from './components/volunteer/VolunteerRoute';
import VolunteerLayout from './layouts/VolunteerLayout';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerTasks from './pages/volunteer/VolunteerTasks';
import VolunteerSchedule from './pages/volunteer/VolunteerSchedule';
import VolunteerResources from './pages/volunteer/VolunteerResources';
import VolunteerMessages from './pages/volunteer/VolunteerMessages';

// Super Admin Imports
import SuperAdminRoute from './components/admin/SuperAdminRoute';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminLogin from './pages/admin/super/SuperAdminLogin';
import SuperAdminDashboard from './pages/admin/super/Dashboard';
import UserManager from './pages/admin/super/users/UserManager';
import AnalyticsDashboard from './pages/admin/super/analytics/AnalyticsDashboard';
import ActivityLogViewer from './pages/admin/super/analytics/ActivityLogViewer';
import AnnouncementManager from './pages/admin/super/content/AnnouncementManager';
import GroupManager from './pages/admin/super/content/GroupManager';
import SystemSettings from './pages/admin/super/settings/SystemSettings';
import AdminSetup from './pages/admin/super/AdminSetup';
import PortalManager from './pages/admin/super/portals/PortalManager';

// Youth Portal Imports
import YouthLogin from './pages/youth/YouthLogin';
import YouthRoute from './components/youth/YouthRoute';
import YouthLayout from './layouts/YouthLayout';
import YouthDashboard from './pages/youth/YouthDashboard';
import YouthEvents from './pages/youth/YouthEvents';
import YouthGroups from './pages/youth/YouthGroups';
import YouthChat from './pages/youth/YouthChat';
import YouthResources from './pages/youth/YouthResources';
import YouthLeaderPanel from './pages/youth/YouthLeaderPanel';

// Women of Faith (Esther) Portal Imports
import EstherLogin from './pages/esther/EstherLogin';
import EstherRoute from './components/esther/EstherRoute';
import EstherLayout from './layouts/EstherLayout';
import EstherDashboard from './pages/esther/EstherDashboard';
import EstherDevotionals from './pages/esther/EstherDevotionals';
import EstherEvents from './pages/esther/EstherEvents';
import EstherGroups from './pages/esther/EstherGroups';
import EstherForum from './pages/esther/EstherForum';
import EstherResources from './pages/esther/EstherResources';

// Men's Fellowship Portal Imports
import MenLogin from './pages/men/MenLogin';
import MenRoute from './components/men/MenRoute';
import MenLayout from './layouts/MenLayout';
import MenDashboard from './pages/men/MenDashboard';
import MenEvents from './pages/men/MenEvents';
import MenAnnouncements from './pages/men/MenAnnouncements';
import MenGroups from './pages/men/MenGroups';
import MenForum from './pages/men/MenForum';
import MenResources from './pages/men/MenResources';

// Worship & Choir Portal Imports
import WorshipLogin from './pages/worship/WorshipLogin';
import WorshipRoute from './components/worship/WorshipRoute';
import WorshipLayout from './layouts/WorshipLayout';
import WorshipDashboard from './pages/worship/WorshipDashboard';
import WorshipEvents from './pages/worship/WorshipEvents';
import WorshipAnnouncements from './pages/worship/WorshipAnnouncements';
import WorshipLibrary from './pages/worship/WorshipLibrary';
import WorshipTeam from './pages/worship/WorshipTeam';

// Ushering Portal Imports


// Hospitality Portal Imports
import HospitalityLogin from './pages/hospitality/HospitalityLogin';
import HospitalityRoute from './components/hospitality/HospitalityRoute';
import HospitalityLayout from './layouts/HospitalityLayout';
import HospitalityDashboard from './pages/hospitality/HospitalityDashboard';
import HospitalitySchedule from './pages/hospitality/HospitalitySchedule';
import HospitalityEvents from './pages/hospitality/HospitalityEvents';
import HospitalityAnnouncements from './pages/hospitality/HospitalityAnnouncements';
import HospitalityTeam from './pages/hospitality/HospitalityTeam';

// Prayer Portal Imports
import PrayerLogin from './pages/prayer/PrayerLogin';
import PrayerRoute from './components/prayer/PrayerRoute';
import PrayerLayout from './layouts/PrayerLayout';
import PrayerDashboard from './pages/prayer/PrayerDashboard';
import PrayerSchedule from './pages/prayer/PrayerSchedule';
import PrayerEvents from './pages/prayer/PrayerEvents';
import PrayerAnnouncements from './pages/prayer/PrayerAnnouncements';
import PrayerTeam from './pages/prayer/PrayerTeam';

import MediaLogin from './pages/media/MediaLogin';
import MediaRoute from './components/media/MediaRoute';
import MediaLayout from './layouts/MediaLayout';
import MediaDashboard from './pages/media/MediaDashboard';
import MediaSchedule from './pages/media/MediaSchedule';
import MediaResources from './pages/media/MediaResources';
import MediaEquipment from './pages/media/MediaEquipment';
import MediaAnnouncements from './pages/media/MediaAnnouncements';
import MediaTeam from './pages/media/MediaTeam';
import MediaEvents from './pages/media/MediaEvents';

import EvangelismLogin from './pages/evangelism/EvangelismLogin';
import EvangelismRoute from './components/evangelism/EvangelismRoute';
import EvangelismLayout from './layouts/EvangelismLayout';
import EvangelismDashboard from './pages/evangelism/EvangelismDashboard';
import EvangelismSchedule from './pages/evangelism/EvangelismSchedule';
import EvangelismFollowUp from './pages/evangelism/EvangelismFollowUp';
import EvangelismTestimonies from './pages/evangelism/EvangelismTestimonies';
import EvangelismAnnouncements from './pages/evangelism/EvangelismAnnouncements';
import EvangelismTeam from './pages/evangelism/EvangelismTeam';
import EvangelismEvents from './pages/evangelism/EvangelismEvents';

// Ushering Portal Imports
import UsherLogin from './pages/ushering/UsherLogin';
import UsherRoute from './components/ushering/UsherRoute';
import UsherLayout from './layouts/UsherLayout';
import UsherDashboard from './pages/ushering/UsherDashboard';
import UsherSchedule from './pages/ushering/UsherSchedule';
import UsherAttendance from './pages/ushering/UsherAttendance';
import UsherOffering from './pages/ushering/UsherOffering';
import UsherStock from './pages/ushering/UsherStock';
import UsherAnnouncements from './pages/ushering/UsherAnnouncements';
import UsherTeam from './pages/ushering/UsherTeam';



// Member Portal Imports
import MemberLogin from './pages/members/MemberLogin';
import MemberRoute from './components/members/MemberRoute';
import MemberLayout from './layouts/MemberLayout';
import MemberDashboard from './pages/members/MemberDashboard';
import GivingHistory from './pages/members/GivingHistory';
import GiftAid from './pages/members/GiftAid';

import MemberGroups from './pages/members/Groups';
import CheckIn from './pages/members/CheckIn';
import MemberNews from './pages/members/MemberNews';
import Appointments from './pages/members/Appointments';

import HouseLayout from './layouts/HouseLayout';
import HouseDashboard from './pages/members/house/HouseDashboard';
import HouseAttendance from './pages/members/house/Attendance';
import HouseOfferings from './pages/members/house/Offerings';
import HouseEvents from './pages/members/house/Events';
import HouseChat from './pages/members/house/Chat';
import HouseResources from './pages/members/house/Resources';

// Children's Portal Imports
import ChildrenLogin from './pages/children/ChildrenLogin';
import ChildrenRoute from './components/children/ChildrenRoute';
import ChildrenLayout from './layouts/ChildrenLayout';
import ChildrenDashboard from './pages/children/ChildrenDashboard';
import ChildDirectory from './pages/children/ChildDirectory';
import ChildProfile from './pages/children/ChildProfile';
import Attendance from './pages/children/Attendance';
import LessonManager from './pages/children/Lessons';
import EventPlanner from './pages/children/Events';
import IncidentReport from './pages/children/Incidents';
import PhotoGallery from './pages/children/Gallery';
import ParentMessaging from './pages/children/Messaging';

// Finance Portal Imports
import FinanceLogin from './pages/finance/FinanceLogin';
import FinanceRoute from './components/finance/FinanceRoute';
import FinanceLayout from './layouts/FinanceLayout';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import FinanceIncome from './pages/finance/Income';
import FinanceBanking from './pages/finance/Banking';
import FinanceExpenses from './pages/finance/Expenses';
import FinanceInvoices from './pages/finance/Invoices';
import FinanceIOUs from './pages/finance/IOUs';
import FinanceBudget from './pages/finance/Budget';
import FinanceReports from './pages/finance/Reports';

// Life Discussion (Sunday School) Portal Imports
import LifeDiscussionLogin from './pages/life-discussion/LifeDiscussionLogin';
import LifeDiscussionRoute from './components/life-discussion/LifeDiscussionRoute';
import LifeDiscussionLayout from './layouts/LifeDiscussionLayout';
import LifeDiscussionDashboard from './pages/life-discussion/LifeDiscussionDashboard';
import LifeTeacherRota from './pages/life-discussion/teachers/LifeTeacherRota';
import LifeGroupManager from './pages/life-discussion/teachers/LifeGroupManager';
import LifeAttendanceTeacher from './pages/life-discussion/attendance/LifeAttendanceTeacher';
import LifeAttendanceStudent from './pages/life-discussion/attendance/LifeAttendanceStudent';
import LifeAttendanceReports from './pages/life-discussion/attendance/LifeAttendanceReports';
import LifeAssignmentsTeacher from './pages/life-discussion/learning/LifeAssignmentsTeacher';
import LifeAssignmentsStudent from './pages/life-discussion/learning/LifeAssignmentsStudent';
import LifeAnnouncements from './pages/life-discussion/announcements/LifeAnnouncements';
import LifeResources from './pages/life-discussion/resources/LifeResources';

// Admin Imports
import MemberManager from './pages/store/admin/MemberManager';

import { SearchProvider } from './context/SearchContext';
import SearchOverlay from './components/SearchOverlay';

// Ministry Landing Pages
import ChildrensChurch from './pages/ministries/ChildrensChurch';
import YouthMinistry from './pages/ministries/YouthMinistry';
import WomenOfFaith from './pages/ministries/WomenOfFaith';
import MensFellowship from './pages/ministries/MensFellowship';
import WorshipChoir from './pages/ministries/WorshipChoir';
import Evangelism from './pages/ministries/Evangelism';
import MediaTech from './pages/ministries/MediaTech';
import PrayerTeamPage from './pages/ministries/PrayerTeam';
import UsheringHospitality from './pages/ministries/UsheringHospitality';

function App() {
  return (
    <div className="antialiased">
      <StoreProvider>
        <SearchProvider>
          <SEOHead />
          <CartSidebar />
          <SearchOverlay />
          <Routes>
            {/* Public Routes with Main Layout */}
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/ministries" element={<Ministries />} />
              <Route path="/ministries/children" element={<ChildrensChurch />} />
              <Route path="/ministries/youth" element={<YouthMinistry />} />
              <Route path="/ministries/women" element={<WomenOfFaith />} />
              <Route path="/ministries/men" element={<MensFellowship />} />
              <Route path="/ministries/worship" element={<WorshipChoir />} />
              <Route path="/ministries/evangelism" element={<Evangelism />} />
              <Route path="/ministries/media" element={<MediaTech />} />
              <Route path="/ministries/prayer" element={<PrayerTeamPage />} />
              <Route path="/ministries/hosting" element={<UsheringHospitality />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/services" element={<ServiceTimes />} />
              {/* Super Admin Routes */}
              <Route path="/super-admin/*" element={<Navigate to="/admin/super/dashboard" replace />} />
              <Route path="/admin/super/login" element={<SuperAdminLogin />} />
              <Route path="/admin/super/setup" element={<AdminSetup />} />
              <Route element={<SuperAdminRoute />}>
                <Route path="/admin/super" element={<SuperAdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                  <Route path="users" element={<UserManager />} />
                  <Route path="analytics" element={<AnalyticsDashboard />} />
                  <Route path="logs" element={<ActivityLogViewer />} />
                  <Route path="announcements" element={<AnnouncementManager />} />
                  <Route path="groups" element={<GroupManager />} />
                  <Route path="portals" element={<PortalManager />} />
                  <Route path="settings" element={<SystemSettings />} />
                  {/* Future routes: content, etc. */}
                </Route>
              </Route>

              {/* Youth Portal Routes */}
              <Route path="/youth/login" element={<YouthLogin />} />
              <Route element={<YouthRoute />}>
                <Route path="/youth" element={<YouthLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<YouthDashboard />} />
                  <Route path="events" element={<YouthEvents />} />
                  <Route path="groups" element={<YouthGroups />} />
                  <Route path="chat" element={<YouthChat />} />
                  <Route path="media" element={<YouthResources />} />
                  <Route path="leader" element={<YouthLeaderPanel />} />
                  {/* Future routes: chat, etc. */}
                </Route>
              </Route>

              {/* Women of Faith (Esther) Portal Routes */}
              <Route path="/esther/login" element={<EstherLogin />} />
              <Route element={<EstherRoute />}>
                <Route path="/esther" element={<EstherLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<EstherDashboard />} />
                  <Route path="devotionals" element={<EstherDevotionals />} />
                  <Route path="events" element={<EstherEvents />} />
                  <Route path="groups" element={<EstherGroups />} />
                  <Route path="forum" element={<EstherForum />} />
                  <Route path="resources" element={<EstherResources />} />
                </Route>
              </Route>

              {/* Men's Fellowship Portal Routes */}
              <Route path="/men/login" element={<MenLogin />} />
              <Route element={<MenRoute />}>
                <Route path="/men" element={<MenLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<MenDashboard />} />
                  <Route path="events" element={<MenEvents />} />
                  <Route path="announcements" element={<MenAnnouncements />} />
                  <Route path="groups" element={<MenGroups />} />
                  <Route path="forum" element={<MenForum />} />
                  <Route path="resources" element={<MenResources />} />
                </Route>
              </Route>

              {/* Worship & Choir Portal Routes */}
              <Route path="/worship/login" element={<WorshipLogin />} />
              <Route element={<WorshipRoute />}>
                <Route path="/worship" element={<WorshipLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<WorshipDashboard />} />
                  <Route path="events" element={<WorshipEvents />} />
                  <Route path="announcements" element={<WorshipAnnouncements />} />
                  <Route path="library" element={<WorshipLibrary />} />
                  <Route path="team" element={<WorshipTeam />} />
                </Route>
              </Route>



              {/* Hospitality Portal Routes */}
              <Route path="/hospitality/login" element={<HospitalityLogin />} />
              <Route element={<HospitalityRoute />}>
                <Route path="/hospitality" element={<HospitalityLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<HospitalityDashboard />} />
                  <Route path="referrals" element={<HospitalitySchedule />} />
                  {/* Using 'referrals' path to match navigation item, though component is Schedule */}
                  <Route path="events" element={<HospitalityEvents />} />
                  <Route path="announcements" element={<HospitalityAnnouncements />} />
                  <Route path="team" element={<HospitalityTeam />} />
                </Route>
              </Route>

              {/* Prayer Portal Routes */}
              <Route path="/prayer/login" element={<PrayerLogin />} />
              <Route element={<PrayerRoute />}>
                <Route path="/prayer" element={<PrayerLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<PrayerDashboard />} />
                  <Route path="schedule" element={<PrayerSchedule />} />
                  <Route path="events" element={<PrayerEvents />} />
                  <Route path="requests" element={<PrayerRequests />} />
                  <Route path="announcements" element={<PrayerAnnouncements />} />
                  <Route path="team" element={<PrayerTeam />} />
                </Route>
              </Route>

              {/* Media Portal Routes */}
              <Route path="/media/login" element={<MediaLogin />} />
              <Route element={<MediaRoute />}>
                <Route path="/media" element={<MediaLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<MediaDashboard />} />
                  <Route path="schedule" element={<MediaSchedule />} />
                  <Route path="resources" element={<MediaResources />} />
                  <Route path="equipment" element={<MediaEquipment />} />
                  <Route path="announcements" element={<MediaAnnouncements />} />
                  <Route path="team" element={<MediaTeam />} />
                  <Route path="events" element={<MediaEvents />} />
                </Route>
              </Route>

              {/* Evangelism Portal Routes */}
              <Route path="/evangelism/login" element={<EvangelismLogin />} />
              <Route element={<EvangelismRoute />}>
                <Route path="/evangelism" element={<EvangelismLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<EvangelismDashboard />} />
                  <Route path="schedule" element={<EvangelismSchedule />} />
                  <Route path="followup" element={<EvangelismFollowUp />} />
                  <Route path="testimonies" element={<EvangelismTestimonies />} />
                  <Route path="announcements" element={<EvangelismAnnouncements />} />
                  <Route path="team" element={<EvangelismTeam />} />
                  <Route path="events" element={<EvangelismEvents />} />
                </Route>
              </Route>

              {/* Ushering Portal Routes */}
              <Route path="/ushering/login" element={<UsherLogin />} />
              <Route element={<UsherRoute />}>
                <Route path="/ushering" element={<UsherLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<UsherDashboard />} />
                  <Route path="schedule" element={<UsherSchedule />} />
                  <Route path="attendance" element={<UsherAttendance />} />
                  <Route path="offering" element={<UsherOffering />} />
                  <Route path="stock" element={<UsherStock />} />
                  <Route path="announcements" element={<UsherAnnouncements />} />
                  <Route path="team" element={<UsherTeam />} />
                  {/* Future routes: events */}
                </Route>
              </Route>



              <Route path="/contact" element={<Contact />} />
              <Route path="/plan-visit" element={<PlanVisit />} />

              {/* Life Discussion Portal Routes */}
              <Route path="/life-discussion/login" element={<LifeDiscussionLogin />} />
              <Route element={<LifeDiscussionRoute />}>
                <Route path="/life-discussion" element={<LifeDiscussionLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<LifeDiscussionDashboard />} />
                  <Route path="rota" element={<LifeTeacherRota />} />
                  <Route path="classes" element={<LifeGroupManager />} />
                  <Route path="attendance" element={<LifeAttendanceTeacher />} />
                  <Route path="my-attendance" element={<LifeAttendanceStudent />} />
                  <Route path="reports" element={<LifeAttendanceReports />} />
                  <Route path="assignments" element={<LifeAssignmentsTeacher />} />
                  <Route path="assignments/new" element={<LifeAssignmentsTeacher />} />
                  <Route path="my-assignments" element={<LifeAssignmentsStudent />} />
                  <Route path="announcements" element={<LifeAnnouncements />} />
                  <Route path="resources" element={<LifeResources />} />
                </Route>
              </Route>

              {/* New Routes */}
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/newcomers" element={<Newcomers />} />
              <Route path="/prayer" element={<PrayerRequests />} />
              <Route path="/sermons" element={<Sermons />} />
              <Route path="/decisions" element={<DecisionCards />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/news" element={<News />} />
              <Route path="/testimony" element={<TestimonyCards />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/give" element={<Give />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/salvation" element={<Salvation />} />
              <Route path="/prayer" element={<NeedPrayer />} />
              <Route path="/baptism" element={<Baptism />} />

              {/* Store Routes */}
              <Route path="/store" element={<StoreHome />} />
              <Route path="/store/product/:id" element={<ProductDetail />} />
              <Route path="/store/checkout" element={<Checkout />} />
              <Route path="/store/success" element={<OrderSuccess />} />

              {/* Bible Study Portal */}
              <Route path="/bible-study" element={<BibleStudyHome />} />
              <Route path="/bible-study/dashboard" element={<UserDashboard />} />
              <Route path="/bible-study/:id" element={<StudyGuideDetail />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/team/login" element={<VolunteerLogin />} />
            <Route path="/members/login" element={<MemberLogin />} />

            {/* Volunteer Portal (Team) Routes */}
            <Route path="/team" element={<VolunteerRoute />}>
              <Route element={<VolunteerLayout />}>
                <Route path="dashboard" element={<VolunteerDashboard />} />
                <Route path="tasks" element={<VolunteerTasks />} />
                <Route path="schedule" element={<VolunteerSchedule />} />
                <Route path="resources" element={<VolunteerResources />} />
                <Route path="messages" element={<VolunteerMessages />} />
              </Route>
            </Route>

            {/* Members Portal Routes */}
            <Route path="/members" element={<MemberRoute />}>
              <Route element={<MemberLayout />}>
                <Route path="dashboard" element={<MemberDashboard />} />
                <Route path="giving" element={<GivingHistory />} />
                <Route path="gift-aid" element={<GiftAid />} />
                <Route path="groups" element={<MemberGroups />} />
                <Route path="check-in" element={<CheckIn />} />
                <Route path="news" element={<MemberNews />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="prayer" element={<NeedPrayer />} />
              </Route>

              {/* House Fellowship Portal (Protected by MemberRoute, uses HouseLayout) */}
              <Route path="fellowship" element={<HouseLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HouseDashboard />} />
                <Route path="attendance" element={<HouseAttendance />} />
                <Route path="offerings" element={<HouseOfferings />} />
                <Route path="events" element={<HouseEvents />} />
                <Route path="events" element={<HouseEvents />} />
                <Route path="chat" element={<HouseChat />} />
                <Route path="resources" element={<HouseResources />} />
              </Route>
            </Route>

            {/* Children's Portal Routes */}
            <Route path="/children/login" element={<ChildrenLogin />} />
            <Route path="/children" element={<ChildrenRoute />}>
              <Route element={<ChildrenLayout />}>
                <Route path="dashboard" element={<ChildrenDashboard />} />
                <Route path="directory" element={<ChildDirectory />} />
                <Route path="register" element={<ChildProfile />} />
                <Route path="profile/:id" element={<ChildProfile />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="lessons" element={<LessonManager />} />
                <Route path="events" element={<EventPlanner />} />
                <Route path="incidents" element={<IncidentReport />} />
                <Route path="gallery" element={<PhotoGallery />} />
                <Route path="messaging" element={<ParentMessaging />} />
              </Route>
            </Route>

            {/* Finance Portal Routes */}
            <Route path="/finance/login" element={<FinanceLogin />} />
            <Route path="/finance" element={<FinanceRoute />}>
              <Route element={<FinanceLayout />}>
                <Route path="dashboard" element={<FinanceDashboard />} />
                <Route path="income" element={<FinanceIncome />} />
                <Route path="banking" element={<FinanceBanking />} />
                <Route path="expenses" element={<FinanceExpenses />} />
                <Route path="invoices" element={<FinanceInvoices />} />
                <Route path="ious" element={<FinanceIOUs />} />
                <Route path="budget" element={<FinanceBudget />} />
                <Route path="reports" element={<FinanceReports />} />
              </Route>
            </Route>

            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="orders" element={<OrderManager />} />
                <Route path="bible-study" element={<BibleStudyManager />} />
                <Route path="seo" element={<SEOManager />} />
                <Route path="volunteers" element={<VolunteerManager />} />
                <Route path="members" element={<MemberManager />} />
              </Route>
            </Route>
          </Routes>
        </SearchProvider>
      </StoreProvider>
    </div>
  );
}

export default App;
