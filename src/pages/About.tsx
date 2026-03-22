import { motion } from 'motion/react';
import { Award, Users, Building2, CheckCircle2 } from 'lucide-react';

export default function About() {
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
              Our Legacy
            </span>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
              Building <span className="italic">Excellence</span> Since 2004
            </h1>
            <p className="text-white/60 font-light leading-relaxed">
              Vanguard Estates is more than a real estate developer. We are creators of lifestyle, architects of dreams, and partners in your journey to finding the perfect home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-sm">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
                alt="Our Office" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold/10 -z-10 hidden md:block"></div>
          </div>
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-serif mb-6">Our Mission</h2>
              <p className="text-ink/70 font-light leading-relaxed text-lg">
                To redefine the standards of luxury living in India by delivering architectural masterpieces that combine innovation, sustainability, and timeless elegance.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-serif mb-6">Our Vision</h2>
              <p className="text-ink/70 font-light leading-relaxed text-lg">
                To be the most trusted and respected real estate developer in the country, known for our commitment to quality, transparency, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-serif text-gold">20+</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Years of Experience</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-serif text-gold">50+</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Projects Completed</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-serif text-gold">5k+</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Happy Families</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-serif text-gold">12+</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Industry Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
            Leadership
          </span>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight">
            The Minds Behind <span className="italic">Vanguard</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              name: "Vikram Malhotra",
              role: "Founder & Chairman",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
            },
            {
              name: "Sanjana Rao",
              role: "Chief Architect",
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
            },
            {
              name: "Arjun Kapoor",
              role: "Managing Director",
              img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
            }
          ].map((member, i) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] overflow-hidden mb-6 rounded-sm relative">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h4 className="text-2xl font-serif mb-1">{member.name}</h4>
              <p className="text-gold text-[10px] uppercase tracking-widest font-bold">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
