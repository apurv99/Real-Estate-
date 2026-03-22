import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Check, Download, Calendar, Phone, Share2, ChevronRight, ChevronLeft } from 'lucide-react';
import { projects } from '../data/mockData';
import { useState } from 'react';
import EMICalculator from '../components/EMICalculator';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Project Not Found</h2>
          <Link to="/projects" className="text-gold border-b border-gold pb-1 uppercase tracking-widest text-sm font-bold">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      {/* Gallery Section */}
      <section className="relative h-[70vh] bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={project.gallery[activeImage] || project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-80 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
                {project.type} • {project.location}
              </span>
              <h1 className="text-3xl md:text-7xl font-serif text-white mb-6">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-white/80 text-sm font-light">
                <div className="flex items-center space-x-2">
                  <MapPin size={18} className="text-gold" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gold"></div>
                  <span>{project.status}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Gallery Controls */}
        <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 flex space-x-4 z-20">
          <button 
            onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : project.gallery.length - 1))}
            className="w-10 h-10 md:w-12 md:h-12 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-navy transition-all"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <button 
            onClick={() => setActiveImage(prev => (prev < project.gallery.length - 1 ? prev + 1 : 0))}
            className="w-10 h-10 md:w-12 md:h-12 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-navy transition-all"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview */}
            <div>
              <h2 className="text-3xl font-serif mb-8 border-b border-ink/10 pb-4">Project Overview</h2>
              <p className="text-ink/70 font-light leading-relaxed text-lg">
                {project.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                {project.features.map((feature, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-10 h-10 bg-gold/10 flex items-center justify-center rounded-sm">
                      <Check className="text-gold" size={20} />
                    </div>
                    <span className="text-[11px] uppercase tracking-widest font-bold text-ink/60">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-3xl font-serif mb-8 border-b border-ink/10 pb-4">World-Class Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center space-x-4 p-6 bg-white card-shadow">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-sm font-medium text-navy">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div>
              <h2 className="text-3xl font-serif mb-8 border-b border-ink/10 pb-4">Project Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {project.gallery.map((img, i) => (
                  <div key={i} className="aspect-video overflow-hidden cursor-pointer" onClick={() => setActiveImage(i)}>
                    <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* EMI Calculator */}
            <div>
              <h2 className="text-3xl font-serif mb-8 border-b border-ink/10 pb-4">Financial Planning</h2>
              <EMICalculator />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Booking Card */}
            <div className="bg-white p-8 card-shadow sticky top-28">
              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold block mb-1">Starting Price</span>
                <span className="text-4xl font-serif text-navy font-bold">{project.priceRange.split(' - ')[0]}</span>
              </div>
              
              <div className="space-y-4">
                <Link 
                  to="/book-visit" 
                  state={{ project: project.title }}
                  className="w-full py-4 bg-gold text-white text-xs uppercase tracking-widest font-bold hover:bg-navy transition-all duration-300 flex items-center justify-center"
                >
                  <Calendar className="mr-2" size={18} />
                  Book Site Visit
                </Link>
                <button className="w-full py-4 border border-navy text-navy text-xs uppercase tracking-widest font-bold hover:bg-navy hover:text-white transition-all duration-300 flex items-center justify-center">
                  <Download className="mr-2" size={18} />
                  Download Brochure
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-ink/5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">Property Type</span>
                  <span className="font-bold">{project.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">Status</span>
                  <span className="font-bold text-gold">{project.status}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">Possession</span>
                  <span className="font-bold">Dec 2027</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center space-x-6">
                <button className="text-ink/40 hover:text-gold transition-colors"><Phone size={20} /></button>
                <button className="text-ink/40 hover:text-gold transition-colors"><Share2 size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
