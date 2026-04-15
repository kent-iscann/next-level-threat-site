import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
<<<<<<< HEAD
import HeroSection from './features/hero/HeroSection';
import AudienceSection from './features/audience/AudienceSection';
import NLTPlus from './features/plus/NLTPlus';
import Nexus from './features/nexus/Nexus';
import SocialProof from './features/social-proof/SocialProof';
import Inbox from './features/inbox/Inbox';
import FreePodcasts from './features/podcasts/FreePodcasts';
import FAQSection from './features/faq/FAQSection';
import AboutSection from './features/about/AboutSection';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <HeroSection />
        <NLTPlus />
        <Nexus />
        <Inbox />
        <AudienceSection />
        <SocialProof />
        <FreePodcasts />
        <FAQSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
=======
import DashboardPage from './pages/DashboardPage';
import TaiwanStraitPage from './pages/TaiwanStraitPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/taiwan-strait" element={<TaiwanStraitPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
>>>>>>> c391968 (Add static demo pages: dashboard and Taiwan Strait topic page)
  );
}
export default App;