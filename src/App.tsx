

import { Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
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

import Prayer from './pages/members/Prayer';

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

// Admin Imports
import MemberManager from './pages/store/admin/MemberManager';

function App() {
  return (
    <div className="antialiased">
      <StoreProvider>
        <SEOHead />
        <CartSidebar />
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServiceTimes />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/plan-visit" element={<PlanVisit />} />

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
              <Route path="prayer" element={<Prayer />} />
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
      </StoreProvider>
    </div>
  );
}

export default App;
