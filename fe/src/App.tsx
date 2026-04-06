import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import AdminApp from './pages/admin/AdminApp';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Home from './pages/Home';
import InstitutionDetailPage from './pages/InstitutionDetailPage';
import ListYourAcademy from './pages/ListYourAcademy';
import Packages from './pages/Packages';

const PublicLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow pt-24">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/institution/:id" element={<InstitutionDetailPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/list-your-academy" element={<ListYourAcademy />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
