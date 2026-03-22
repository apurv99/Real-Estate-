import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Home, 
  Building2, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  Clock
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

export default function AdminUnits() {
  const [units, setUnits] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsSnap, projectsSnap] = await Promise.all([
          getDocs(query(collection(db, 'units'), orderBy('unitNumber', 'asc'))),
          getDocs(query(collection(db, 'projects'), orderBy('title', 'asc')))
        ]);
        
        setUnits(unitsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setProjects(projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await deleteDoc(doc(db, 'units', id));
        setUnits(units.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting unit:', error);
      }
    }
  };

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.title || 'Unknown Project';
  };

  const filteredUnits = units.filter(u => {
    const matchesSearch = u.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getProjectName(u.projectId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'all' || u.projectId === selectedProject;
    return matchesSearch && matchesProject;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-navy">Units Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage individual property units and their availability.</p>
        </div>
        <Link 
          to="/admin/units/new"
          className="bg-gold text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-navy transition-all flex items-center justify-center space-x-2 rounded-sm shadow-lg shadow-gold/20"
        >
          <Plus size={18} />
          <span>Add New Unit</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by unit number or project..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-gold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <select 
            className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 rounded-sm transition-all focus:outline-none focus:border-gold"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filteredUnits.length} Units
          </div>
        </div>
      </div>

      {/* Units Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-slate-100 overflow-hidden card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Unit Info</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Project</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Size & Price</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Availability</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-navy/5 text-navy flex items-center justify-center rounded-sm">
                          <Home size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy">Unit {unit.unitNumber}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Residential</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-slate-600 font-medium">
                        <Building2 size={14} className="mr-2 text-gold" />
                        {getProjectName(unit.projectId)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-navy">{unit.size} Sq.Ft</p>
                        <p className="text-xs text-gold font-bold">₹ {unit.price.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        unit.availability === 'Available' ? 'bg-green-100 text-green-700' :
                        unit.availability === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-gold/10 text-gold'
                      }`}>
                        {unit.availability === 'Available' ? <CheckCircle2 size={12} className="mr-1" /> : 
                         unit.availability === 'Sold' ? <XCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                        {unit.availability}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/units/${unit.id}`}
                          className="p-2 hover:bg-white hover:text-gold text-slate-400 rounded-sm border border-transparent hover:border-slate-100 transition-all shadow-sm"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(unit.id)}
                          className="p-2 hover:bg-white hover:text-red-500 text-slate-400 rounded-sm border border-transparent hover:border-slate-100 transition-all shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredUnits.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-sm border border-slate-100">
          <Home size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-serif text-navy">No units found</h3>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or add a new unit.</p>
        </div>
      )}
    </div>
  );
}
