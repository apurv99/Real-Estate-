import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Send, ShieldCheck } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const path = 'subscribers';
      await addDoc(collection(db, path), {
        email,
        createdAt: serverTimestamp()
      });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'subscribers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-navy text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm">
                <span className="text-navy font-serif text-2xl font-bold">V</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-serif text-xl font-bold leading-none tracking-tight">VANGUARD</span>
                <span className="text-gold text-[10px] uppercase tracking-[0.2em] leading-none mt-1">ESTATES</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed font-light">
              Crafting architectural masterpieces that redefine luxury living in India. With over two decades of excellence, we build more than just homes; we build legacies.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl mb-8 text-gold">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60 font-light">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/projects" className="hover:text-gold transition-colors">Our Projects</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">About Company</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/book-visit" className="hover:text-gold transition-colors">Book Site Visit</Link></li>
              <li className="pt-4 border-t border-white/5">
                <Link to="/admin" className="text-gold/60 hover:text-gold transition-colors flex items-center group">
                  <ShieldCheck size={14} className="mr-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Admin Panel</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-xl mb-8 text-gold">Newsletter</h4>
            <p className="text-white/60 text-sm font-light mb-6">Subscribe to receive updates on our latest projects and real estate insights.</p>
            {subscribed ? (
              <div className="bg-white/10 p-4 text-center rounded-sm">
                <p className="text-gold text-xs font-bold uppercase tracking-widest">Subscribed Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input 
                  required
                  type="email" 
                  placeholder="Your Email Address"
                  className="w-full bg-white/5 border border-white/10 py-3 px-4 text-sm focus:outline-none focus:border-gold transition-colors pr-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gold hover:text-white transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xl mb-8 text-gold">Contact Info</h4>
            <ul className="space-y-6 text-sm text-white/60 font-light">
              <li className="flex items-start space-x-4">
                <MapPin className="text-gold shrink-0" size={20} />
                <span>123, Business District, BKC, Mumbai, Maharashtra 400051</span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="text-gold shrink-0" size={20} />
                <span>+91 22 4567 8900</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="text-gold shrink-0" size={20} />
                <span>info@vanguardestates.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
          <p>© 2026 Vanguard Estates. All Rights Reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link to="/admin" className="hover:text-gold transition-colors flex items-center">
              <ShieldCheck size={10} className="mr-1" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
