import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

export default function AdminSiteVisits() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const q = query(collection(db, 'siteVisits'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setVisits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching site visits:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'siteVisits', id), { status: newStatus });
      setVisits(visits.map(v => v.id === id ? { ...v, status: newStatus } : v));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredVisits = visits.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.project?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-navy">Site Visit Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track site visit requests from potential buyers.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-sm border border-slate-100 shadow-sm">
          <Calendar className="text-gold" size={18} />
          <span className="text-xs font-bold text-navy uppercase tracking-widest">Today: {format(new Date(), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or project..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-gold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <select 
            className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 rounded-sm transition-all focus:outline-none focus:border-gold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filteredVisits.length} Bookings
          </div>
        </div>
      </div>

      {/* Visits List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredVisits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-sm border border-slate-100 overflow-hidden card-shadow hover:border-gold transition-all">
              <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* User Info */}
                <div className="flex items-start space-x-4 lg:w-1/4">
                  <div className="w-12 h-12 bg-navy/5 text-navy flex items-center justify-center rounded-full shrink-0">
                    <User size={24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-navy truncate">{visit.name}</h3>
                    <div className="flex flex-col space-y-1 mt-1">
                      <div className="flex items-center text-xs text-slate-400">
                        <Mail size={12} className="mr-2" />
                        {visit.email}
                      </div>
                      <div className="flex items-center text-xs text-slate-400">
                        <Phone size={12} className="mr-2" />
                        {visit.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="flex flex-wrap gap-6 lg:w-1/2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold/10 text-gold flex items-center justify-center rounded-sm">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Date</p>
                      <p className="text-sm font-bold text-navy">{visit.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold/10 text-gold flex items-center justify-center rounded-sm">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Time</p>
                      <p className="text-sm font-bold text-navy">{visit.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold/10 text-gold flex items-center justify-center rounded-sm">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Project</p>
                      <p className="text-sm font-bold text-navy">{visit.project}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between lg:justify-end space-x-6 lg:w-1/4 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                  <div className={`flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    visit.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    visit.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    visit.status === 'Completed' ? 'bg-navy text-white' : 'bg-gold/10 text-gold'
                  }`}>
                    {visit.status}
                  </div>
                  
                  <div className="relative group/actions">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 hover:bg-gold hover:text-white text-navy text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all">
                      <span>Actions</span>
                      <ChevronDown size={14} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-sm opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-10">
                      <button 
                        onClick={() => handleStatusUpdate(visit.id, 'Approved')}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors"
                      >
                        <CheckCircle2 size={14} />
                        <span>Approve Visit</span>
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(visit.id, 'Rejected')}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <XCircle size={14} />
                        <span>Reject Visit</span>
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(visit.id, 'Completed')}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-navy hover:bg-slate-50 transition-colors"
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Completed</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredVisits.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-sm border border-slate-100">
          <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-serif text-navy">No bookings found</h3>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
}
