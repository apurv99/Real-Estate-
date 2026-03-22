import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FileText, 
  User, 
  Calendar, 
  Tag, 
  ExternalLink,
  Eye
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogPosts', id));
        setPosts(posts.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-navy">Blog Management</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage your website's blog content and news.</p>
        </div>
        <button className="bg-gold text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-navy transition-all flex items-center justify-center space-x-2 rounded-sm shadow-lg shadow-gold/20">
          <Plus size={18} />
          <span>Create New Post</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search posts by title or category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-gold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing {filteredPosts.length} posts
        </div>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-sm border border-slate-100 overflow-hidden card-shadow hover:border-gold transition-all group">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto overflow-hidden shrink-0">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest rounded-sm">
                          {post.category}
                        </span>
                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <Calendar size={12} className="mr-1" />
                          {post.date}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-navy rounded-sm transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-slate-50 text-slate-400 hover:text-red-500 rounded-sm transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-serif text-navy mb-3 group-hover:text-gold transition-colors">{post.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-xs text-slate-400 font-medium">
                        <User size={14} className="mr-2" />
                        {post.author}
                      </div>
                      <div className="flex items-center text-xs text-slate-400 font-medium">
                        <Eye size={14} className="mr-2" />
                        {Math.floor(Math.random() * 1000) + 100} Views
                      </div>
                    </div>
                    <button className="text-[10px] uppercase tracking-widest font-bold text-navy hover:text-gold transition-colors flex items-center">
                      Preview Post <ExternalLink size={12} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-sm border border-slate-100">
          <FileText size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-serif text-navy">No blog posts found</h3>
          <p className="text-slate-400 text-sm mt-2">Start sharing news and updates by creating your first post.</p>
        </div>
      )}
    </div>
  );
}
