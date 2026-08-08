import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
// import DashboardPage from './pages/DashboardPage';
// import SignalFractureSlugPage from './pages/signal-fracture/[slug]';
// import NexusSlugPage from './pages/nexus/[slug]';
import ArchivePage from './pages/ArchivePage';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import ProPage from './pages/ProPage';

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
      <AuthProvider>
        <ScrollToTop />
        <div className="app">
          <Header />
          <main>
            <Routes>
                <Route path="/" element={<Landing />} />
                {/* <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/signal-fracture/:slug" element={<SignalFractureSlugPage />} />
                <Route path="/nexus/:slug" element={<NexusSlugPage />} /> */}
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/pro"
                  element={
                    <RequireAuth>
                      <ProPage />
                    </RequireAuth>
                  }
                />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
