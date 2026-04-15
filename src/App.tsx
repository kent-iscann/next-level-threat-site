import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
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
  );
}
export default App;