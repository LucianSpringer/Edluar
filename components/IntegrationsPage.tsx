import React, { useState } from 'react';
import { Search, ArrowRight, Calendar, MessageSquare, Video, Briefcase, Mail, Shield, CheckCircle2, Github } from 'lucide-react';
import { Button } from './Button';

export const IntegrationsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Communication', 'Calendar', 'HRIS & ATS', 'Video', 'Project Management', 'Collaboration'];

  const integrations = [
    {
      name: "Jira",
      category: "Project Management",
      description: "Agile project tracking tool used by dev teams to manage issues, sprints, and software releases.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5 11.5H17.2V23H5.8V17.3L11.5 11.5Z" fill="#2684FF"/>
          <path d="M17.3 5.8V23H11.6V11.5L17.3 5.8Z" fill="#0052CC"/>
          <path d="M5.8 17.3H11.5V23H5.8V17.3Z" fill="#0052CC"/>
        </svg>
      ),
      popular: true
    },
    {
      name: "Asana",
      category: "Project Management",
      description: "Project management tool for planning, tracking, and collaborating on tasks and workflows.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#F06A6A" fillOpacity="0.1"/>
          <circle cx="12" cy="7" r="3" fill="#F06A6A"/>
          <circle cx="16" cy="15" r="3" fill="#F06A6A"/>
          <circle cx="8" cy="15" r="3" fill="#F06A6A"/>
        </svg>
      ),
      popular: false
    },
    {
      name: "Github",
      category: "Project Management",
      description: "Code hosting platform for version collaboration and continuous development workflows.",
      icon: <Github className="w-8 h-8 text-gray-900 dark:text-white" />,
      popular: true
    },
    {
      name: "Google Workspace",
      category: "Calendar",
      description: "Sync interviews automatically with Google Calendar and generate Meet links instantly.",
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      popular: true
    },
    {
      name: "Google Drive",
      category: "Collaboration",
      description: "Cloud-based storage to upload, organize, and share files across teams in real-time.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 17.5H15.5L12 23L8.5 17.5Z" fill="#0066DA"/>
          <path d="M15.5 17.5L12 23L22 23L19 17.5H15.5Z" fill="#00AC47"/>
          <path d="M3 17.5H8.5L12 11.5L6.5 11.5L3 17.5Z" fill="#EA4335"/>
          <path d="M6.5 11.5L12 11.5L19 17.5L15.5 17.5L6.5 11.5Z" fill="#FFBA00"/>
          <path d="M12 2L6.5 11.5H12L15.5 5.5L12 2Z" fill="#00AC47"/>
          <path d="M15.5 5.5L19 11.5H13.5L10 5.5H15.5Z" fill="#0066DA"/>
        </svg>
      ),
      popular: true
    },
    {
      name: "Miro",
      category: "Collaboration",
      description: "Collaborative online whiteboard for brainstorming and mapping ideas.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21V9L8 6L12 12L16 6L21 9V21" stroke="#FFD02F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      popular: false
    },
    {
      name: "Trello",
      category: "Project Management",
      description: "Visual task board using cards and lists to manage projects with flexibility and ease.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="20" rx="3" transform="translate(2 2)" fill="#0079BF"/>
          <rect x="5" y="5" width="6" height="9" rx="1" fill="white"/>
          <rect x="13" y="5" width="6" height="6" rx="1" fill="white"/>
        </svg>
      ),
      popular: false
    },
    {
      name: "Slack",
      category: "Communication",
      description: "Get real-time notifications about candidate applications and team feedback directly in your channels.",
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      popular: true
    },
    {
      name: "Zoom",
      category: "Video",
      description: "Generate unique Zoom meeting links for every interview stage automatically.",
      icon: <Video className="w-8 h-8 text-blue-400" />,
      popular: false
    },
    {
      name: "Microsoft Outlook",
      category: "Calendar",
      description: "Seamless two-way sync with Outlook Calendar and Microsoft Teams integration.",
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      popular: false
    },
    {
      name: "Greenhouse",
      category: "HRIS & ATS",
      description: "Two-way sync of candidate data. Use Edluar for sourcing and Greenhouse for compliance.",
      icon: <Briefcase className="w-8 h-8 text-green-600" />,
      popular: true
    },
    {
      name: "LinkedIn",
      category: "HRIS & ATS",
      description: "Import candidate profiles directly from LinkedIn with our browser extension.",
      icon: <Briefcase className="w-8 h-8 text-blue-700" />,
      popular: true
    },
    {
      name: "BambooHR",
      category: "HRIS & ATS",
      description: "Automatically create employee profiles in BambooHR when a candidate is hired.",
      icon: <Briefcase className="w-8 h-8 text-green-500" />,
      popular: false
    },
    {
      name: "Discord",
      category: "Communication",
      description: "Receive pipeline updates and discuss candidates in private Discord threads.",
      icon: <MessageSquare className="w-8 h-8 text-indigo-500" />,
      popular: false
    },
    {
      name: "Okta",
      category: "Security",
      description: "Enterprise-grade SSO and identity management for your hiring team.",
      icon: <Shield className="w-8 h-8 text-gray-800 dark:text-white" />,
      popular: false
    }
  ];

  const filteredIntegrations = integrations.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-edluar-cream dark:bg-edluar-deep min-h-screen transition-colors duration-300 animate-fade-in-up">
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-6">
            Connect Edluar with your <br/>
            <span className="text-edluar-moss dark:text-edluar-sage">favorite tools.</span>
          </h1>
          <p className="text-xl text-edluar-dark/70 dark:text-edluar-cream/70 leading-relaxed max-w-2xl mx-auto mb-10">
            Streamline your workflow by integrating Edluar with the apps you use every day. No coding required.
          </p>
          
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-edluar-dark/40 dark:text-edluar-cream/40" />
            <input 
              type="text" 
              placeholder="Search integrations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-edluar-pale dark:border-edluar-moss/30 bg-white dark:bg-edluar-surface text-edluar-dark dark:text-edluar-cream shadow-lg focus:ring-2 focus:ring-edluar-moss focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8 sticky top-20 z-40 bg-edluar-cream/80 dark:bg-edluar-deep/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-center flex-wrap gap-2">
           {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-edluar-dark text-white dark:bg-edluar-cream dark:text-edluar-dark shadow-md'
                    : 'bg-white dark:bg-edluar-surface text-edluar-dark dark:text-edluar-cream hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 border border-edluar-pale/50 dark:border-edluar-moss/20'
                }`}
              >
                {cat}
              </button>
           ))}
        </div>
      </section>

      {/* Grid */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-edluar-surface p-6 rounded-2xl border border-edluar-pale/50 dark:border-edluar-moss/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-14 h-14 bg-edluar-cream dark:bg-black/20 rounded-xl flex items-center justify-center">
                        {item.icon}
                     </div>
                     {item.popular && (
                       <span className="px-2 py-1 bg-edluar-moss/10 text-edluar-moss dark:text-edluar-pale text-xs font-bold uppercase tracking-wider rounded-md">
                         Popular
                       </span>
                     )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-2">{item.name}</h3>
                  <p className="text-edluar-dark/70 dark:text-edluar-cream/70 text-sm mb-6 flex-grow leading-relaxed">
                    {item.description}
                  </p>
                  
                  <button className="flex items-center text-edluar-moss dark:text-edluar-sage font-medium text-sm group-hover:underline decoration-2 underline-offset-4 mt-auto">
                    Connect <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
           </div>
           
           {filteredIntegrations.length === 0 && (
              <div className="text-center py-20">
                 <p className="text-lg text-edluar-dark/60 dark:text-edluar-cream/60">No integrations found matching your criteria.</p>
                 <button 
                    onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                    className="mt-4 text-edluar-moss underline font-medium"
                 >
                    Clear filters
                 </button>
              </div>
           )}

           {/* Request Integration */}
           <div className="mt-20 bg-edluar-moss dark:bg-edluar-surface rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                 <h2 className="text-3xl font-serif font-bold mb-4">Missing a tool?</h2>
                 <p className="text-edluar-pale/90 mb-8 text-lg">
                   We are constantly adding new integrations. Let us know what you need to build your perfect stack.
                 </p>
                 <Button variant="secondary" className="bg-white text-edluar-moss hover:bg-edluar-pale">
                   Request Integration
                 </Button>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};