import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'About Us', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-paper border-b border-ink/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-navy flex items-center justify-center rounded-sm">
              <span className="text-gold font-serif text-2xl font-bold">V</span>
            </div>
            <div className="flex flex-col">
              <span className="text-navy font-serif text-2xl font-bold leading-none tracking-tight">VANGUARD</span>
              <span className="text-gold text-[11px] uppercase tracking-[0.25em] leading-none mt-1 font-bold">ESTATES</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "nav-item",
                  location.pathname === link.path && "active"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/book-visit"
              className="ml-8 px-8 py-3 bg-gold text-white text-xs uppercase tracking-widest font-bold hover:bg-navy transition-all duration-300 shadow-md"
            >
              Book Site Visit
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy p-2 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-paper border-b border-ink/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-4 text-sm font-medium uppercase tracking-wider",
                    location.pathname === link.path ? "text-gold" : "text-navy"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/book-visit"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-3 py-4 bg-gold text-white text-sm font-bold uppercase tracking-widest"
              >
                Book Site Visit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
