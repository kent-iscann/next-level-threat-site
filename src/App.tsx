import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './features/hero/HeroSection';
import MissionStatement from './features/mission/MissionStatement';
import NLTPlus from './features/plus/NLTPlus';
import FreePodcasts from './features/podcasts/FreePodcasts';
import AboutSection from './features/about/AboutSection';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <HeroSection />
        <MissionStatement />
        <NLTPlus />
        <FreePodcasts />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
export default App;