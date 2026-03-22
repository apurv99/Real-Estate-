import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  MapPin,
  Building2,
  Tag
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('title', 'asc'));
        const snap = await getDocs(q);
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-navy">Projects Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your property projects and developments.</p>
        </div>
        <Link 
          to="/admin/projects/new"
          className="bg-gold text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-navy transition-all flex items-center justify-center space-x-2 rounded-sm shadow-lg shadow-gold/20"
        >
          <Plus size={18} />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects by name or location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-gold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 rounded-sm transition-all">
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredProjects.length} projects
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-sm border border-slate-100 overflow-hidden group hover:border-gold transition-all card-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                    project.status === 'Ongoing' ? 'bg-blue-500 text-white' : 
                    project.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-gold text-white'
                  }`}>
                    {project.status}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-serif text-navy group-hover:text-gold transition-colors">{project.title}</h3>
                    <div className="flex items-center text-slate-400 text-xs mt-1">
                      <MapPin size={12} className="mr-1" />
                      {project.location}
                    </div>
                  </div>
                  <div className="relative group/menu">
                    <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                      <MoreVertical size={18} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-sm opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                      <Link 
                        to={`/admin/projects/${project.id}`}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-navy hover:bg-slate-50 transition-colors"
                      >
                        <Edit2 size={14} />
                        <span>Edit Project</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Delete Project</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-sm">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Type</p>
                    <div className="flex items-center text-navy font-bold text-xs">
                      <Building2 size={12} className="mr-2 text-gold" />
                      {project.type}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-sm">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Price Range</p>
                    <div className="flex items-center text-navy font-bold text-xs">
                      <Tag size={12} className="mr-2 text-gold" />
                      {project.priceRange}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-navy transition-colors flex items-center">
                    View Units <ExternalLink size={12} className="ml-1" />
                  </button>
                  <span className="text-[9px] text-slate-400 font-medium">
                    Added: {project.createdAt ? format(project.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-sm border border-slate-100">
          <Building2 size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-serif text-navy">No projects found</h3>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your search or add a new project.</p>
        </div>
      )}
    </div>
  );
}
