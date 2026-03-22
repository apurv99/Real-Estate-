import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ChevronDown,
  Download
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setEnquiries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status: newStatus });
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await deleteDoc(doc(db, 'leads', id));
        setEnquiries(enquiries.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Status', 'Date'];
    const data = filteredEnquiries.map(e => [
      e.name,
      e.email,
      e.phone,
      e.message?.replace(/,/g, ';'),
      e.status,
      e.createdAt ? format(e.createdAt.toDate(), 'yyyy-MM-dd HH:mm') : 'N/A'
    ]);
    
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `enquiries_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-navy">Enquiries & Leads</h1>
          <p className="text-slate-400 text-sm mt-1">Manage contact form submissions and potential customer leads.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-navy text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all flex items-center justify-center space-x-2 rounded-sm shadow-lg shadow-navy/20"
        >
          <Download size={18} />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or message..."
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
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filteredEnquiries.length} Enquiries
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-white rounded-sm border border-slate-100 overflow-hidden card-shadow hover:border-gold transition-all">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* User Info */}
                  <div className="flex items-start space-x-4 lg:w-1/4">
                    <div className="w-12 h-12 bg-navy/5 text-navy flex items-center justify-center rounded-full shrink-0">
                      <User size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-navy truncate">{enquiry.name}</h3>
                      <div className="flex flex-col space-y-1 mt-1">
                        <div className="flex items-center text-xs text-slate-400">
                          <Mail size={12} className="mr-2" />
                          {enquiry.email}
                        </div>
                        <div className="flex items-center text-xs text-slate-400">
                          <Phone size={12} className="mr-2" />
                          {enquiry.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="lg:w-1/2">
                    <div className="bg-slate-50 p-4 rounded-sm">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Message</p>
                      <p className="text-sm text-navy leading-relaxed italic">
                        "{enquiry.message || 'No message provided.'}"
                      </p>
                    </div>
                    <div className="flex items-center mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <Clock size={12} className="mr-2" />
                      Received: {enquiry.createdAt ? format(enquiry.createdAt.toDate(), 'MMM dd, yyyy HH:mm') : 'N/A'}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between lg:justify-end space-x-6 lg:w-1/4 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                    <div className={`flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      enquiry.status === 'New' ? 'bg-blue-100 text-blue-700' :
                      enquiry.status === 'In Progress' ? 'bg-gold/10 text-gold' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {enquiry.status}
                    </div>
                    
                    <div className="relative group/actions">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 hover:bg-gold hover:text-white text-navy text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all">
                        <span>Status</span>
                        <ChevronDown size={14} />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-sm opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-10">
                        <button 
                          onClick={() => handleStatusUpdate(enquiry.id, 'New')}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Clock size={14} />
                          <span>Mark as New</span>
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(enquiry.id, 'In Progress')}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-gold hover:bg-gold/5 transition-colors"
                        >
                          <Clock size={14} />
                          <span>Mark In Progress</span>
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(enquiry.id, 'Closed')}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Closed</span>
                        </button>
                        <div className="border-t border-slate-50 my-1"></div>
                        <button 
                          onClick={() => handleDelete(enquiry.id)}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <XCircle size={14} />
                          <span>Delete Enquiry</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEnquiries.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-sm border border-slate-100">
          <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-serif text-navy">No enquiries found</h3>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
}
