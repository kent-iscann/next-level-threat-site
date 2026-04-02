import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './features/hero/HeroSection';
import AudienceSection from './features/audience/AudienceSection';
import NLTPlus from './features/plus/NLTPlus';
import SocialProof from './features/social-proof/SocialProof';
import FreePodcasts from './features/podcasts/FreePodcasts';
import FAQSection from './features/faq/FAQSection';
import NewsletterCapture from './features/newsletter/NewsletterCapture';
import AboutSection from './features/about/AboutSection';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <HeroSection />
        <AudienceSection />
        <NLTPlus />
        <SocialProof />
        <FreePodcasts />
        <FAQSection />
        <NewsletterCapture />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
export default App;