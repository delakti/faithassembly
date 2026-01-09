

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

          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="bible-study" element={<BibleStudyManager />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="volunteers" element={<VolunteerManager />} />
            </Route>
          </Route>
        </Routes>
      </StoreProvider>
    </div>
  );
}

export default App;
