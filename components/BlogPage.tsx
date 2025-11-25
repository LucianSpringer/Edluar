import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from './Button';
import { blogPosts } from '../data/blogData';

interface BlogPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Culture', 'Hiring Tips', 'Product Updates', 'Case Studies'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-edluar-cream dark:bg-edluar-deep min-h-screen transition-colors duration-300 animate-fade-in-up">
      
      {/* Page Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-edluar-pale/30 dark:border-edluar-moss/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-edluar-moss/10 text-edluar-moss dark:text-edluar-pale text-sm font-semibold mb-4">
              <span>Fresh Thinking</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-edluar-dark dark:text-edluar-cream">
              Our Blog
            </h1>
          </div>
          
          <div className="flex items-center bg-white dark:bg-edluar-surface px-4 py-2 rounded-full border border-edluar-pale dark:border-edluar-moss/30 shadow-sm w-full md:w-auto">
            <Search className="w-4 h-4 text-edluar-dark/50 dark:text-edluar-cream/50 mr-2" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-edluar-dark dark:text-edluar-cream placeholder-edluar-dark/40 dark:placeholder-edluar-cream/40 w-full md:w-48"
            />
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-edluar-cream/50 dark:bg-edluar-deep sticky top-20 z-40 backdrop-blur-md border-b border-edluar-pale/30 dark:border-edluar-moss/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto custom-scrollbar">
          <div className="flex space-x-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-edluar-dark text-white dark:bg-edluar-cream dark:text-edluar-dark shadow-md transform scale-105'
                    : 'bg-transparent text-edluar-dark dark:text-edluar-cream hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 border border-transparent hover:border-edluar-pale'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
             <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-edluar-dark dark:text-edluar-cream mb-2">No posts found</h3>
                <p className="text-edluar-dark/60 dark:text-edluar-cream/60">Try adjusting your search or filters.</p>
                <button 
                   onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                   className="mt-4 text-edluar-moss underline"
                >
                   Clear filters
                </button>
             </div>
          ) : (
            /* We use a grid layout where the featured post takes more space */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {filteredPosts.map((post, idx) => {
                // If it's the first post and we are on "All", make it featured style
                const isBigCard = idx === 0 && activeCategory === 'All' && !searchQuery;
                
                return (
                  <div 
                    key={post.id}
                    onClick={() => onNavigate('blog-post', { id: post.id })}
                    className={`group cursor-pointer relative bg-white dark:bg-edluar-surface rounded-2xl overflow-hidden border border-edluar-pale/50 dark:border-edluar-moss/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col ${
                      isBigCard ? 'lg:col-span-2 lg:row-span-2 min-h-[500px]' : 'col-span-1 min-h-[400px]'
                    }`}
                  >
                    {/* Image Container */}
                    <div className={`relative overflow-hidden ${isBigCard ? 'h-full absolute inset-0 z-0' : 'h-48 shrink-0'}`}>
                      {/* Dark Mode Only Overlay to dim image */}
                      <div className={`absolute inset-0 bg-black/0 dark:bg-black/40 transition-colors z-10 ${isBigCard ? 'block' : 'hidden'}`}></div>
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-edluar-cream via-edluar-cream/80 to-transparent dark:from-edluar-deep dark:via-edluar-deep/90 dark:to-transparent z-10 ${isBigCard ? 'block' : 'hidden'}`}></div>
                      
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700`}
                      />
                    </div>

                    {/* Content Container */}
                    <div className={`relative z-20 flex flex-col h-full ${
                      isBigCard 
                        ? 'justify-end p-8 md:p-12' 
                        : 'p-6 flex-grow'
                    }`}>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          isBigCard 
                            ? 'bg-edluar-moss text-white' 
                            : 'bg-edluar-pale/50 dark:bg-edluar-moss/30 text-edluar-dark dark:text-edluar-pale'
                        }`}>
                          {post.category}
                        </span>
                        <span className={`flex items-center text-xs ${isBigCard ? 'text-edluar-dark dark:text-edluar-cream' : 'text-edluar-dark/60 dark:text-edluar-cream/60'}`}>
                          <Calendar className="w-3 h-3 mr-1" />
                          {post.date}
                        </span>
                        <span className={`flex items-center text-xs ${isBigCard ? 'text-edluar-dark dark:text-edluar-cream' : 'text-edluar-dark/60 dark:text-edluar-cream/60'}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className={`font-serif font-bold mb-3 group-hover:underline decoration-2 underline-offset-4 ${
                        isBigCard 
                          ? 'text-3xl md:text-5xl text-edluar-dark dark:text-white decoration-edluar-pale' 
                          : 'text-xl text-edluar-dark dark:text-edluar-cream decoration-edluar-moss'
                      }`}>
                        {post.title}
                      </h2>

                      <p className={`mb-6 line-clamp-3 ${
                        isBigCard 
                          ? 'text-edluar-dark/90 dark:text-edluar-cream/90 text-lg max-w-2xl' 
                          : 'text-edluar-dark/70 dark:text-edluar-cream/70 text-sm'
                      }`}>
                        {post.excerpt}
                      </p>

                      {!isBigCard && (
                        <div className="mt-auto pt-4 flex items-center text-edluar-moss dark:text-edluar-pale font-medium text-sm group-hover:translate-x-1 transition-transform">
                          Read Article <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Newsletter CTA inserted into grid */}
              <div className="bg-edluar-moss dark:bg-edluar-surface rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-lg border border-white/10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
                 <h3 className="text-2xl font-serif font-bold text-white mb-2 relative z-10">Stay in the loop</h3>
                 <p className="text-edluar-pale mb-6 text-sm relative z-10">Get the latest hiring trends and Edluar updates delivered to your inbox.</p>
                 <div className="w-full relative z-10">
                   <input 
                     type="email" 
                     placeholder="Enter your email" 
                     className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-edluar-pale mb-3 transition-all"
                   />
                   <Button variant="secondary" className="w-full">Subscribe</Button>
                 </div>
              </div>

            </div>
          )}

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-center space-x-4">
            <button className="p-2 rounded-full hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 text-edluar-dark dark:text-edluar-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors" disabled>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex space-x-2">
              <button className="w-10 h-10 rounded-full bg-edluar-dark text-white dark:bg-edluar-cream dark:text-edluar-dark font-medium shadow-md">1</button>
              <button className="w-10 h-10 rounded-full hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 text-edluar-dark dark:text-edluar-cream font-medium transition-colors">2</button>
              <button className="w-10 h-10 rounded-full hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 text-edluar-dark dark:text-edluar-cream font-medium transition-colors">3</button>
              <span className="w-10 h-10 flex items-center justify-center text-edluar-dark dark:text-edluar-cream">...</span>
            </div>
            <button className="p-2 rounded-full hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 text-edluar-dark dark:text-edluar-cream transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
