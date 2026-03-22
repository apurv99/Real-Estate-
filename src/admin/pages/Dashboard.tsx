import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Home, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  FileText,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const COLORS = ['#0A192F', '#C5A059', '#1A1A1A', '#FAF9F6'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeListings: 0,
    totalEnquiries: 0,
    siteVisits: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Stats
        const projectsSnap = await getDocs(collection(db, 'projects'));
        const unitsSnap = await getDocs(collection(db, 'units'));
        const leadsSnap = await getDocs(collection(db, 'leads'));
        const visitsSnap = await getDocs(collection(db, 'siteVisits'));

        setStats({
          totalProjects: projectsSnap.size,
          activeListings: unitsSnap.docs.filter(d => d.data().availability === 'Available').length,
          totalEnquiries: leadsSnap.size,
          siteVisits: visitsSnap.size,
        });

        // Fetch Recent Activities (Leads and Visits)
        const recentLeadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5));
        const recentVisitsQuery = query(collection(db, 'siteVisits'), orderBy('createdAt', 'desc'), limit(5));
        
        const [recentLeadsSnap, recentVisitsSnap] = await Promise.all([
          getDocs(recentLeadsQuery),
          getDocs(recentVisitsQuery)
        ]);

        const activities = [
          ...recentLeadsSnap.docs.map(d => ({ ...d.data(), type: 'Enquiry', id: d.id })),
          ...recentVisitsSnap.docs.map(d => ({ ...d.data(), type: 'Site Visit', id: d.id }))
        ].sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).slice(0, 6);

        setRecentActivities(activities);

        // Generate Chart Data (Last 6 months)
        const months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), i)).reverse();
        const data = months.map(month => ({
          name: format(month, 'MMM'),
          enquiries: Math.floor(Math.random() * 50) + 10, // Mock data for now as we don't have historical data
          bookings: Math.floor(Math.random() * 20) + 5,
        }));
        setChartData(data);

      } catch (error) {
        console.error('Dashboard data error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', value: stats.totalProjects, icon: Building2, color: 'bg-navy', trend: '+2', isUp: true },
          { label: 'Active Listings', value: stats.activeListings, icon: Home, color: 'bg-gold', trend: '+12', isUp: true },
          { label: 'Total Enquiries', value: stats.totalEnquiries, icon: MessageSquare, color: 'bg-navy', trend: '+18%', isUp: true },
          { label: 'Site Visits', value: stats.siteVisits, icon: Calendar, color: 'bg-gold', trend: '-4%', isUp: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-sm card-shadow border border-slate-100 group hover:border-gold transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.color} text-white flex items-center justify-center rounded-sm shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                <span>{stat.trend}</span>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <h3 className="text-3xl font-serif text-navy mb-1">{stat.value}</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-sm card-shadow border border-slate-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-serif text-navy">Performance Overview</h3>
              <p className="text-xs text-slate-400 mt-1">Monthly enquiries and site visit trends</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-navy rounded-full"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Enquiries</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gold rounded-full"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Bookings</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEnq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A192F" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0A192F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '4px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontSize: '12px', fontWeight: 700, color: '#0A192F', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="enquiries" stroke="#0A192F" strokeWidth={3} fillOpacity={1} fill="url(#colorEnq)" />
                <Area type="monotone" dataKey="bookings" stroke="#C5A059" strokeWidth={3} fillOpacity={1} fill="url(#colorBook)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-sm card-shadow border border-slate-100">
          <h3 className="text-xl font-serif text-navy mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivities.map((activity, i) => (
              <div key={activity.id} className="flex items-start space-x-4 group">
                <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full ${
                  activity.type === 'Enquiry' ? 'bg-navy/5 text-navy' : 'bg-gold/10 text-gold'
                }`}>
                  {activity.type === 'Enquiry' ? <MessageSquare size={18} /> : <Calendar size={18} />}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-navy truncate">{activity.name}</p>
                    <span className="text-[9px] text-slate-400 whitespace-nowrap ml-2">
                      {activity.createdAt ? format(activity.createdAt.toDate(), 'HH:mm') : 'Just now'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {activity.type === 'Enquiry' ? 'New enquiry received' : `Site visit for ${activity.project}`}
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-10">
                <Clock className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-xs text-slate-400 uppercase tracking-widest">No recent activity</p>
              </div>
            )}
          </div>
          <button className="w-full mt-10 py-3 border border-slate-100 text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            View All Activities
          </button>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Distribution Mock */}
        <div className="bg-white p-8 rounded-sm card-shadow border border-slate-100">
          <h3 className="text-xl font-serif text-navy mb-8">Inventory Status</h3>
          <div className="flex items-center justify-between">
            <div className="h-[250px] w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Available', value: stats.activeListings },
                      { name: 'Sold', value: 15 },
                      { name: 'Booked', value: 8 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4 pl-10">
              {[
                { label: 'Available Units', value: stats.activeListings, color: 'bg-navy' },
                { label: 'Sold Units', value: 15, color: 'bg-gold' },
                { label: 'Booked Units', value: 8, color: 'bg-slate-900' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                    <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-navy">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-sm card-shadow border border-slate-100">
          <h3 className="text-xl font-serif text-navy mb-8">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add Project', icon: Building2, path: '/admin/projects/new' },
              { label: 'Add Unit', icon: Home, path: '/admin/units/new' },
              { label: 'New Blog', icon: FileText, path: '/admin/blog/new' },
              { label: 'Settings', icon: Settings, path: '/admin/settings' },
            ].map((action, i) => (
              <button 
                key={i}
                className="p-6 border border-slate-100 hover:border-gold hover:bg-gold/5 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:bg-gold group-hover:text-white flex items-center justify-center rounded-sm mb-4 transition-all">
                  <action.icon size={20} />
                </div>
                <span className="text-xs font-bold text-navy uppercase tracking-widest">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
