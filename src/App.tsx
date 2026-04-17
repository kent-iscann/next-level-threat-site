import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import SignalFractureSlugPage from './pages/signal-fracture/[slug]';
import NexusSlugPage from './pages/nexus/[slug]';
import Landing from './pages/Landing';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app">
        <Header />
        <main>
          <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/signal-fracture/:slug" element={<SignalFractureSlugPage />} />
              <Route path="/nexus/:slug" element={<NexusSlugPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;