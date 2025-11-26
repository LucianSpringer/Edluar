import React, { useState } from 'react';
import {
   LayoutGrid,
   Search,
   Bell,
   Plus,
   Video,
   CheckSquare,
   Clock,
   MoreHorizontal,
   ChevronRight,
   Leaf,
   Sun,
   Moon,
   Settings,
   LogOut,
   Briefcase,
   Users,
   MessageSquare,
   Calendar,
   FileText,
   ChevronDown,
   Star,
   Layout,
   Palette,
   Globe,
   Type,
   Image as ImageIcon,
   Music,
   Instagram,
   MapPin,
   Share2,
   ToggleLeft,
   ToggleRight,
   ExternalLink,
   CheckCircle2,
   Move,
   FormInput,
   ListPlus,
   X,
   ChevronLeft,
   AlignLeft
} from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

// --- TYPES ---
interface Candidate {
   id: number;
   name: string;
   role: string;
   avatar: string;
   rating: number;
   stage: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired';
   appliedDate: string;
   tags: string[];
   email: string;
   phone: string;
}

interface Column {
   id: string;
   title: string;
   count: number;
   color: string;
}

// --- MOCK DATA ---
const candidates: Candidate[] = [
   { id: 1, name: "Liam Chen", role: "Senior Frontend Dev", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", rating: 5, stage: 'Interview', appliedDate: "2d ago", tags: ["React", "Senior"], email: "liam@example.com", phone: "+1 555 0101" },
   { id: 2, name: "Sarah Miller", role: "Product Designer", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956", rating: 4, stage: 'New', appliedDate: "4h ago", tags: ["Figma"], email: "sarah@example.com", phone: "+1 555 0102" },
   { id: 3, name: "Marcus Johnson", role: "Backend Engineer", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79", rating: 3, stage: 'Screening', appliedDate: "1d ago", tags: ["Node.js"], email: "marcus@example.com", phone: "+1 555 0103" },
   { id: 4, name: "Emma Wilson", role: "Marketing Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", rating: 5, stage: 'Offer', appliedDate: "1w ago", tags: ["Growth"], email: "emma@example.com", phone: "+1 555 0104" },
   { id: 5, name: "David Kim", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", rating: 4, stage: 'Interview', appliedDate: "3d ago", tags: ["SaaS"], email: "david@example.com", phone: "+1 555 0105" },
];

const columns: Column[] = [
   { id: 'New', title: 'New Applied', count: 12, color: 'bg-blue-500' },
   { id: 'Screening', title: 'Phone Screen', count: 5, color: 'bg-purple-500' },
   { id: 'Interview', title: 'Interviewing', count: 8, color: 'bg-yellow-500' },
   { id: 'Offer', title: 'Offer Sent', count: 2, color: 'bg-green-500' },
   { id: 'Hired', title: 'Hired', count: 14, color: 'bg-edluar-moss' },
];

// --- SUB-COMPONENTS ---

// 1. OVERVIEW (Personal Dashboard)
const OverviewView = ({ user }: { user: any }) => {
   const templates = [
      { title: "No template", image: null, color: "bg-edluar-cream" },
      { title: "Future Forward", image: "https://images.unsplash.com/photo-1497366216548-37526070297c", color: "bg-purple-100" },
      { title: "Clean Corporate", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174", color: "bg-blue-100" },
      { title: "Creative Studio", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705", color: "bg-orange-100" },
   ];

   const getInitials = (name: string) => name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
   const displayName = user?.name || 'Guest User';
   const initials = user?.name ? getInitials(user.name) : 'GU';

   return (
      <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
         <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-edluar-moss text-edluar-cream flex items-center justify-center text-2xl font-serif font-bold shadow-lg">
                  {initials}
               </div>
               <div>
                  <h1 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream">Good afternoon, {displayName.split(' ')[0]}</h1>
                  <p className="text-edluar-dark/60 dark:text-edluar-cream/60">Here is what's happening at Edluar today.</p>
               </div>
            </div>
         </header>

         <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
               <section>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream flex items-center gap-2">
                        <Plus className="w-5 h-5 text-edluar-moss" /> Start a new job post
                     </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {templates.map((t, i) => (
                        <div key={i} className="group cursor-pointer">
                           <div className={`aspect-[4/5] rounded-xl mb-3 overflow-hidden border border-edluar-pale dark:border-white/10 shadow-sm group-hover:shadow-md transition-all relative ${t.color}`}>
                              {t.image ? (
                                 <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center"><Plus className="w-8 h-8 text-edluar-dark/20" /></div>
                              )}
                           </div>
                           <h3 className="text-sm font-bold text-edluar-dark dark:text-edluar-cream">{t.title}</h3>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
            <div className="space-y-8">
               <div className="bg-edluar-cream/50 dark:bg-white/5 rounded-2xl p-6 border border-edluar-pale dark:border-white/10">
                  <h2 className="font-bold text-edluar-dark dark:text-edluar-cream flex items-center gap-2 mb-6">
                     <CheckSquare className="w-5 h-5 text-edluar-moss" /> To-do
                  </h2>
                  <div className="space-y-3">
                     {[{ title: "Review 'Senior Dev' applicants", tag: "Urgent" }, { title: "Draft offer for Sarah", tag: "Pending" }].map((todo, i) => (
                        <div key={i} className="bg-white dark:bg-black/20 p-3 rounded-xl border border-edluar-pale/50 dark:border-white/5 flex items-start cursor-pointer">
                           <div className="w-4 h-4 rounded border border-gray-300 mr-3 mt-1" />
                           <div>
                              <div className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">{todo.title}</div>
                              <span className="text-[10px] bg-red-100 text-red-700 px-2 rounded-full">{todo.tag}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

// 2. ATS / PIPELINE (The Candidate Portal)
const ATSView = () => {
   const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

   return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0B100D] animate-fade-in relative">
         <div className="h-16 bg-white dark:bg-edluar-deep border-b border-gray-200 dark:border-white/5 px-6 flex items-center justify-between flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">Senior Product Designer <ChevronDown className="w-4 h-4" /></h1>
            <div className="flex gap-2">
               <Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Candidate</Button>
            </div>
         </div>
         <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex h-full gap-6 min-w-max">
               {columns.map(col => (
                  <div key={col.id} className="w-72 flex flex-col h-full">
                     <div className="flex items-center justify-between mb-4 px-1">
                        <span className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full ${col.color}`}></span> {col.title}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{col.count}</span>
                     </div>
                     <div className="flex-1 bg-gray-100/50 dark:bg-white/[0.02] rounded-xl p-2 space-y-3 overflow-y-auto custom-scrollbar border border-dashed border-gray-200 dark:border-white/5">
                        {candidates.filter(c => c.stage === col.id).map(candidate => (
                           <div
                              key={candidate.id}
                              onClick={() => setSelectedCandidate(candidate)}
                              className="bg-white dark:bg-edluar-surface p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
                           >
                              <div className="flex items-center gap-3 mb-3">
                                 <img src={candidate.avatar} alt={candidate.name} className="w-8 h-8 rounded-full" />
                                 <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{candidate.name}</h4>
                                    <p className="text-xs text-gray-500">{candidate.role}</p>
                                 </div>
                              </div>
                              <div className="flex gap-1">{candidate.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-[10px] rounded">{t}</span>)}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Candidate Portal Modal */}
         {selectedCandidate && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
               <div className="w-full max-w-2xl bg-white dark:bg-edluar-surface h-full shadow-2xl flex flex-col animate-slide-in-right">
                  <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <img src={selectedCandidate.avatar} className="w-16 h-16 rounded-full border-2 border-white shadow" />
                        <div>
                           <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{selectedCandidate.name}</h2>
                           <p className="text-gray-500">{selectedCandidate.role}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                           <span className="text-xs font-bold uppercase text-gray-400">Contact</span>
                           <div className="mt-2 space-y-1">
                              <p className="text-sm font-medium">{selectedCandidate.email}</p>
                              <p className="text-sm text-gray-500">{selectedCandidate.phone}</p>
                           </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                           <span className="text-xs font-bold uppercase text-gray-400">Application</span>
                           <div className="mt-2 space-y-1">
                              <p className="text-sm font-medium">Applied: {selectedCandidate.appliedDate}</p>
                              <p className="text-sm text-gray-500">Source: LinkedIn</p>
                           </div>
                        </div>
                     </div>

                     <div>
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">Application Questions</h3>
                        <div className="space-y-4">
                           <div>
                              <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Why do you want to work here?</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">I've been following Edluar's growth and I love the mission of making hiring more human. My background in React aligns perfectly with your tech stack.</p>
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Link to Portfolio</p>
                              <a href="#" className="text-sm text-blue-500 hover:underline">dribbble.com/liamchen</a>
                           </div>
                        </div>
                     </div>

                     <div>
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">Scorecard</h3>
                        <div className="flex gap-2">
                           <div className="flex-1 p-3 border rounded-lg text-center">
                              <span className="block text-xs text-gray-400 uppercase">Technical</span>
                              <span className="block text-xl font-bold text-green-600">4.5</span>
                           </div>
                           <div className="flex-1 p-3 border rounded-lg text-center">
                              <span className="block text-xs text-gray-400 uppercase">Culture</span>
                              <span className="block text-xl font-bold text-blue-600">5.0</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex justify-end gap-3">
                     <Button variant="outline" size="sm">Reject</Button>
                     <Button variant="primary" size="sm">Move to Offer</Button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

// 3. CAREER SITE BUILDER (The No-Code Engine)
const CareerSiteView = () => {
   const [activeTab, setActiveTab] = useState<'editor' | 'application' | 'design' | 'settings'>('editor');

   const blocks = [
      { icon: Type, label: "Text Block", desc: "Headings, paragraphs" },
      { icon: ImageIcon, label: "Photo Gallery", desc: "Grid or Carousel" },
      { icon: Users, label: "Team Grid", desc: "Showcase your people" },
      { icon: Music, label: "Spotify Embed", desc: "Office playlists" },
      { icon: Instagram, label: "Instagram Feed", desc: "Culture stream" },
      { icon: MapPin, label: "Location Map", desc: "Office directions" },
   ];

   return (
      <div className="flex h-full bg-gray-50 dark:bg-[#0B100D] animate-fade-in">
         {/* Builder Controls */}
         <div className="w-80 bg-white dark:bg-edluar-deep border-r border-gray-200 dark:border-white/5 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-white/5">
               <h2 className="font-bold text-lg text-gray-900 dark:text-white">Site Builder</h2>
               <p className="text-xs text-gray-500">edluar.careers/acme-corp</p>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-1 border-b border-gray-200 dark:border-white/5 overflow-x-auto">
               {['editor', 'application', 'design', 'settings'].map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab as any)}
                     className={`flex-1 py-2 px-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap ${activeTab === tab
                        ? 'bg-edluar-moss/10 text-edluar-moss'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                  >
                     {tab === 'application' ? 'Apply Form' : tab}
                  </button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               {activeTab === 'editor' && (
                  <div className="space-y-6">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Job Blocks (Legos)</h3>
                        <div className="grid grid-cols-2 gap-3">
                           {blocks.map((block, i) => (
                              <div key={i} className="p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:border-edluar-moss hover:bg-edluar-moss/5 cursor-grab active:cursor-grabbing transition-all group text-center">
                                 <block.icon className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-edluar-moss" />
                                 <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{block.label}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'application' && (
                  <div className="space-y-6 animate-fade-in">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Info</h3>
                        <div className="space-y-3">
                           {['First Name', 'Last Name', 'Email', 'Phone', 'Photo', 'Resume', 'Cover Letter'].map(field => (
                              <div key={field} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent hover:border-gray-200">
                                 <span className="text-sm text-gray-700 dark:text-gray-300">{field}</span>
                                 <ToggleRight className="w-6 h-6 text-edluar-moss cursor-pointer" />
                              </div>
                           ))}
                        </div>
                     </div>
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Custom Questions</h3>
                        <div className="space-y-3 mb-4">
                           <div className="p-3 bg-white dark:bg-black/20 rounded-lg border border-gray-200 dark:border-white/10">
                              <p className="text-xs font-bold mb-1">Paragraph</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Why do you want to work here?</p>
                           </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full border-dashed"><Plus className="w-4 h-4 mr-2" /> Add Question</Button>
                     </div>
                  </div>
               )}

               {activeTab === 'design' && (
                  <div className="space-y-6">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Branding</h3>
                        <div className="space-y-4">
                           <div>
                              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Primary Color</label>
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-edluar-moss shadow-sm border border-gray-200"></div>
                                 <input type="text" value="#2F3E30" className="flex-1 text-xs p-2 rounded border border-gray-200 dark:bg-white/5 dark:border-white/10" readOnly />
                              </div>
                           </div>
                           <div>
                              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Font Family</label>
                              <select className="w-full text-xs p-2 rounded border border-gray-200 dark:bg-white/5 dark:border-white/10 dark:text-white">
                                 <option>Inter (Sans-Serif)</option>
                                 <option>Merriweather (Serif)</option>
                                 <option>Roboto Mono</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'settings' && (
                  <div className="space-y-6">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Job Board Push</h3>
                        <div className="space-y-3">
                           {[
                              { name: "LinkedIn", active: true },
                              { name: "Indeed", active: true },
                              { name: "Google Jobs", active: false },
                              { name: "XML Feed", active: true }
                           ].map((board, i) => (
                              <div key={i} className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{board.name}</span>
                                 {board.active ? <ToggleRight className="w-6 h-6 text-edluar-moss cursor-pointer" /> : <ToggleLeft className="w-6 h-6 text-gray-300 cursor-pointer" />}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-white/5">
               <Button variant="primary" className="w-full justify-center">Publish Changes</Button>
            </div>
         </div>

         {/* WYSIWYG Canvas */}
         <div className="flex-1 p-8 overflow-y-auto bg-gray-100 dark:bg-black/50 flex justify-center">
            <div className="w-full max-w-4xl bg-white min-h-[800px] shadow-2xl rounded-xl overflow-hidden flex flex-col animate-fade-in-up border border-gray-200/50">
               {/* Fake Browser Chrome */}
               <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div></div>
                  <div className="flex-1 text-center"><span className="text-[10px] text-gray-400 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">careers.acme.com/jobs/123</span></div>
               </div>

               {/* Content Preview */}
               <div className="flex-1 relative group overflow-y-auto">
                  {activeTab === 'application' ? (
                     <div className="max-w-2xl mx-auto py-12 px-8">
                        <div className="text-center mb-8">
                           <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Senior Product Designer</h1>
                           <p className="text-gray-500">Remote • Full-time</p>
                        </div>
                        <form className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1"><label className="text-sm font-medium">First Name</label><input type="text" className="w-full p-2 border rounded" /></div>
                              <div className="space-y-1"><label className="text-sm font-medium">Last Name</label><input type="text" className="w-full p-2 border rounded" /></div>
                           </div>
                           <div className="space-y-1"><label className="text-sm font-medium">Email</label><input type="email" className="w-full p-2 border rounded" /></div>
                           <div className="space-y-1"><label className="text-sm font-medium">Resume/CV</label><div className="border-2 border-dashed p-6 text-center rounded text-gray-400 text-sm">Upload PDF</div></div>
                           <div className="space-y-1"><label className="text-sm font-medium">Why do you want to work here?</label><textarea className="w-full p-2 border rounded h-24"></textarea></div>
                           <Button className="w-full justify-center">Submit Application</Button>
                        </form>
                     </div>
                  ) : (
                     <>
                        <div className="h-64 bg-edluar-deep flex items-center justify-center text-center p-8 relative hover:ring-2 ring-blue-400 cursor-pointer transition-all">
                           <div>
                              <h1 className="text-4xl font-serif font-bold text-white mb-4">Join the Mission</h1>
                              <p className="text-white/70 max-w-xl mx-auto">We are building the future of organic recruitment software.</p>
                           </div>
                        </div>
                        <div className="p-12 bg-white hover:ring-2 ring-blue-400 cursor-pointer transition-all">
                           <h2 className="text-2xl font-bold text-center mb-8">Open Positions</h2>
                           <div className="space-y-4 max-w-2xl mx-auto">
                              {[{ role: "Senior Product Designer", loc: "Remote" }, { role: "Frontend Engineer", loc: "New York" }].map((job, i) => (
                                 <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                                    <div><h3 className="font-bold text-gray-900">{job.role}</h3><p className="text-xs text-gray-500">{job.loc}</p></div>
                                    <Button size="sm" variant="outline">Apply</Button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

// 4. SCHEDULE VIEW (Calendar & Events)
const ScheduleView = () => {
   const [selectedDate, setSelectedDate] = useState(new Date());

   const timeSlots = Array.from({ length: 9 }, (_, i) => i + 9); // 9am to 5pm
   const weekDays = ['Mon 11/11', 'Tue 12/11', 'Wed 13/11', 'Thu 14/11', 'Fri 15/11', 'Sat 16/11'];

   const events = [
      { day: 0, start: 10, duration: 1, title: "One-on-one", color: "bg-blue-600" },
      { day: 0, start: 11, duration: 1, title: "Design weekly", color: "bg-teal-700" },
      { day: 0, start: 13, duration: 2.5, title: "2025 Product Updates", color: "bg-blue-700" },
      { day: 1, start: 10, duration: 1.5, title: "Brainstorming session", color: "bg-purple-200 text-purple-900" },
      { day: 1, start: 13, duration: 1, title: "Yearly review", color: "bg-yellow-400 text-yellow-900" },
      { day: 2, start: 9.5, duration: 1.5, title: "Design weekly", color: "bg-teal-700" },
      { day: 2, start: 11.5, duration: 1, title: "Budget review", color: "bg-yellow-400 text-yellow-900" },
      { day: 3, start: 10, duration: 1, title: "Second Interview", color: "bg-teal-700" },
      { day: 4, start: 9, duration: 1, title: "Review & Planning", color: "bg-yellow-400 text-yellow-900" },
      { day: 4, start: 10, duration: 1.5, title: "Review & Planning", color: "bg-teal-700" },
   ];

   return (
      <div className="flex h-full bg-white dark:bg-[#0B100D] animate-fade-in overflow-hidden">
         {/* Left Panel: Event Creation */}
         <div className="w-96 border-r border-gray-200 dark:border-white/5 p-6 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">New event</h2>
               <button className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-6">
               {/* Title Input */}
               <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                     <input type="text" placeholder="Add title" className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 ring-edluar-moss/20" defaultValue="Portfolio presentation" />
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-8">Insert template</Button>
               </div>

               {/* Date/Time */}
               <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-2" />
                  <div className="flex-1 space-y-2">
                     <div className="flex gap-2">
                        <select className="bg-gray-50 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300"><option>tomorrow</option></select>
                        <select className="bg-gray-50 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300"><option>1:00 pm</option></select>
                        <select className="bg-gray-50 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300"><option>90 min</option></select>
                     </div>
                     <div className="flex items-center gap-1 text-xs text-blue-500 font-medium cursor-pointer">
                        <Globe className="w-3 h-3" /> Europe/Amsterdam
                     </div>
                  </div>
               </div>

               {/* Location */}
               <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <select className="flex-1 bg-gray-50 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                     <option>Google Meet</option>
                     <option>Zoom</option>
                     <option>In Person</option>
                  </select>
               </div>
               <p className="text-xs text-gray-400 ml-8">A link will be added when creating an event.</p>

               {/* Attendees */}
               <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-2" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                     <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold">RP</div>
                           <span className="text-xs font-medium truncate">Randy Philips</span>
                        </div>
                        <X className="w-3 h-3 text-gray-400 cursor-pointer" />
                     </div>
                     <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-white/10 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                           <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" className="w-6 h-6 rounded-full" />
                           <span className="text-xs font-medium truncate">Diego Navarro</span>
                        </div>
                        <X className="w-3 h-3 text-gray-400 cursor-pointer" />
                     </div>
                     <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-white/10 rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                           <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" className="w-6 h-6 rounded-full" />
                           <span className="text-xs font-medium truncate">Giulia Bianchi</span>
                        </div>
                        <X className="w-3 h-3 text-gray-400 cursor-pointer" />
                     </div>
                     <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-white/10 rounded-lg bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2">
                           <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36" className="w-6 h-6 rounded-full" />
                           <span className="text-xs font-medium truncate">Oliver Bennett</span>
                        </div>
                        <X className="w-3 h-3 text-gray-400 cursor-pointer" />
                     </div>
                     <button className="flex items-center justify-center p-2 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-edluar-moss hover:text-edluar-moss transition-colors">
                        <Plus className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               {/* Description */}
               <div className="flex items-start gap-3">
                  <AlignLeft className="w-5 h-5 text-gray-400 mt-2" />
                  <textarea className="flex-1 bg-gray-50 dark:bg-white/5 border-none rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 h-32 resize-none" placeholder="Write some instructions for the attendees..."></textarea>
               </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                     <Calendar className="w-4 h-4" />
                     <span>Events: (diego@homerun.co)</span>
                     <ChevronDown className="w-3 h-3" />
                  </div>
               </div>
            </div>
         </div>

         {/* Right Panel: Calendar Grid */}
         <div className="flex-1 flex flex-col bg-white dark:bg-[#0B100D]">
            {/* Calendar Header */}
            <div className="h-16 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6">
               <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">Nov 11 - 16, 2024</h2>
               </div>
               <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">Today</Button>
                  <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg">
                     <button className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 border-r border-gray-200 dark:border-white/10"><ChevronLeft className="w-4 h-4" /></button>
                     <button className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5"><ChevronRight className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
               <div className="flex min-w-[800px]">
                  {/* Time Column */}
                  <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0B100D] z-10 sticky left-0">
                     <div className="h-10 border-b border-gray-200 dark:border-white/5"></div> {/* Header spacer */}
                     {timeSlots.map(hour => (
                        <div key={hour} className="h-20 border-b border-gray-100 dark:border-white/5 text-xs text-gray-400 text-right pr-2 pt-2">
                           {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'pm' : 'am'}
                        </div>
                     ))}
                  </div>

                  {/* Days Columns */}
                  {weekDays.map((day, dayIndex) => (
                     <div key={day} className="flex-1 min-w-[120px] border-r border-gray-200 dark:border-white/5 relative">
                        {/* Day Header */}
                        <div className="h-10 border-b border-gray-200 dark:border-white/5 flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-50/50 dark:bg-white/5 sticky top-0 z-10">
                           {day}
                        </div>

                        {/* Grid Lines */}
                        {timeSlots.map(hour => (
                           <div key={hour} className="h-20 border-b border-gray-100 dark:border-white/5"></div>
                        ))}

                        {/* Events */}
                        {events.filter(e => e.day === dayIndex).map((event, i) => (
                           <div
                              key={i}
                              className={`absolute left-1 right-1 rounded-md p-2 text-xs font-medium text-white shadow-sm cursor-pointer hover:brightness-110 transition-all z-10 ${event.color}`}
                              style={{
                                 top: `${(event.start - 9) * 80 + 40}px`, // 80px per hour + 40px header offset
                                 height: `${event.duration * 80 - 4}px`
                              }}
                           >
                              <div className="font-bold truncate">{event.start > 12 ? event.start - 12 : event.start}:00 - {event.start + event.duration > 12 ? event.start + event.duration - 12 : event.start + event.duration}:00</div>
                              <div className="truncate">{event.title}</div>
                           </div>
                        ))}

                        {/* Busy Indicator Mock */}
                        {dayIndex === 1 && (
                           <div className="absolute top-[40px] left-0 right-0 h-6 bg-yellow-400 rounded-sm mx-1 flex items-center px-2 text-[10px] font-bold text-yellow-900">Busy</div>
                        )}
                     </div>
                  ))}
               </div>
            </div>

            {/* Footer Actions */}
            <div className="h-16 border-t border-gray-200 dark:border-white/5 flex items-center justify-end px-6 gap-3 bg-white dark:bg-[#0B100D]">
               <Button variant="outline">Discard</Button>
               <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none">Next: Preview</Button>
            </div>
         </div>
      </div>
   );
};

// --- VIEW 4: REPORTS & INSIGHTS (New Feature) ---
const ReportsView = () => {
   // Mock Analytics Data (In real app, calculate this from 'candidates' array)
   const metrics = {
      timeToHire: 18,
      acceptanceRate: 85,
      activePipeline: 42,
      sourceQuality: [
         { source: "LinkedIn", score: 92, color: "bg-[#0077b5]" },
         { source: "Referral", score: 88, color: "bg-emerald-500" },
         { source: "Indeed", score: 65, color: "bg-blue-400" },
         { source: "Direct", score: 78, color: "bg-edluar-moss" },
      ],
      funnel: [
         { stage: "Applied", count: 145, drop: 0 },
         { stage: "Screening", count: 68, drop: 53 },
         { stage: "Interview", count: 24, drop: 65 },
         { stage: "Offer", count: 8, drop: 66 },
         { stage: "Hired", count: 6, drop: 25 },
      ]
   };

   return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0B100D] animate-fade-in overflow-y-auto p-8">
         <header className="mb-10">
            <h1 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-2">Ecosystem Insights</h1>
            <p className="text-edluar-dark/60 dark:text-edluar-cream/60">Live telemetry on your recruitment garden.</p>
         </header>

         {/* Top Level Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-edluar-pale dark:border-white/10 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Growth Velocity</h3>
                  <Clock className="w-5 h-5 text-edluar-moss" />
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{metrics.timeToHire}</span>
                  <span className="text-sm text-gray-500">days avg</span>
               </div>
               <div className="mt-4 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded inline-block">
                  ↓ 12% vs last month
               </div>
            </div>

            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-edluar-pale dark:border-white/10 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Offer Acceptance</h3>
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{metrics.acceptanceRate}%</span>
               </div>
               <div className="mt-4 w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${metrics.acceptanceRate}%` }}></div>
               </div>
            </div>

            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-edluar-pale dark:border-white/10 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Seeds</h3>
                  <Users className="w-5 h-5 text-orange-400" />
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{metrics.activePipeline}</span>
                  <span className="text-sm text-gray-500">candidates</span>
               </div>
               <p className="mt-4 text-xs text-gray-400">Across 3 active roles</p>
            </div>
         </div>

         <div className="grid lg:grid-cols-2 gap-8">
            {/* Custom SVG Funnel Chart (High Logic) */}
            <div className="p-8 bg-white dark:bg-white/5 rounded-2xl border border-edluar-pale dark:border-white/10 shadow-sm">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Nurture Yield (Funnel)</h3>
               <div className="space-y-4">
                  {metrics.funnel.map((step, i) => (
                     <div key={step.stage} className="relative group">
                        <div className="flex justify-between text-sm mb-1">
                           <span className="font-medium text-gray-700 dark:text-gray-300">{step.stage}</span>
                           <span className="text-gray-500">{step.count}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-white/5 h-10 rounded-lg relative overflow-hidden">
                           <div
                              className={`h-full rounded-lg transition-all duration-1000 ease-out ${i === 4 ? 'bg-edluar-moss' : 'bg-edluar-pale dark:bg-edluar-moss/40'}`}
                              style={{ width: `${(step.count / metrics.funnel[0].count) * 100}%` }}
                           ></div>
                           {/* Dropoff Marker */}
                           {i > 0 && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                 -{step.drop}% drop
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Source Quality Analysis */}
            <div className="p-8 bg-white dark:bg-white/5 rounded-2xl border border-edluar-pale dark:border-white/10 shadow-sm">
               <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Soil Quality (Source Impact)</h3>
               <div className="h-64 flex items-end justify-between gap-4 px-2">
                  {metrics.sourceQuality.map((src) => (
                     <div key={src.source} className="flex flex-col items-center gap-2 w-full group">
                        <div className="relative w-full flex justify-center">
                           <div
                              className={`w-full max-w-[60px] rounded-t-lg transition-all duration-700 ${src.color} opacity-80 group-hover:opacity-100`}
                              style={{ height: `${src.score * 2}px` }}
                           >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                 {src.score}/100
                              </div>
                           </div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{src.source}</span>
                     </div>
                  ))}
               </div>
               <p className="mt-6 text-sm text-gray-500 text-center bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
                  <strong>Insight:</strong> LinkedIn candidates have a <strong>24% higher</strong> survival rate than Indeed.
               </p>
            </div>
         </div>
      </div>
   );
};

// --- MAIN CONTROLLER ---
interface DashboardPageProps {
   onNavigate: (page: string, params?: any) => void;
   toggleTheme: () => void;
   isDarkMode: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, toggleTheme, isDarkMode }) => {
   const { user, logout } = useAuth();
   const [activeView, setActiveView] = useState<'overview' | 'jobs' | 'candidates' | 'career_site' | 'calendar' | 'reports'>('overview');

   const handleLogout = () => { logout(); onNavigate('home'); };

   const getInitials = (name: string) => name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
   const displayName = user?.name || 'Guest User';
   const initials = user?.name ? getInitials(user.name) : 'GU';

   const NavItem = ({ id, icon: Icon, label, count }: any) => (
      <button
         onClick={() => setActiveView(id)}
         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeView === id
            ? 'bg-edluar-moss text-white shadow-lg shadow-edluar-moss/20'
            : 'text-edluar-dark/60 dark:text-edluar-cream/60 hover:bg-edluar-pale/30 dark:hover:bg-white/5'
            }`}
      >
         <Icon className="w-5 h-5" />
         <span className="flex-1 text-left">{label}</span>
         {count && <span className={`text-xs px-2 py-0.5 rounded-full ${activeView === id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>{count}</span>}
      </button>
   );

   return (
      <div className="flex h-screen bg-edluar-cream dark:bg-edluar-deep transition-colors duration-300 overflow-hidden">
         <aside className="w-64 bg-white dark:bg-black/20 border-r border-edluar-pale/50 dark:border-white/5 flex flex-col z-20">
            <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
               <div className="w-10 h-10 bg-edluar-moss rounded-full flex items-center justify-center text-white font-bold font-serif shadow-md text-sm">
                  {initials}
               </div>
               <div className="flex flex-col">
                  <span className="font-bold text-sm text-edluar-dark dark:text-white leading-tight">{displayName}</span>
                  <span className="text-[10px] text-edluar-dark/50 dark:text-white/50">Workspace Admin</span>
               </div>
            </div>
            <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
               <div className="px-4 py-2 text-[10px] font-bold text-edluar-dark/40 dark:text-white/40 uppercase tracking-widest">Workspace</div>
               <NavItem id="overview" icon={LayoutGrid} label="Dashboard" />
               <NavItem id="jobs" icon={Briefcase} label="Jobs & Pipeline" count={3} />
               <NavItem id="candidates" icon={Users} label="Candidates" count={128} />
               <NavItem id="career_site" icon={Layout} label="Career Site Builder" />
               <NavItem id="inbox" icon={MessageSquare} label="Inbox" count={5} />
               <NavItem id="calendar" icon={Calendar} label="Schedule" />
               <NavItem id="reports" icon={FileText} label="Reports" />
               <div className="mt-8 px-4 py-2 text-[10px] font-bold text-edluar-dark/40 dark:text-white/40 uppercase tracking-widest">Organization</div>
               <NavItem id="settings" icon={Settings} label="Settings" />
            </div>
            <div className="p-4 border-t border-edluar-pale/50 dark:border-white/5 space-y-2">
               <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-edluar-dark/60 dark:text-edluar-cream/60 hover:text-edluar-moss transition-colors">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
               </button>
               <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"><LogOut className="w-4 h-4" /><span>Sign Out</span></button>
            </div>
         </aside>

         <main className="flex-1 relative flex flex-col min-w-0">
            <div className="h-16 border-b border-edluar-pale/50 dark:border-white/5 flex items-center justify-between px-8 bg-edluar-cream/80 dark:bg-edluar-deep/80 backdrop-blur-md z-10">
               <h2 className="text-lg font-bold text-edluar-dark dark:text-edluar-cream capitalize">
                  {activeView === 'jobs' ? 'Applicant Tracking' : activeView === 'career_site' ? 'Career Site OS' : activeView}
               </h2>
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-edluar-dark/40" />
                     <input type="text" placeholder="Search anything..." className="pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-edluar-pale dark:border-white/10 rounded-full text-sm focus:ring-2 focus:ring-edluar-moss/50 w-64 transition-all" />
                  </div>
                  <button className="relative p-2 text-edluar-dark/60 hover:text-edluar-moss transition-colors">
                     <Bell className="w-5 h-5" />
                     <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-edluar-cream"></span>
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-auto">
               {activeView === 'overview' && <OverviewView user={user} />}
               {activeView === 'jobs' && <ATSView />}
               {activeView === 'candidates' && <ATSView />}
               {activeView === 'career_site' && <CareerSiteView />}
               {activeView === 'calendar' && <ScheduleView />}
               {activeView === 'reports' && <ReportsView />}
               {activeView !== 'overview' && activeView !== 'jobs' && activeView !== 'candidates' && activeView !== 'career_site' && activeView !== 'calendar' && activeView !== 'reports' && (
                  <div className="flex flex-col items-center justify-center h-full text-edluar-dark/40">
                     <Briefcase className="w-16 h-16 mb-4 opacity-20" />
                     <p>The {activeView} module is coming in Edluar v2.3</p>
                  </div>
               )}
            </div>
         </main>
      </div>
   );
};