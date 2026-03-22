import { motion } from 'motion/react';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const posts = [
  {
    id: 'buying-tips',
    title: 'Top 10 Tips for First-Time Home Buyers in India',
    excerpt: 'Navigating the real estate market can be daunting. Here is our comprehensive guide to help you make the right choice.',
    date: 'March 15, 2026',
    author: 'Vanguard Editorial',
    category: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'real-estate-trends',
    title: 'Real Estate Trends to Watch in 2026',
    excerpt: 'From sustainable architecture to smart home integration, discover what is shaping the future of luxury living.',
    date: 'March 10, 2026',
    author: 'Arjun Kapoor',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'investment-advice',
    title: 'Why Real Estate Remains the Safest Long-Term Investment',
    excerpt: 'Explore the historical performance of real estate assets and why they should be a part of your portfolio.',
    date: 'March 05, 2026',
    author: 'Vikram Malhotra',
    category: 'Investment',
    image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&w=800&q=80'
  }
];

export default function Blog() {
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
              Insights & News
            </span>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
              The Vanguard <span className="italic">Journal</span>
            </h1>
            <p className="text-white/60 font-light leading-relaxed">
              Expert advice, market trends, and lifestyle inspiration from the leaders in luxury real estate.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white overflow-hidden card-shadow flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-gold text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                  {post.category}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest text-ink/40 font-bold mb-4">
                    <div className="flex items-center"><Calendar size={12} className="mr-1" /> {post.date}</div>
                    <div className="flex items-center"><User size={12} className="mr-1" /> {post.author}</div>
                  </div>
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-gold transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-ink/60 text-sm font-light mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <Link to="#" className="text-gold text-[10px] uppercase tracking-widest font-bold flex items-center group/btn mt-auto">
                  Read Article
                  <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
