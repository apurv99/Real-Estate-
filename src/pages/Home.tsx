import { motion } from 'motion/react';
import { ArrowRight, Search, Shield, Award, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/mockData';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Real Estate"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-navy/50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
              Redefining Luxury Living
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8">
              Find Your <br />
              <span className="italic text-gold">Dream Home</span> Today
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="px-8 py-4 bg-gold text-white text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-navy transition-all duration-300 flex items-center group"
              >
                Explore Projects
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link
                to="/book-visit"
                className="px-8 py-4 border border-white text-white text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-navy transition-all duration-300"
              >
                Book Site Visit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative z-20 px-4 -mt-16 md:-mt-24 max-w-5xl mx-auto">
        <div className="bg-white p-8 md:p-12 card-shadow grid grid-cols-1 md:grid-cols-4 gap-8 items-end rounded-sm">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Location</label>
            <select className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm bg-transparent">
              <option>All Locations</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Lonavala</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Property Type</label>
            <select className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm bg-transparent">
              <option>All Types</option>
              <option>Flat</option>
              <option>Villa</option>
              <option>Commercial</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Budget</label>
            <select className="w-full border-b border-ink/10 py-3 focus:outline-none focus:border-gold text-sm bg-transparent">
              <option>Any Budget</option>
              <option>Under ₹2 Cr</option>
              <option>₹2 Cr - ₹5 Cr</option>
              <option>Above ₹5 Cr</option>
            </select>
          </div>
          <button className="bg-navy text-white py-5 px-6 flex items-center justify-center space-x-3 hover:bg-gold transition-all duration-300 shadow-lg">
            <Search size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">Search Now</span>
          </button>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 md:py-32 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
                Our Portfolio
              </span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Featured <span className="italic">Architectural</span> Masterpieces
              </h2>
            </div>
            <Link to="/projects" className="text-xs uppercase tracking-[0.2em] font-bold border-b border-gold pb-2 hover:text-gold transition-colors">
              View All Projects
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white overflow-hidden card-shadow"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-navy">
                    {project.status}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-gold text-[10px] uppercase tracking-widest font-bold mb-1 block">
                        {project.type} • {project.location}
                      </span>
                      <h3 className="text-2xl font-serif group-hover:text-gold transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-ink/60 text-sm font-light mb-6 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center pt-6 border-t border-ink/5">
                    <span className="text-navy font-bold text-lg">{project.priceRange.split(' - ')[0]}</span>
                    <Link to={`/projects/${project.id}`} className="text-gold text-[10px] uppercase tracking-widest font-bold flex items-center group/btn">
                      Details
                      <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-32 bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 -skew-x-12 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
                The Vanguard Advantage
              </span>
              <h2 className="text-3xl md:text-5xl font-serif leading-tight mb-8">
                Why Discerning <br />
                <span className="italic">Homeowners</span> Choose Us
              </h2>
              <p className="text-white/80 font-light leading-relaxed mb-12 max-w-lg">
                For over 20 years, Vanguard Estates has been synonymous with quality, trust, and architectural innovation. We don't just build structures; we create environments where life flourishes.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm border border-gold/20">
                    <Shield className="text-gold" size={24} />
                  </div>
                  <h4 className="text-xl font-serif">Unmatched Quality</h4>
                  <p className="text-white/60 text-sm font-light">Rigorous quality checks and premium materials in every square foot.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm border border-gold/20">
                    <Clock className="text-gold" size={24} />
                  </div>
                  <h4 className="text-xl font-serif">On-Time Delivery</h4>
                  <p className="text-white/60 text-sm font-light">A track record of delivering projects on or before the promised date.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm border border-gold/20">
                    <Award className="text-gold" size={24} />
                  </div>
                  <h4 className="text-xl font-serif">Award Winning</h4>
                  <p className="text-white/60 text-sm font-light">Recognized nationally for excellence in design and sustainability.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm border border-gold/20">
                    <Star className="text-gold" size={24} />
                  </div>
                  <h4 className="text-xl font-serif">Customer First</h4>
                  <p className="text-white/60 text-sm font-light">Transparent processes and dedicated support throughout your journey.</p>
                </div>
              </div>
            </div>

            <div className="relative mt-12 lg:mt-0">
              <div className="aspect-[4/5] relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&w=800&q=80"
                  alt="Quality Construction"
                  className="w-full h-full object-cover rounded-sm"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold z-0 hidden md:block"></div>
              <div className="absolute top-10 -right-10 p-8 bg-white text-navy z-20 hidden md:block">
                <div className="text-5xl font-serif font-bold mb-2">20+</div>
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Years of Legacy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-paper overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              Voices of <span className="italic">Satisfaction</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Malhotra",
                role: "CEO, Tech Solutions",
                text: "Buying a home at Vanguard Heights was the best decision for my family. The attention to detail and the sea views are simply unmatched.",
                img: "https://i.pravatar.cc/150?u=rajesh"
              },
              {
                name: "Ananya Sharma",
                role: "Interior Designer",
                text: "As a designer, I appreciate the architectural integrity Vanguard brings to their projects. The space planning is exceptionally thoughtful.",
                img: "https://i.pravatar.cc/150?u=ananya"
              },
              {
                name: "Vikram Singh",
                role: "Investment Banker",
                text: "Vanguard Estates offers great ROI. Their projects are in prime locations and the construction quality ensures long-term value.",
                img: "https://i.pravatar.cc/150?u=vikram"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-10 card-shadow relative"
              >
                <div className="text-gold mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="inline-block fill-current" />)}
                </div>
                <p className="text-ink/70 font-light italic mb-8 leading-relaxed">
                  "{item.text}"
                </p>
                <div className="flex items-center space-x-4">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-serif text-lg leading-none mb-1">{item.name}</h4>
                    <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">{item.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gold relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-white text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Ready to find your <span className="italic">dream home?</span></h2>
              <p className="text-white/80 font-light max-w-xl">Schedule a free consultation with our luxury real estate experts today.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-10 py-4 bg-navy text-white text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-navy transition-all duration-300">
                Contact Us
              </Link>
              <Link to="/book-visit" className="px-10 py-4 bg-white text-navy text-xs uppercase tracking-widest font-bold hover:bg-navy hover:text-white transition-all duration-300">
                Book Site Visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
