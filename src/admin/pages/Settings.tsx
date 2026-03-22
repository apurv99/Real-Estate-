import React, { useEffect, useState } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    companyName: 'Vanguard Estates',
    contactNumber: '+91 98765 43210',
    email: 'info@vanguardestates.com',
    address: '123, Luxury Heights, Marine Drive, Mumbai, Maharashtra 400001',
    facebook: 'https://facebook.com/vanguardestates',
    instagram: 'https://instagram.com/vanguardestates',
    twitter: 'https://twitter.com/vanguardestates',
    linkedin: 'https://linkedin.com/company/vanguardestates',
    whatsapp: 'https://wa.me/919876543210',
    logo: '',
    favicon: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...settings, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-navy">Website Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your website's general information and social links.</p>
        </div>
        {showSuccess && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-sm border border-green-100 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* General Information */}
        <div className="bg-white p-8 rounded-sm border border-slate-100 card-shadow">
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-50">
            <Globe className="text-gold" size={20} />
            <h3 className="text-lg font-serif text-navy">General Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Company Name</label>
              <input 
                type="text" 
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="Vanguard Estates"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Contact Email</label>
              <div className="flex items-center">
                <Mail size={14} className="text-slate-400 mr-2" />
                <input 
                  type="email" 
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                  placeholder="info@vanguardestates.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Contact Number</label>
              <div className="flex items-center">
                <Phone size={14} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  name="contactNumber"
                  value={settings.contactNumber}
                  onChange={handleChange}
                  className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Office Address</label>
              <div className="flex items-start">
                <MapPin size={14} className="text-slate-400 mr-2 mt-2" />
                <textarea 
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors resize-none"
                  placeholder="123, Luxury Heights, Marine Drive, Mumbai..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-8 rounded-sm border border-slate-100 card-shadow">
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-50">
            <MessageCircle className="text-gold" size={20} />
            <h3 className="text-lg font-serif text-navy">Social Media & Communication</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Facebook size={12} className="mr-2" /> Facebook URL
              </label>
              <input 
                type="url" 
                name="facebook"
                value={settings.facebook}
                onChange={handleChange}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Instagram size={12} className="mr-2" /> Instagram URL
              </label>
              <input 
                type="url" 
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Twitter size={12} className="mr-2" /> Twitter URL
              </label>
              <input 
                type="url" 
                name="twitter"
                value={settings.twitter}
                onChange={handleChange}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Linkedin size={12} className="mr-2" /> LinkedIn URL
              </label>
              <input 
                type="url" 
                name="linkedin"
                value={settings.linkedin}
                onChange={handleChange}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <MessageCircle size={12} className="mr-2" /> WhatsApp Link
              </label>
              <input 
                type="url" 
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="https://wa.me/..."
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white p-8 rounded-sm border border-slate-100 card-shadow">
          <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-50">
            <ImageIcon className="text-gold" size={20} />
            <h3 className="text-lg font-serif text-navy">Branding Assets</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Website Logo URL</label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center overflow-hidden">
                  {settings.logo ? (
                    <img src={settings.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <ImageIcon className="text-slate-200" size={32} />
                  )}
                </div>
                <input 
                  type="text" 
                  name="logo"
                  value={settings.logo}
                  onChange={handleChange}
                  className="flex-grow border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                  placeholder="https://.../logo.png"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Favicon URL</label>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center overflow-hidden">
                  {settings.favicon ? (
                    <img src={settings.favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                  ) : (
                    <Globe className="text-slate-200" size={24} />
                  )}
                </div>
                <input 
                  type="text" 
                  name="favicon"
                  value={settings.favicon}
                  onChange={handleChange}
                  className="flex-grow border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                  placeholder="https://.../favicon.ico"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="bg-navy text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all flex items-center justify-center space-x-3 rounded-sm shadow-xl shadow-navy/20 disabled:bg-navy/50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
