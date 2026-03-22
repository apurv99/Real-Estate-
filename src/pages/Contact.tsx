import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
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

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const path = 'leads';
      await addDoc(collection(db, path), {
        ...formState,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'leads');
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
              Get In Touch
            </span>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
              Contact <span className="italic">Our Experts</span>
            </h1>
            <p className="text-white/60 font-light leading-relaxed">
              Whether you're looking for your dream home or a strategic investment, our team is here to guide you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif mb-8">Office Information</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm shrink-0">
                    <MapPin className="text-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">Corporate Office</h4>
                    <p className="text-ink/60 font-light leading-relaxed">
                      123, Business District, BKC, Mumbai,<br />
                      Maharashtra 400051, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm shrink-0">
                    <Phone className="text-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">Call Us</h4>
                    <p className="text-ink/60 font-light leading-relaxed">
                      Main: +91 22 4567 8900<br />
                      Sales: +91 98765 43210
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm shrink-0">
                    <Mail className="text-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">Email Us</h4>
                    <p className="text-ink/60 font-light leading-relaxed">
                      General: info@vanguardestates.com<br />
                      Sales: sales@vanguardestates.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="bg-navy p-8 text-white flex items-center justify-between rounded-sm">
              <div>
                <h4 className="font-serif text-xl mb-2">Quick Chat</h4>
                <p className="text-white/60 text-sm font-light">Connect with us on WhatsApp for instant support.</p>
              </div>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <MessageSquare size={28} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 card-shadow">
            <h2 className="text-3xl font-serif mb-8">Send a Message</h2>
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} />
                </div>
                <h3 className="text-xl font-serif text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700 text-sm">Thank you for reaching out. Our team will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm"
                      placeholder="John Doe"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Phone Number</label>
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
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm"
                    placeholder="john@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Your Message</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm resize-none"
                    placeholder="Tell us about your requirements..."
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-navy text-white text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all duration-300 disabled:bg-navy/50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] w-full bg-ink/5">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.803858088153!2d72.8617133!3d19.0613606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e54a948df9%3A0x5979a3793ca0f06!2sBandra%20Kurla%20Complex%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1647964800000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}
