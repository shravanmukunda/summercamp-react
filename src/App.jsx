import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import Sports from './pages/Sports'
import Dance from './pages/Dance'
import Music from './pages/Music'
import Creativity from './pages/Creativity'
import Adventure from './pages/Adventure'
import Education from './pages/Education'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Packages from './pages/Packages'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories/sports" element={<Sports />} />
          <Route path="/categories/dance" element={<Dance />} />
          <Route path="/categories/music" element={<Music />} />
          <Route path="/categories/creativity" element={<Creativity />} />
          <Route path="/categories/adventure" element={<Adventure />} />
          <Route path="/categories/education" element={<Education />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/packages" element={<Packages />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
