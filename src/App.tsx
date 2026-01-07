
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <div className="antialiased">
      <Layout>
        <Routes>
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
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
