import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import TaiwanStraitPage from './pages/TaiwanStraitPage';
import NexusIranPage from './pages/NexusIranPage';
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
              <Route path="/taiwan-strait" element={<TaiwanStraitPage />} />
              <Route path="/nexus-iran" element={<NexusIranPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;