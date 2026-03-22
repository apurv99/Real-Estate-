import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Building, CheckCircle2 } from 'lucide-react';
import { projects } from '../data/mockData';
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

export default function BookVisit() {
  const location = useLocation();
  const initialProject = location.state?.project || '';

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    project: initialProject
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const path = 'siteVisits';
      await addDoc(collection(db, path), {
        ...formState,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'siteVisits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-20">
      {/* Header */}
      <section className="bg-navy py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
              Experience Luxury
            </span>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
              Book Your <span className="italic">Site Visit</span>
            </h1>
            <p className="text-white/60 font-light leading-relaxed">
              Schedule a personalized tour of our properties and experience the Vanguard lifestyle firsthand.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white p-10 md:p-16 card-shadow">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-4xl font-serif text-navy mb-4">Visit Scheduled!</h2>
              <p className="text-ink/60 font-light mb-8 max-w-md mx-auto">
                Thank you, {formState.name}. Your site visit for <span className="font-bold text-navy">{formState.project}</span> has been scheduled. Our relationship manager will call you shortly to confirm the details.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-10 py-4 bg-gold text-white text-xs uppercase tracking-widest font-bold hover:bg-navy transition-all duration-300"
              >
                Schedule Another Visit
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="flex items-center text-[10px] uppercase tracking-widest text-ink/50 font-bold">
                    <User size={14} className="mr-2" /> Full Name
                  </label>
                  <input 
                    required
                    type="text" 
                    className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm"
                    placeholder="Enter your name"
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="flex items-center text-[10px] uppercase tracking-widest text-ink/50 font-bold">
                    <Phone size={14} className="mr-2" /> Phone Number
                  </label>
                  <input 
                    required
                    type="tel" 
                    className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm"
                    placeholder="+91 98765 43210"
                    value={formState.phone}
                    onChange={(e) => setFormState({...formState, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center text-[10px] uppercase tracking-widest text-ink/50 font-bold">
                  <Building size={14} className="mr-2" /> Select Project
                </label>
                <select 
                  required
                  className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm bg-transparent"
                  value={formState.project}
                  onChange={(e) => setFormState({...formState, project: e.target.value})}
                >
                  <option value="" disabled>Choose a project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.title}>{p.title} - {p.location}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="flex items-center text-[10px] uppercase tracking-widest text-ink/50 font-bold">
                    <Calendar size={14} className="mr-2" /> Preferred Date
                  </label>
                  <input 
                    required
                    type="date" 
                    className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm"
                    value={formState.date}
                    onChange={(e) => setFormState({...formState, date: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="flex items-center text-[10px] uppercase tracking-widest text-ink/50 font-bold">
                    <Clock size={14} className="mr-2" /> Preferred Time
                  </label>
                  <select 
                    required
                    className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm bg-transparent"
                    value={formState.time}
                    onChange={(e) => setFormState({...formState, time: e.target.value})}
                  >
                    <option value="" disabled>Select time slot</option>
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-navy text-white text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all duration-300 shadow-lg shadow-navy/20 disabled:bg-navy/50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Confirm Site Visit'
                  )}
                </button>
                <p className="text-center text-[10px] text-ink/40 mt-6 uppercase tracking-widest">
                  By clicking confirm, you agree to our privacy policy and terms of service.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
