import React, { useRef, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { AIDemo } from './components/AIDemo';
import { Button } from './components/Button';
import { AboutPage } from './components/AboutPage';
import { CareersPage } from './components/CareersPage';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { IntegrationsPage } from './components/IntegrationsPage';
import { ChangelogPage } from './components/ChangelogPage';
import {
  Users,
  BarChart3,
  Calendar,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Quote,
  Trees,
  CloudSun,
  Sprout,
  Flower2,
  Plus,
  Minus,
  Linkedin,
  Twitter,
  Share2,
  ArrowUp,
  HelpCircle,
  Hexagon,
  Boxes,
  Github
} from 'lucide-react';

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Unified Team Collaboration",
      description: "Seamlessly align your hiring team with shared notes, real-time feedback, and transparent decision-making tools."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Growth-Centric Analytics",
      description: "Gain actionable insights into your pipeline health with intuitive visualizations that identify bottlenecks instantly."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Automated Orchestration",
      description: "Eliminate scheduling friction. Let candidates book interviews based on your team's live availability."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Fairness-First Screening",
      description: "Minimize unconscious bias with AI-driven skill highlighting, ensuring you build a diverse and capable workforce."
    }
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 bg-white dark:bg-edluar-deep relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-edluar-pale/20 dark:bg-edluar-moss/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">
            The Ecosystem for Modern Hiring
          </h2>
          <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/60">
            Powerful tools designed to feel natural, ensuring you focus on what matters: the people.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl bg-edluar-cream/30 dark:bg-edluar-surface/50 border border-edluar-pale dark:border-edluar-moss/20 hover:bg-white dark:hover:bg-edluar-surface hover:shadow-xl hover:shadow-edluar-moss/5 dark:hover:shadow-none transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-edluar-pale dark:bg-edluar-moss/30 flex items-center justify-center text-edluar-moss dark:text-edluar-pale mb-6 group-hover:scale-110 transition-transform relative group/icon">
                {feature.icon}
                {/* Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-edluar-dark dark:bg-edluar-cream text-edluar-cream dark:text-edluar-dark text-xs rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-md">
                  {feature.title}
                </span>
                {/* Tooltip Triangle */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-edluar-dark dark:bg-edluar-cream rotate-45 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200"></div>
              </div>
              <h3 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-3">{feature.title}</h3>
              <p className="text-edluar-dark/70 dark:text-edluar-cream/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IntegrationsSection = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const integrations = [
    {
      name: "Jira",
      desc: "Agile project tracking tool used by dev teams to manage issues, sprints, and software releases.",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5 11.5H17.2V23H5.8V17.3L11.5 11.5Z" fill="#2684FF" />
          <path d="M17.3 5.8V23H11.6V11.5L17.3 5.8Z" fill="#0052CC" />
          <path d="M5.8 17.3H11.5V23H5.8V17.3Z" fill="#0052CC" />
        </svg>
      )
    },
    {
      name: "Asana",
      desc: "Project management tool for planning, tracking, and collaborating on tasks and workflows.",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#F06A6A" fillOpacity="0.1" />
          <circle cx="12" cy="7" r="3" fill="#F06A6A" />
          <circle cx="16" cy="15" r="3" fill="#F06A6A" />
          <circle cx="8" cy="15" r="3" fill="#F06A6A" />
        </svg>
      )
    },
    {
      name: "Github",
      desc: "Code hosting platform for version collaboration and continuous development workflows.",
      logo: <Github className="w-8 h-8 text-gray-900 dark:text-white" />
    },
    {
      name: "Google Drive",
      desc: "Cloud-based storage to upload, organize, and share files across teams in real-time.",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 17.5H15.5L12 23L8.5 17.5Z" fill="#0066DA" />
          <path d="M15.5 17.5L12 23L22 23L19 17.5H15.5Z" fill="#00AC47" />
          <path d="M3 17.5H8.5L12 11.5L6.5 11.5L3 17.5Z" fill="#EA4335" />
          <path d="M6.5 11.5L12 11.5L19 17.5L15.5 17.5L6.5 11.5Z" fill="#FFBA00" />
          <path d="M12 2L6.5 11.5H12L15.5 5.5L12 2Z" fill="#00AC47" />
          <path d="M15.5 5.5L19 11.5H13.5L10 5.5H15.5Z" fill="#0066DA" />
        </svg>
      )
    },
    {
      name: "Miro",
      desc: "Collaborative online whiteboard for brainstorming and mapping ideas.",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21V9L8 6L12 12L16 6L21 9V21" stroke="#FFD02F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: "Trello",
      desc: "Visual task board using cards and lists to manage projects with flexibility and ease.",
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="20" rx="3" transform="translate(2 2)" fill="#0079BF" />
          <rect x="5" y="5" width="6" height="9" rx="1" fill="white" />
          <rect x="13" y="5" width="6" height="6" rx="1" fill="white" />
        </svg>
      )
    }
  ];

  return (
    <section
      id="integrations"
      ref={sectionRef}
      className="py-24 bg-edluar-cream dark:bg-edluar-deep border-t border-edluar-pale/30 dark:border-edluar-moss/20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">
              Features apps
            </h2>
            <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/60">
              Connect with your favorite tools to streamline your workflow.
            </p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('integrations')}>
            View all integrations <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-edluar-surface p-6 rounded-2xl border border-edluar-pale dark:border-edluar-moss/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group flex flex-col ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white dark:bg-edluar-surface rounded-xl flex items-center justify-center border border-edluar-pale/30 dark:border-edluar-moss/20 group-hover:scale-110 transition-transform duration-300">
                  {item.logo}
                </div>
              </div>
              <h3 className="text-lg font-bold text-edluar-dark dark:text-edluar-cream mb-2">
                {item.name}
              </h3>
              <p className="text-edluar-dark/70 dark:text-edluar-cream/70 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = ({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Agencies', 'Tech', 'Product'];

  const stories = [
    {
      company: "Canopy Corp",
      logo: (
        <div className="flex items-center gap-2 text-white">
          <Trees className="w-10 h-10" />
          <span className="text-3xl font-bold">Canopy</span>
        </div>
      ),
      category: "Agencies",
      headline: "How Canopy Corp grew their remote team by 200% sustainably.",
      bgColor: "bg-[#2F3E30]", // Dark Green
      id: 101
    },
    {
      company: "Nimbus",
      logo: (
        <div className="flex items-center gap-2 text-sky-900">
          <CloudSun className="w-10 h-10" />
          <span className="text-3xl font-black tracking-tight">Nimbus</span>
        </div>
      ),
      category: "Tech",
      headline: "How Nimbus Reduced Time-to-Hire by 40%",
      bgColor: "bg-[#E0F2FE]", // Sky Blue
      id: 2
    },
    {
      company: "Sprout Labs",
      logo: (
        <div className="flex items-center gap-2 text-edluar-dark">
          <Sprout className="w-10 h-10" />
          <span className="text-3xl font-bold">Sprout</span>
        </div>
      ),
      category: "Product",
      headline: "Cultivating top engineering talent from the ground up.",
      bgColor: "bg-edluar-pale", // Pale Green
      id: 0
    },
    {
      company: "Flora Fin",
      logo: (
        <div className="flex items-center gap-2 text-rose-900">
          <Flower2 className="w-10 h-10" />
          <span className="text-3xl font-serif italic font-bold">Flora Fin</span>
        </div>
      ),
      category: "Tech",
      headline: "Flora Fin's organic approach to high-stakes financial hiring.",
      bgColor: "bg-[#FFF1F2]", // Rose
      id: 102
    },
    {
      company: "Evergreen",
      logo: (
        <div className="flex items-center gap-2 text-edluar-dark">
          <Leaf className="w-10 h-10" />
          <span className="text-3xl font-bold">Evergreen</span>
        </div>
      ),
      category: "Agencies",
      headline: "Keeping candidate relationships fresh with automated nurturing.",
      bgColor: "bg-edluar-cream", // Cream
      id: 103
    },
    {
      company: "Summit Systems",
      logo: (
        <div className="flex items-center gap-2 text-white">
          <BarChart3 className="w-10 h-10" />
          <span className="text-3xl font-bold">SUMMIT</span>
        </div>
      ),
      category: "Tech",
      headline: "Scaling to the summit: Hiring 50 devs in 3 months.",
      bgColor: "bg-gray-900", // Dark Gray
      id: 104
    }
  ];

  const filteredStories = activeFilter === 'All'
    ? stories
    : stories.filter(s => s.category === activeFilter);

  return (
    <section id="customer" className="py-24 bg-white dark:bg-edluar-deep transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 items-end">
          <h2 className="text-6xl md:text-7xl font-serif font-black text-edluar-dark dark:text-edluar-cream leading-[0.9] tracking-tight">
            Customer <br /> stories
          </h2>
          <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/60 md:pl-10 leading-relaxed">
            Thousands of teams rely on Edluar to hire better, manage HR smoothly, and create a recruitment experience everyone loves. See what they've built with us.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeFilter === filter
                  ? 'bg-edluar-dark text-white dark:bg-edluar-cream dark:text-edluar-dark'
                  : 'bg-transparent text-edluar-dark dark:text-edluar-cream hover:bg-edluar-pale/30 dark:hover:bg-edluar-moss/20'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Story Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story, i) => (
            <div
              key={i}
              className="group cursor-pointer flex flex-col h-full"
              onClick={() => story.id > 0 ? onNavigate('blog-post', { id: story.id }) : onNavigate('blog')}
            >
              {/* Logo Area */}
              <div className={`h-64 rounded-2xl ${story.bgColor} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-[1.02] shadow-sm border border-black/5 dark:border-white/5`}>
                {story.logo}
              </div>

              {/* Text Area */}
              <div className="flex flex-col flex-grow">
                <span className="text-xs font-bold uppercase tracking-wider text-edluar-dark dark:text-edluar-cream mb-3">
                  {story.category}
                </span>
                <h3 className="text-xl font-medium text-edluar-dark dark:text-edluar-cream leading-snug group-hover:underline decoration-2 decoration-edluar-pale underline-offset-4">
                  {story.headline}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = ({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tiers = [
    {
      name: "Seedling",
      price: "$0",
      desc: "For small teams just starting out.",
      features: [
        { text: "1 Active Job", tooltip: "Only one job post can be live at a time." },
        { text: "50 Candidates", tooltip: "Store up to 50 candidate profiles." },
        "Basic Pipeline"
      ]
    },
    {
      name: "Sapling",
      price: "$49",
      desc: "For growing companies hiring regularly.",
      features: [
        "10 Active Jobs",
        "Unlimited Candidates",
        { text: "AI Descriptions", tag: "Limited", tooltip: "Generate up to 10 AI job descriptions per month." },
        "Email Integration"
      ],
      popular: true
    },
    {
      name: "Forest",
      price: "$199",
      desc: "For large organizations with multiple teams.",
      features: [
        "Unlimited Jobs",
        "Unlimited Candidates",
        { text: "Advanced Analytics", tooltip: "Full reporting suite and custom dashboards." },
        "Dedicated Success Mgr"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-edluar-cream dark:bg-edluar-deep transition-colors duration-300" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/60">Start small and grow naturally.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded-3xl bg-white dark:bg-edluar-surface border ${tier.popular ? 'border-edluar-moss ring-4 ring-edluar-moss/10 dark:ring-edluar-moss/20' : 'border-edluar-pale dark:border-edluar-moss/20'} flex flex-col transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-edluar-moss text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-2">{tier.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-edluar-moss dark:text-edluar-sage">{tier.price}</span>
                <span className="text-edluar-dark/60 dark:text-edluar-cream/60 ml-2">/month</span>
              </div>
              <p className="text-edluar-dark/70 dark:text-edluar-cream/70 mb-8">{tier.desc}</p>
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((f, i) => {
                  const isObject = typeof f !== 'string';
                  const text = isObject ? f.text : f;
                  const tag = isObject ? f.tag : null;
                  const tooltip = isObject ? f.tooltip : null;

                  return (
                    <li key={i} className="flex items-center space-x-3 text-edluar-dark/80 dark:text-edluar-cream/80 group relative">
                      <CheckCircle2 className="w-5 h-5 text-edluar-sage shrink-0" />
                      <div className="flex items-center flex-wrap">
                        <span className={`border-b border-transparent ${tooltip ? 'border-dashed border-edluar-pale dark:border-edluar-moss cursor-help' : ''}`}>
                          {text}
                        </span>
                        {tag && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-edluar-pale/50 dark:bg-edluar-moss/30 text-edluar-dark/70 dark:text-edluar-cream/70 text-[10px] uppercase font-bold tracking-wider border border-edluar-sage/30 dark:border-edluar-moss/30">
                            {tag}
                          </span>
                        )}
                        {tooltip && (
                          <HelpCircle className="w-3 h-3 ml-1 text-edluar-pale dark:text-edluar-moss opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>

                      {/* Tooltip Popup */}
                      {tooltip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-edluar-dark dark:bg-edluar-cream text-white dark:text-edluar-dark text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center">
                          {tooltip}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-edluar-dark dark:bg-edluar-cream rotate-45 -mt-1"></div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Button
                variant={tier.popular ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => onNavigate('login', { mode: 'signup' })}
              >
                Choose {tier.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the AI description generation work?",
      answer: "Edluar uses advanced generative AI models to analyze the role title and key skills you provide. It creates a structured, inclusive, and professional job description tailored to attract the best candidates, saving you hours of writing time."
    },
    {
      question: "Can I integrate Edluar with my existing calendar?",
      answer: "Yes! Edluar integrates seamlessly with Google Calendar and Outlook. Candidates can book interviews based on real-time availability from your team's calendars, eliminating the back-and-forth email tag."
    },
    {
      question: "Is there a limit to how many team members I can invite?",
      answer: "On the Forest plan, you can invite unlimited team members. For Seedling and Sapling plans, there are soft limits, but we believe in collaboration, so additional seats can be added for a small nominal fee."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white dark:bg-edluar-deep border-b border-edluar-pale/30 dark:border-edluar-moss/20 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/60">Everything you need to know about Edluar.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-edluar-pale dark:border-edluar-moss/30 rounded-2xl overflow-hidden bg-edluar-cream/20 dark:bg-edluar-surface/20"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:bg-edluar-pale/20 dark:focus:bg-edluar-surface/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-edluar-dark dark:text-edluar-cream">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-edluar-moss dark:text-edluar-sage flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-edluar-moss dark:text-edluar-sage flex-shrink-0" />
                )}
              </button>
              <div
                className={`px-6 text-edluar-dark/80 dark:text-edluar-cream/80 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <footer className="bg-edluar-dark dark:bg-[#0f1410] text-edluar-cream py-16 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
            <Leaf className="w-6 h-6 text-edluar-pale" />
            <span className="text-2xl font-serif font-bold">Edluar</span>
          </div>
          <p className="text-edluar-cream/60 max-w-sm">
            Cultivating the future of work with tools that feel natural, not mechanical. Join us in making hiring human again.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-white">Product</h4>
          <ul className="space-y-3 text-edluar-cream/60">
            <li><button onClick={() => onNavigate('features')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">Features</button></li>
            <li><button onClick={() => onNavigate('integrations')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">Integrations</button></li>
            <li><button onClick={() => onNavigate('pricing')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">Pricing</button></li>
            <li><button onClick={() => onNavigate('changelog')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">Changelog</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-white">Company</h4>
          <ul className="space-y-3 text-edluar-cream/60">
            <li><button onClick={() => onNavigate('about')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">About Us</button></li>
            <li><button onClick={() => onNavigate('careers')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">Careers</button></li>
            <li><button onClick={() => onNavigate('blog')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">Blog</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">Contact</button></li>
            <li><button onClick={() => onNavigate('privacy')} className="hover:text-white hover:underline decoration-edluar-pale decoration-2 transition-all text-left">Privacy Policy</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-edluar-cream/10 mt-16 pt-8 text-center text-sm text-edluar-cream/40">
        © {new Date().getFullYear()} Edluar Inc. All rights reserved.
      </div>
    </div>
  </footer>
);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full bg-edluar-moss dark:bg-edluar-sage text-white shadow-lg hover:bg-edluar-dark dark:hover:bg-edluar-moss focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss dark:focus:ring-offset-edluar-deep transition-all duration-500 ease-in-out z-50 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState('home');
  const [navParams, setNavParams] = useState<any>({});
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Logic
  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleNavigate = (target: string, params?: any) => {
    setNavParams(params || {});

    if (target === 'login') {
      setAuthMode(params?.mode || 'login');
    }

    if (target === 'about') {
      setPage('about');
      window.scrollTo(0, 0);
    } else if (target === 'careers') {
      setPage('careers');
      window.scrollTo(0, 0);
    } else if (target === 'blog') {
      setPage('blog');
      window.scrollTo(0, 0);
    } else if (target === 'blog-post') {
      setPage('blog-post');
      window.scrollTo(0, 0);
    } else if (target === 'contact') {
      setPage('contact');
      window.scrollTo(0, 0);
    } else if (target === 'privacy') {
      setPage('privacy');
      window.scrollTo(0, 0);
    } else if (target === 'login') {
      setPage('login');
      window.scrollTo(0, 0);
    } else if (target === 'dashboard') {
      setPage('dashboard');
      window.scrollTo(0, 0);
    } else if (target === 'integrations') {
      setPage('integrations');
      window.scrollTo(0, 0);
    } else if (target === 'changelog') {
      setPage('changelog');
      window.scrollTo(0, 0);
    } else {
      setPage('home');
      // If navigating to home specific section, logic is handled in header click or below
      // For Footer clicks on home sections:
      if (['features', 'integrations', 'customer', 'pricing', 'faq'].includes(target)) {
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-edluar-cream dark:bg-edluar-deep transition-colors duration-300">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentPage={page} onNavigate={handleNavigate} />
        <LoginPage onNavigate={handleNavigate} initialMode={authMode} />
      </div>
    );
  }

  if (page === 'dashboard') {
    return (
      <div className="min-h-screen bg-edluar-cream dark:bg-edluar-deep transition-colors duration-300 font-sans">
        <DashboardPage onNavigate={handleNavigate} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-edluar-cream dark:bg-edluar-deep selection:bg-edluar-pale dark:selection:bg-edluar-moss selection:text-edluar-dark dark:selection:text-white transition-colors duration-300">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} currentPage={page} onNavigate={handleNavigate} />

      {page === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="relative pt-20 pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-edluar-surface/60 backdrop-blur-sm border border-edluar-pale dark:border-edluar-moss/30 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up transition-colors duration-300">
                  <span className="flex h-2 w-2 rounded-full bg-edluar-moss dark:bg-edluar-sage animate-pulse"></span>
                  <span className="text-sm font-medium text-edluar-dark/80 dark:text-edluar-cream/80">Edluar 2.0 is now live</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-8 leading-tight tracking-tight">
                  Cultivate Your Dream Team with <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-edluar-moss to-edluar-sage dark:from-edluar-sage dark:to-edluar-pale">Intelligent Simplicity.</span>
                </h1>

                <p className="text-xl text-edluar-dark/70 dark:text-edluar-cream/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Edluar combines organic workflows with AI precision to make recruitment human again. Grow your workforce sustainably.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => handleNavigate('login', { mode: 'signup' })}
                  >
                    Start Free Trial
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                    Watch Demo
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Abstract Hero Visual using Palette */}
              <div className="mt-20 relative mx-auto max-w-5xl">
                <div className="aspect-[16/9] bg-gradient-to-tr from-edluar-sage to-edluar-pale dark:from-edluar-moss dark:to-edluar-sage rounded-2xl shadow-2xl overflow-hidden relative border-4 border-white/50 dark:border-edluar-surface/50">
                  {/* Mock UI Elements */}
                  <div className="absolute inset-4 bg-edluar-cream/90 dark:bg-edluar-deep/90 backdrop-blur rounded-xl shadow-inner p-6 transition-colors duration-300">
                    <div className="flex justify-between items-center mb-8 border-b border-edluar-pale dark:border-edluar-moss/30 pb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-300 dark:bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-300 dark:bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-300 dark:bg-green-400"></div>
                      </div>
                      <div className="h-4 w-32 bg-edluar-pale dark:bg-edluar-moss/30 rounded-full"></div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-1/4 space-y-3">
                        <div className="h-24 bg-white dark:bg-edluar-surface rounded-lg shadow-sm border border-edluar-pale dark:border-edluar-moss/20 p-3">
                          <div className="h-2 w-12 bg-edluar-sage dark:bg-edluar-moss rounded mb-2"></div>
                          <div className="h-2 w-20 bg-edluar-pale dark:bg-edluar-moss/40 rounded"></div>
                        </div>
                        <div className="h-24 bg-white dark:bg-edluar-surface rounded-lg shadow-sm border border-edluar-pale dark:border-edluar-moss/20 p-3 opacity-70"></div>
                        <div className="h-24 bg-white dark:bg-edluar-surface rounded-lg shadow-sm border border-edluar-pale dark:border-edluar-moss/20 p-3 opacity-50"></div>
                      </div>
                      <div className="flex-1 bg-white dark:bg-edluar-surface rounded-lg shadow-sm border border-edluar-pale dark:border-edluar-moss/20 p-6 space-y-4">
                        <div className="flex justify-between">
                          <div className="h-8 w-48 bg-edluar-dark/10 dark:bg-edluar-cream/10 rounded"></div>
                          <div className="h-8 w-24 bg-edluar-moss rounded text-white text-xs flex items-center justify-center">Hire</div>
                        </div>
                        <div className="h-4 w-full bg-edluar-cream dark:bg-edluar-deep/50 rounded"></div>
                        <div className="h-4 w-3/4 bg-edluar-cream dark:bg-edluar-deep/50 rounded"></div>
                        <div className="h-32 w-full bg-edluar-cream dark:bg-edluar-deep/50 rounded mt-4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorative Circles with Parallax & Organic Float Animation */}
            <div
              className="absolute top-1/4 -left-20 w-96 h-96 bg-edluar-pale/30 dark:bg-edluar-moss/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal filter transition-all duration-100 ease-linear animate-float"
              style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            ></div>
            <div
              className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-edluar-sage/20 dark:bg-edluar-moss/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal filter transition-all duration-100 ease-linear animate-float-delayed"
              style={{ transform: `translateY(${-scrollY * 0.1}px)` }}
            ></div>
          </section>

          <FeaturesSection />
          <IntegrationsSection onNavigate={handleNavigate} />
          <TestimonialsSection onNavigate={handleNavigate} />
          <AIDemo />
          <PricingSection onNavigate={handleNavigate} />
          <FAQSection />
        </>
      ) : page === 'about' ? (
        <AboutPage />
      ) : page === 'careers' ? (
        <CareersPage />
      ) : page === 'blog' ? (
        <BlogPage onNavigate={handleNavigate} />
      ) : page === 'blog-post' ? (
        <BlogPostPage postId={navParams.id} onNavigate={handleNavigate} />
      ) : page === 'contact' ? (
        <ContactPage />
      ) : page === 'privacy' ? (
        <PrivacyPolicyPage />
      ) : page === 'integrations' ? (
        <IntegrationsPage />
      ) : page === 'changelog' ? (
        <ChangelogPage onNavigate={handleNavigate} />
      ) : null}

      <Footer onNavigate={handleNavigate} />
      <ScrollToTop />
    </div>
  );
};

export default App;