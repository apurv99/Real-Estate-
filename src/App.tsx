import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import BookVisit from './pages/BookVisit';
import Blog from './pages/Blog';
import { AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';

// Admin Imports
import AdminLayout from './admin/components/AdminLayout';
import AdminGuard from './admin/components/AdminGuard';
import AdminLogin from './admin/pages/Login';
import AdminDashboard from './admin/pages/Dashboard';
import AdminProjects from './admin/pages/Projects';
import AdminProjectForm from './admin/pages/ProjectForm';
import AdminUnits from './admin/pages/Units';
import AdminUnitForm from './admin/pages/UnitForm';
import AdminSiteVisits from './admin/pages/SiteVisits';
import AdminEnquiries from './admin/pages/Enquiries';
import AdminBlog from './admin/pages/Blog';
import AdminSettings from './admin/pages/Settings';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/projects" element={<AdminProjects />} />
                  <Route path="/projects/new" element={<AdminProjectForm />} />
                  <Route path="/projects/:id" element={<AdminProjectForm />} />
                  <Route path="/units" element={<AdminUnits />} />
                  <Route path="/units/new" element={<AdminUnitForm />} />
                  <Route path="/units/:id" element={<AdminUnitForm />} />
                  <Route path="/visits" element={<AdminSiteVisits />} />
                  <Route path="/enquiries" element={<AdminEnquiries />} />
                  <Route path="/blog" element={<AdminBlog />} />
                  <Route path="/settings" element={<AdminSettings />} />
                </Routes>
              </AdminLayout>
            </AdminGuard>
          }
        />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-visit" element={<BookVisit />} />
            <Route path="/blog" element={<Blog />} />
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-white text-navy text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
