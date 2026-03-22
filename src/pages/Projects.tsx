import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/mockData';

export default function Projects() {
  const [filter, setFilter] = useState({
    location: 'All',
    type: 'All',
    status: 'All'
  });

  const filteredProjects = projects.filter(p => {
    return (filter.location === 'All' || p.location.includes(filter.location)) &&
           (filter.type === 'All' || p.type === filter.type) &&
           (filter.status === 'All' || p.status === filter.status);
  });

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
              Our Portfolio
            </span>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
              Exclusive <span className="italic">Developments</span>
            </h1>
            <p className="text-white/60 font-light leading-relaxed">
              Explore our collection of luxury residences and commercial spaces across India's most prestigious locations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white p-6 md:p-8 card-shadow flex flex-col md:flex-row gap-6 items-stretch md:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Location</label>
            <select 
              value={filter.location}
              onChange={(e) => setFilter({...filter, location: e.target.value})}
              className="w-full border-b border-ink/10 py-3 md:py-2 focus:outline-none focus:border-gold text-sm bg-transparent"
            >
              <option value="All">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Lonavala">Lonavala</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Property Type</label>
            <select 
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value as any})}
              className="w-full border-b border-ink/10 py-3 md:py-2 focus:outline-none focus:border-gold text-sm bg-transparent"
            >
              <option value="All">All Types</option>
              <option value="Flat">Flat</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Status</label>
            <select 
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value as any})}
              className="w-full border-b border-ink/10 py-3 md:py-2 focus:outline-none focus:border-gold text-sm bg-transparent"
            >
              <option value="All">All Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
          <button className="bg-gold text-white px-8 py-4 md:py-3 text-xs uppercase tracking-widest font-bold hover:bg-navy transition-colors duration-300 shadow-md">
            Apply Filters
          </button>
        </div>
      </section>

      {/* Project Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white overflow-hidden card-shadow flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-navy/90 text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                  {project.status}
                </div>
              </div>
              <div className="p-8 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-gold text-[10px] uppercase tracking-widest font-bold mb-2 block">
                    {project.type} • {project.location}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif mb-4 group-hover:text-gold transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-ink/80 text-sm font-light mb-6 line-clamp-3">
                    {project.description}
                  </p>
                </div>
                <div className="pt-6 border-t border-ink/5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Starting From</span>
                    <span className="text-navy font-bold text-xl">{project.priceRange.split(' - ')[0]}</span>
                  </div>
                  <Link to={`/projects/${project.id}`} className="w-12 h-12 bg-paper rounded-full flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-300">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-ink/40">No projects found matching your criteria.</h3>
            <button 
              onClick={() => setFilter({location: 'All', type: 'All', status: 'All'})}
              className="mt-4 text-gold border-b border-gold pb-1 text-sm uppercase tracking-widest font-bold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
