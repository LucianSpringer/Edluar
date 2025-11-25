
import React, { useState } from 'react';
import { 
  Heart, 
  Zap, 
  Coffee, 
  Globe, 
  Smile, 
  Laptop, 
  ArrowRight,
  MapPin,
  Briefcase,
  Search,
  Bell,
  Phone,
  FileText,
  Users,
  Award,
  Mail,
  HelpCircle,
  X,
  Upload,
  Check
} from 'lucide-react';
import { Button } from './Button';

interface Job {
  title: string;
  location: string;
  type: string;
  contract: string;
}

export const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);

  const benefits = [
    { icon: <Globe className="w-6 h-6" />, title: "Remote-First", desc: "Work from anywhere. We trust you to do your best work, wherever you are." },
    { icon: <Heart className="w-6 h-6" />, title: "Health & Wellness", desc: "Comprehensive coverage and mental health days to keep you feeling your best." },
    { icon: <Zap className="w-6 h-6" />, title: "Growth Budget", desc: "$2,000 annual stipend for courses, books, and conferences." },
    { icon: <Coffee className="w-6 h-6" />, title: "Sabbaticals", desc: "Take 4 weeks off paid after every 4 years of service to recharge." },
    { icon: <Laptop className="w-6 h-6" />, title: "Home Office", desc: "Generous setup allowance to build your perfect workspace." },
    { icon: <Smile className="w-6 h-6" />, title: "Team Retreats", desc: "Bi-annual meetups in beautiful locations to connect in person." },
  ];

  const steps = [
    { icon: <FileText className="w-6 h-6" />, title: "Application", desc: "We'll ask for some personal info and a couple of questions about what drives you." },
    { icon: <Phone className="w-6 h-6" />, title: "Phone chat", desc: "A video call where we can get to know each other a bit better and discuss practicalities." },
    { icon: <Briefcase className="w-6 h-6" />, title: "Assignment", desc: "An opportunity to present past work or a small exercise to show your skills." },
    { icon: <Users className="w-6 h-6" />, title: "First interview", desc: "Chats with people from Edluar so you can learn more about how we work." },
    { icon: <Users className="w-6 h-6" />, title: "Second interview", desc: "10-minute presentation on a chosen subject and an informal chat." },
    { icon: <Award className="w-6 h-6" />, title: "Offer", desc: "Put on your reading glasses! If we're good to go, let's get that pen out and sign." },
  ];

  const jobs: Job[] = [
    { title: "Sales Manager", location: "Oxfordshire, United Kingdom", type: "Sales", contract: "Full-time" },
    { title: "People Operations Executive", location: "Amsterdam", type: "People", contract: "Full-time" },
    { title: "Senior Product Designer", location: "Remote (EU)", type: "Product", contract: "Full-time" },
    { title: "Frontend Engineer", location: "Remote (Global)", type: "Engineering", contract: "Full-time" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplicationSubmitted(true);
    setTimeout(() => {
      setIsApplicationSubmitted(false);
      setSelectedJob(null);
    }, 2000);
  };

  return (
    <div className="bg-edluar-cream dark:bg-edluar-deep min-h-screen transition-colors duration-300 animate-fade-in-up">
      
      {/* Hero Intro */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-6">
            Help us build the <br/>
            <span className="text-edluar-moss dark:text-edluar-sage">future of hiring.</span>
          </h1>
          <p className="text-xl text-edluar-dark/70 dark:text-edluar-cream/70 mb-8 leading-relaxed max-w-2xl mx-auto">
            We're a team of dreamers, builders, and believers working to make recruitment more human. If you care about people and great software, you belong here.
          </p>
          <Button variant="primary" size="lg" onClick={() => document.getElementById('jobs')?.scrollIntoView({behavior: 'smooth'})}>
            See Open Roles
          </Button>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white dark:bg-edluar-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-6">Our Vision</h2>
              <p className="text-lg text-edluar-dark/80 dark:text-edluar-cream/80 mb-6 leading-relaxed">
                We envision a world where talent is recognized instantly, regardless of background, and where hiring teams can focus on building relationships rather than sorting through spreadsheets.
              </p>
              <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-6">Our Mission</h2>
              <p className="text-lg text-edluar-dark/80 dark:text-edluar-cream/80 leading-relaxed">
                To equip organic teams with intelligent, empathetic tools that streamline the mundane and amplify the human connection in recruitment.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Vision" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-edluar-moss/20 mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-edluar-cream dark:bg-edluar-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">Why join Edluar?</h2>
            <p className="text-edluar-dark/70 dark:text-edluar-cream/70">We take care of you so you can do your best work.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white dark:bg-edluar-surface p-6 rounded-xl border border-edluar-pale/50 dark:border-edluar-moss/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-edluar-pale/30 dark:bg-edluar-moss/20 rounded-full flex items-center justify-center text-edluar-moss dark:text-edluar-sage mb-4">
                  {b.icon}
                </div>
                <h3 className="font-bold text-lg text-edluar-dark dark:text-edluar-cream mb-2">{b.title}</h3>
                <p className="text-edluar-dark/70 dark:text-edluar-cream/70 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applying Steps */}
      <section className="py-24 bg-edluar-pale/30 dark:bg-edluar-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">Applying at Edluar</h2>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-edluar-surface rounded-2xl p-6 relative group h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 border border-edluar-pale/50 dark:border-edluar-moss/20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-edluar-surface p-1 rounded-full border border-edluar-pale dark:border-edluar-moss/30 shadow-sm z-10">
                   <div className="bg-edluar-cream dark:bg-edluar-deep p-1.5 rounded-full text-edluar-moss dark:text-edluar-sage">
                     {step.icon}
                   </div>
                </div>
                
                <h3 className="mt-6 text-lg font-bold text-edluar-dark dark:text-edluar-cream mb-3 leading-tight">{step.title}</h3>
                <p className="text-sm text-edluar-dark/70 dark:text-edluar-cream/70 leading-snug">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="jobs" className="py-24 bg-edluar-sage dark:bg-[#2c3e30] transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <h2 className="text-4xl font-black text-edluar-deep dark:text-white mb-6 md:mb-0 tracking-tight">Job openings</h2>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-edluar-moss/20 dark:bg-black/20 text-edluar-deep dark:text-white rounded hover:bg-edluar-moss/30 transition-colors text-sm font-medium">Department</button>
              <button className="px-4 py-2 bg-edluar-moss/20 dark:bg-black/20 text-edluar-deep dark:text-white rounded hover:bg-edluar-moss/30 transition-colors text-sm font-medium">Location</button>
              
              {/* Tooltip for Job Type */}
              <div className="relative group">
                <button className="px-4 py-2 bg-edluar-deep text-white dark:bg-white dark:text-edluar-deep rounded hover:bg-edluar-dark transition-colors text-sm font-medium flex items-center">
                  Job type
                  <HelpCircle className="w-3 h-3 ml-1.5 opacity-70" />
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-edluar-dark dark:bg-edluar-cream text-white dark:text-edluar-dark text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center">
                  Filter by employment type (Full-time, Part-time, Contract)
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-edluar-dark dark:bg-edluar-cream rotate-45 -mt-1"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Category Header */}
            <h3 className="text-2xl font-bold text-edluar-deep dark:text-white/90 mb-4">Full-time</h3>
            
            {/* Job List - Refactored as individual cards for animation */}
            {jobs.map((job, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-edluar-surface rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative z-0 hover:z-10"
              >
                <div className="mb-4 md:mb-0">
                  <h4 className="text-lg font-bold text-edluar-dark dark:text-edluar-cream group-hover:text-edluar-moss dark:group-hover:text-edluar-sage transition-colors">{job.title}</h4>
                </div>
                <div className="flex flex-col md:flex-row md:items-center text-sm text-edluar-dark/60 dark:text-edluar-cream/60 space-y-2 md:space-y-0 md:space-x-8">
                  <div className="flex items-center">
                     <MapPin className="w-4 h-4 mr-1" />
                     <span>{job.location}</span>
                  </div>
                  <div className="flex items-center md:w-24">
                     <Briefcase className="w-4 h-4 mr-1" />
                     <span>{job.type}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="md:ml-4 whitespace-nowrap"
                    onClick={() => setSelectedJob(job)}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}

            <h3 className="text-2xl font-bold text-edluar-deep dark:text-white/90 pt-8 mb-4">Full-time / Part-time</h3>

            {/* Open Application Card */}
             <div className="bg-white dark:bg-edluar-surface rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
                <div className="mb-4 md:mb-0">
                  <h4 className="text-lg font-bold text-edluar-dark dark:text-edluar-cream group-hover:text-edluar-moss dark:group-hover:text-edluar-sage transition-colors">Open application</h4>
                </div>
                <div className="flex flex-col md:flex-row md:items-center text-sm text-edluar-dark/60 dark:text-edluar-cream/60 space-y-2 md:space-y-0 md:space-x-8">
                  <div className="flex items-center">
                     <MapPin className="w-4 h-4 mr-1" />
                     <span>Remote / On-site</span>
                  </div>
                  <div className="flex items-center md:w-24">
                     <Briefcase className="w-4 h-4 mr-1" />
                     <span>Various</span>
                  </div>
                   <Button size="sm" variant="outline" className="md:ml-4 whitespace-nowrap">Apply Now</Button>
                </div>
             </div>

             {/* Job Alert */}
             <div className="text-center pt-12 pb-4">
               <h3 className="text-2xl font-bold text-edluar-deep dark:text-white mb-2">
                 Didn't find the job opening you're looking for?
               </h3>
               <p className="text-xl font-bold text-edluar-deep dark:text-white">
                 Subscribe to our <a href="#" className="text-[#4A6FFF] hover:underline">job alert</a>.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-edluar-deep/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white dark:bg-edluar-surface w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-edluar-pale dark:border-edluar-moss/30 animate-fade-in-up flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-6 border-b border-edluar-pale/30 dark:border-edluar-moss/20">
              <div>
                <h3 className="text-xl font-serif font-bold text-edluar-dark dark:text-edluar-cream">Apply for {selectedJob.title}</h3>
                <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60">{selectedJob.location} • {selectedJob.contract}</p>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-edluar-dark/50 hover:text-edluar-moss transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {isApplicationSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                   <div className="w-16 h-16 bg-edluar-moss rounded-full flex items-center justify-center text-white animate-bounce">
                     <Check className="w-8 h-8" />
                   </div>
                   <h4 className="text-2xl font-bold text-edluar-dark dark:text-edluar-cream">Application Sent!</h4>
                   <p className="text-edluar-dark/70 dark:text-edluar-cream/70">Thanks for your interest. We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">First Name</label>
                      <input type="text" id="firstName" required className="w-full px-4 py-2.5 rounded-lg border border-edluar-sage/30 bg-edluar-cream/20 dark:bg-black/20 focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">Last Name</label>
                      <input type="text" id="lastName" required className="w-full px-4 py-2.5 rounded-lg border border-edluar-sage/30 bg-edluar-cream/20 dark:bg-black/20 focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">Email Address</label>
                    <input type="email" id="email" required className="w-full px-4 py-2.5 rounded-lg border border-edluar-sage/30 bg-edluar-cream/20 dark:bg-black/20 focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">Resume / CV</label>
                    <div className="border-2 border-dashed border-edluar-pale dark:border-edluar-moss/40 rounded-lg p-6 text-center hover:bg-edluar-cream/30 dark:hover:bg-white/5 transition-colors cursor-pointer relative">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Upload className="w-8 h-8 mx-auto text-edluar-moss/50 mb-2" />
                      <p className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-edluar-dark/40 dark:text-edluar-cream/40 mt-1">PDF, DOCX up to 5MB</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="coverLetter" className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">Cover Letter</label>
                    <textarea 
                      id="coverLetter" 
                      rows={4} 
                      className="w-full px-4 py-2.5 rounded-lg border border-edluar-sage/30 bg-edluar-cream/20 dark:bg-black/20 focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all dark:text-white resize-none"
                      placeholder="Tell us why you'd be a great fit..."
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" className="w-full justify-center">
                      Submit Application
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
