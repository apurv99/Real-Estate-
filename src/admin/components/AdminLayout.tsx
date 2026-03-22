import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Home, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  User,
  ChevronRight
} from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Projects', path: '/admin/projects', icon: Building2 },
  { name: 'Units', path: '/admin/units', icon: Home },
  { name: 'Site Visits', path: '/admin/visits', icon: Calendar },
  { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { name: 'Blog', path: '/admin/blog', icon: FileText },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-navy text-white fixed lg:static inset-y-0 left-0 z-50 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${!isSidebarOpen && 'lg:w-20'} lg:block`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <Link to="/admin" className={`flex items-center space-x-3 ${!isSidebarOpen && 'lg:hidden'}`}>
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm shrink-0">
                <span className="text-navy font-serif text-xl font-bold">V</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-serif text-sm font-bold leading-none tracking-tight">VANGUARD</span>
                <span className="text-gold text-[8px] uppercase tracking-[0.2em] leading-none mt-1">ADMIN</span>
              </div>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-white/10 rounded-sm lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow py-6 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-all group ${
                    isActive 
                      ? 'bg-gold text-white' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className="shrink-0" />
                  <span className={`text-sm font-medium transition-opacity duration-300 ${
                    !isSidebarOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'
                  }`}>
                    {item.name}
                  </span>
                  {isActive && isSidebarOpen && (
                    <ChevronRight size={14} className="ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 text-white/60 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-all group"
            >
              <LogOut size={20} className="shrink-0" />
              <span className={`text-sm font-medium transition-opacity duration-300 ${
                !isSidebarOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'
              }`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* TopBar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-md text-slate-500"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-serif text-navy hidden md:block">
              {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-navy leading-none">Admin User</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-10 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
