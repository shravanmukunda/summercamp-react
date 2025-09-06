import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

// pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import InstitutionDetailPage from './pages/InstitutionDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* dynamic institution detail */}
            <Route path="/institution/:id" element={<InstitutionDetailPage />} />

            {/* static pages */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />

            {/* fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
