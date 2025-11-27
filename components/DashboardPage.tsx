import React, { useState, useEffect } from 'react';
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
   AlignLeft,
   ArrowRight,
   User,
   ShieldCheck,
   HelpCircle,
   Filter,
   Paperclip,
   Send,
   Linkedin,
   Mail,
   Trash2
} from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

// --- INBOX INTERFACES
interface Message {
   id: number;
   type: 'email' | 'note' | 'event'; // NEW: Differentiates content
   sender: 'candidate' | 'recruiter' | 'system';
   text: string;
   timestamp: string;
   isRead: boolean;
   authorName?: string; // For internal notes
}

interface Conversation {
   candidateId: number;
   candidateName: string;
   candidateAvatar: string;
   role: string;
   stage: string; // NEW: For context sidebar
   lastMessage: string;
   lastMessageTime: string;
   unreadCount: number;
   messages: Message[];
}

// --- MOCK DATA
const conversations: Conversation[] = [
   {
      candidateId: 1,
      candidateName: "Liam Chen",
      candidateAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      role: "Senior Frontend Dev",
      stage: "Interview",
      lastMessage: "Great, I'll see you on Tuesday!",
      lastMessageTime: "10:30 AM",
      unreadCount: 1,
      messages: [
         { id: 0, type: 'event', sender: 'system', text: "Liam applied for Senior Frontend Dev", timestamp: "2 days ago", isRead: true },
         { id: 1, type: 'email', sender: 'recruiter', text: "Hi Liam, thanks for applying! We'd love to schedule a chat.", timestamp: "Yesterday, 2:00 PM", isRead: true },
         { id: 2, type: 'note', sender: 'recruiter', text: "Strong portfolio. I specifically like his React Native work.", authorName: "Alex (You)", timestamp: "Yesterday, 2:15 PM", isRead: true },
         { id: 3, type: 'email', sender: 'candidate', text: "Thanks for reaching out! I'm free Tuesday afternoon.", timestamp: "Yesterday, 2:30 PM", isRead: true },
         { id: 4, type: 'email', sender: 'candidate', text: "Great, I'll see you on Tuesday!", timestamp: "10:30 AM", isRead: false },
      ]
   },
   // ... (Add other conversations if needed)
];

// --- NEW FEATURE: CREATE JOB WIZARD
const CreateJobModal = ({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete: (data: any) => void }) => {
   const [step, setStep] = useState(1);
   const [data, setData] = useState({ title: '', type: 'Full-time', department: 'Product', location: 'Remote', strategy: 'post_and_form', template: 'Future Forward' });

   if (!isOpen) return null;

   const handleNext = () => {
      if (step < 3) setStep(s => s + 1);
      else onComplete(data);
   };

   // TEMPLATE DATA (Based on your images)
   const visualTemplates = [
      {
         name: 'Future Forward',
         image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
         tags: ['Modern', 'Clean']
      },
      {
         name: 'Niche Ceremony',
         image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
         tags: ['Bold', 'Typography']
      },
      {
         name: 'Dark Matters',
         image: 'https://images.unsplash.com/photo-1492551557933-34265f7af79e?auto=format&fit=crop&w=400&q=80',
         tags: ['Sleek', 'Dark Mode']
      }
   ];

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-edluar-deep/60 backdrop-blur-sm animate-fade-in">
         <div className="bg-white dark:bg-edluar-surface w-full max-w-4xl rounded-2xl shadow-2xl border border-edluar-pale/50 dark:border-white/10 flex flex-col overflow-hidden animate-scale-in max-h-[90vh]">

            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
               <div>
                  <h2 className="text-xl font-serif font-bold text-edluar-dark dark:text-white">
                     {step === 1 ? "Let's start hiring" : step === 2 ? "The Details" : "Choose your Vibe"}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                     <span className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-edluar-moss' : 'bg-gray-200 dark:bg-white/10'}`}></span>
                     <span className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-edluar-moss' : 'bg-gray-200 dark:bg-white/10'}`}></span>
                     <span className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-edluar-moss' : 'bg-gray-200 dark:bg-white/10'}`}></span>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            {/* Body */}
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
               {step === 1 && (
                  <div className="space-y-8 max-w-xl mx-auto py-8">
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Job Title</label>
                        <input
                           autoFocus
                           type="text"
                           value={data.title}
                           onChange={(e) => setData({ ...data, title: e.target.value })}
                           className="w-full p-5 text-2xl bg-white dark:bg-black/20 border-2 border-gray-200 dark:border-white/10 rounded-xl focus:border-edluar-moss focus:ring-4 focus:ring-edluar-moss/10 outline-none transition-all placeholder:text-gray-300"
                           placeholder="e.g. Senior Product Designer"
                        />
                     </div>
                     <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full h-fit"><Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                        <div>
                           <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm mb-1">Need inspiration?</h4>
                           <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">Start with a proven template structure.</p>
                           <div className="flex flex-wrap gap-2">
                              {['Product Manager', 'Graphic Designer', 'Sales Executive'].map(role => (
                                 <button key={role} onClick={() => setData({ ...data, title: role })} className="px-3 py-1 bg-white dark:bg-white/10 hover:scale-105 text-blue-700 dark:text-blue-200 text-xs font-bold rounded-md shadow-sm transition-all">
                                    {role}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {step === 2 && (
                  <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto py-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Employment Type</label>
                        <select className="w-full p-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 outline-none" value={data.type} onChange={e => setData({ ...data, type: e.target.value })}>
                           <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Department</label>
                        <select className="w-full p-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 outline-none" value={data.department} onChange={e => setData({ ...data, department: e.target.value })}>
                           <option>Product</option><option>Engineering</option><option>Marketing</option><option>Sales</option>
                        </select>
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                        <div className="relative">
                           <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input type="text" className="w-full pl-10 p-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-edluar-moss/50 outline-none" value={data.location} onChange={e => setData({ ...data, location: e.target.value })} />
                        </div>
                     </div>
                  </div>
               )}

               {step === 3 && (
                  <div className="space-y-8">

                     {/* Strategy Toggle */}
                     <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl inline-flex">
                           <button
                              onClick={() => setData({ ...data, strategy: 'post_and_form' })}
                              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${data.strategy === 'post_and_form' ? 'bg-white dark:bg-edluar-moss text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                           >
                              <Layout className="w-4 h-4" /> Career Page + Form
                           </button>
                           <button
                              onClick={() => setData({ ...data, strategy: 'form_only' })}
                              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${data.strategy === 'form_only' ? 'bg-white dark:bg-edluar-moss text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                           >
                              <FormInput className="w-4 h-4" /> Form Only
                           </button>
                        </div>
                     </div>

                     {data.strategy === 'post_and_form' && (
                        <div className="animate-fade-in-up">
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                              {visualTemplates.map((tmpl) => (
                                 <div
                                    key={tmpl.name}
                                    onClick={() => setData({ ...data, template: tmpl.name })}
                                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${data.template === tmpl.name
                                       ? 'border-edluar-moss ring-4 ring-edluar-moss/20 shadow-xl scale-[1.02]'
                                       : 'border-transparent hover:border-gray-300 dark:hover:border-white/20 hover:shadow-lg'
                                       }`}
                                 >
                                    {/* Image Container */}
                                    <div className="aspect-[3/4] relative bg-gray-200">
                                       <img src={tmpl.image} alt={tmpl.name} className="w-full h-full object-cover" />
                                       <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${data.template === tmpl.name ? 'opacity-80' : 'opacity-60 group-hover:opacity-70'}`} />

                                       {/* Active Checkmark */}
                                       {data.template === tmpl.name && (
                                          <div className="absolute top-4 right-4 bg-edluar-moss text-white p-1.5 rounded-full shadow-lg animate-scale-in">
                                             <CheckCircle2 className="w-5 h-5" />
                                          </div>
                                       )}

                                       {/* Content */}
                                       <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                          <div className="flex gap-2 mb-2">
                                             {tmpl.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                                                   {tag}
                                                </span>
                                             ))}
                                          </div>
                                          <h3 className="font-serif font-bold text-xl">{tmpl.name}</h3>
                                       </div>

                                       {/* Hover Action */}
                                       <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 ${data.template !== tmpl.name ? 'group-hover:opacity-100' : ''}`}>
                                          <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                             Select Style
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex justify-between items-center">
               {step > 1 ? (
                  <button onClick={() => setStep(s => s - 1)} className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors px-4">
                     Back
                  </button>
               ) : (
                  <div></div>
               )}
               <Button onClick={handleNext} className="shadow-xl px-8 py-3 text-base">
                  {step === 3 ? "Launch Live Editor" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
         </div>
      </div>
   );
};

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
const OverviewView = ({ user, onOpenCreate }: { user: any; onOpenCreate: () => void }) => {
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
                     <button onClick={onOpenCreate} className="text-xl font-bold text-edluar-dark dark:text-edluar-cream flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Plus className="w-5 h-5 text-edluar-moss" /> Start a new job post
                     </button>
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

// 2. JOBS LIST VIEW
const JobsListView = ({ onOpenCreate }: { onOpenCreate: () => void }) => {
   return (
      <div className="p-8 max-w-7xl mx-auto animate-fade-in">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Jobs</h2>
            <Button variant="primary" size="sm" onClick={onOpenCreate}><Plus className="w-4 h-4 mr-2" /> Create Job</Button>
         </div>
         <div className="grid gap-4">
            <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:shadow-md transition-all cursor-pointer group">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-edluar-moss transition-colors">Senior Product Designer</h3>
                     <p className="text-sm text-gray-500 mt-1">Remote • Full-time • Design Team</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
               </div>
               <div className="mt-4 flex gap-4 text-sm text-gray-500">
                  <span><strong>12</strong> Candidates</span>
                  <span><strong>5</strong> Interviews</span>
                  <span><strong>2</strong> Offers</span>
               </div>
            </div>
            <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:shadow-md transition-all cursor-pointer group">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-edluar-moss transition-colors">Frontend Engineer</h3>
                     <p className="text-sm text-gray-500 mt-1">New York • Full-time • Engineering</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
               </div>
               <div className="mt-4 flex gap-4 text-sm text-gray-500">
                  <span><strong>45</strong> Candidates</span>
                  <span><strong>8</strong> Interviews</span>
                  <span><strong>0</strong> Offers</span>
               </div>
            </div>
         </div>
      </div>
   );
};

// 3. ATS / PIPELINE (The Candidate Portal)
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

// --- NEW INTERFACES FOR BUILDER ---
interface BlockData {
   id: string;
   type: 'text' | 'gallery' | 'team' | 'header';
   isVisible: boolean;
   backgroundColor?: string;
   textColor?: string;
   headingColor?: string;
   content: any; // Dynamic content based on type
}

function SortableBlock({ id, children }: { id: string; children: (args: { listeners: any; attributes: any }) => React.ReactNode; isActive?: boolean }) {
   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
   const style = { transform: CSS.Transform.toString(transform), transition };
   return (
      <div ref={setNodeRef} style={style}>
         {children({ listeners, attributes })}
      </div>
   );
}

// --- 2. CAREER SITE BUILDER (The "No-Code" Engine) ---
const CareerSiteView = ({ initialData }: { initialData?: any }) => {
   const [activeTab, setActiveTab] = useState<'editor' | 'design'>('editor');

   const [config, setConfig] = useState({
      primaryColor: "#2F3E30",
      font: "Inter",
      template: "Future Forward"
   });

   // TEMPLATES DATA
   const templates = [
      {
         id: 'calm-access',
         name: 'Calm Access',
         thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Abstract brown/beige
         config: {
            primaryColor: '#4A3B32',
            font: 'Merriweather', // Serif font
            template: 'Calm Access'
         },
         blocks: [
            {
               id: 'header-calm',
               type: 'header',
               isVisible: true,
               backgroundColor: '#4A3B32', // Dark Brown
               headingColor: '#FFFFFF',
               textColor: '#E5E5E5',
               content: { title: "Project Manager", subtitle: "We're looking for a Project Manager to join our fully remote and mission driven team.", cta: "Apply Now" }
            },
            {
               id: 'team-calm',
               type: 'team',
               isVisible: true,
               backgroundColor: '#E8DCCA', // Beige
               headingColor: '#2C1810', // Darker Brown
               textColor: '#5D4037',
               content: {
                  members: [
                     { name: "Carla", role: "Founder & Product", img: "5" },
                     { name: "Marcus", role: "Operations", img: "8" },
                     { name: "Madelyn", role: "Marketing", img: "9" },
                     { name: "Kierra", role: "Design", img: "12" }
                  ]
               }
            }
         ] as BlockData[]
      },
      {
         id: 'neon-pulse',
         name: 'Neon Pulse',
         thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2370&auto=format&fit=crop', // Pink/Purple abstract
         config: {
            primaryColor: '#F4A4C8',
            font: 'Outfit', // Geometric Sans
            template: 'Neon Pulse'
         },
         blocks: [
            {
               id: 'header-neon',
               type: 'header',
               isVisible: true,
               backgroundColor: '#F4A4C8', // Pink
               headingColor: '#FF6B35', // Orange
               textColor: '#4A2040', // Dark Purple
               content: { title: "Project Manager", subtitle: "We're looking for a Project Manager to join our fully remote and mission driven team.", cta: "Apply Now" }
            },
            {
               id: 'text-neon',
               type: 'text',
               isVisible: true,
               backgroundColor: '#F4A4C8',
               headingColor: '#FF6B35',
               textColor: '#4A2040',
               content: { heading: "About the Role", body: "We are looking for a Senior Product Designer to join our team. You will work directly with the founders." }
            },
            {
               id: 'team-neon',
               type: 'team',
               isVisible: true,
               backgroundColor: '#F4A4C8',
               headingColor: '#4A2040',
               textColor: '#4A2040',
               content: {
                  members: [
                     { name: "Carla", role: "Founder & Product", img: "5" },
                     { name: "Marcus", role: "Operations", img: "8" },
                     { name: "Madelyn", role: "Marketing", img: "9" },
                     { name: "Kierra", role: "Design", img: "12" }
                  ]
               }
            }
         ] as BlockData[]
      },
      {
         id: 'creative-studio',
         name: 'Creative Studio',
         thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2370&auto=format&fit=crop', // Blue/Orange abstract
         config: {
            primaryColor: '#547C96',
            font: 'Oswald', // Condensed Sans
            template: 'Creative Studio'
         },
         blocks: [
            {
               id: 'header-creative',
               type: 'header',
               isVisible: true,
               backgroundColor: '#547C96', // Muted Blue
               headingColor: '#FFF8E7', // Cream
               textColor: '#FFB085', // Peach/Orange
               content: { title: "WE ARE HIRING", subtitle: "Graphic Designer & Video Editor positions open now.", cta: "Submit Resume" }
            },
            {
               id: 'text-creative',
               type: 'text',
               isVisible: true,
               backgroundColor: '#547C96',
               headingColor: '#FFF8E7',
               textColor: '#D1E3F0',
               content: { heading: "Open Positions", body: "We are looking for creative minds to join our growing studio." }
            },
            {
               id: 'team-creative',
               type: 'team',
               isVisible: true,
               backgroundColor: '#547C96',
               headingColor: '#FFF8E7',
               textColor: '#D1E3F0',
               content: {
                  members: [
                     { name: "Juday", role: "Art Director", img: "25" },
                     { name: "Alex", role: "Video Lead", img: "32" }
                  ]
               }
            }
         ] as BlockData[]
      }
   ];

   const applyTemplate = (templateId: string) => {
      const template = templates.find(t => t.id === templateId);
      if (template) {
         setConfig(prev => ({ ...prev, ...template.config }));
         setBlocks(template.blocks);
      }
   };

   // COMPLEX STATE: The Page Model
   const [blocks, setBlocks] = useState<BlockData[]>([
      {
         id: 'header-1',
         type: 'header',
         isVisible: true,
         backgroundColor: config.primaryColor,
         headingColor: '#FFFFFF',
         textColor: '#E5E7EB',
         content: { title: "Join the Mission", subtitle: "We are building the future of organic recruitment.", cta: "Apply Now" }
      },
      {
         id: 'text-1',
         type: 'text',
         isVisible: true,
         backgroundColor: '#FFFFFF',
         headingColor: '#111827',
         textColor: '#4B5563',
         content: { heading: "About the Role", body: "We are looking for a Senior Product Designer to join our team. You will work directly with the founders." }
      },
      {
         id: 'team-1',
         type: 'team',
         isVisible: true,
         backgroundColor: '#F9FAFB',
         headingColor: '#111827',
         textColor: '#4B5563',
         content: { members: [{ name: "Alex M.", role: "Head of Design", img: "1" }, { name: "Sarah J.", role: "CTO", img: "2" }] }
      }
   ]);



   // SENSORS
   const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
   );

   // --- ACTIONS (The Logic Layer) ---

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
         setBlocks((items) => {
            const oldIndex = items.findIndex(i => i.id === active.id);
            const newIndex = items.findIndex(i => i.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
         });
      }
   };

   // "Insertion Zone" Logic (Insert at Index)
   const addBlockAtIndex = (index: number, type: 'text' | 'gallery' | 'team') => {
      const newBlock: BlockData = {
         id: `${type}-${Date.now()}`,
         type,
         isVisible: true,
         backgroundColor: type === 'team' ? '#F9FAFB' : '#FFFFFF',
         headingColor: '#111827',
         textColor: '#4B5563',
         content: type === 'team' ? { members: [{ name: "New Member", role: "Role", img: "3" }] } :
            type === 'text' ? { heading: "New Section", body: "Click to edit this text..." } : {}
      };
      const newBlocks = [...blocks];
      newBlocks.splice(index, 0, newBlock);
      setBlocks(newBlocks);
   };

   // "Repeater" Logic (Add Team Member)
   const addTeamMember = (blockId: string) => {
      setBlocks(prev => prev.map(b => {
         if (b.id === blockId) {
            return {
               ...b,
               content: {
                  ...b.content,
                  members: [...b.content.members, { name: "Name", role: "Role", img: Math.floor(Math.random() * 10).toString() }]
               }
            };
         }
         return b;
      }));
   };

   // Inline Editing Handler
   const updateContent = (id: string, field: string, value: string) => {
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: { ...b.content, [field]: value } } : b));
   };

   // Sidebar Toggle Logic
   const toggleVisibility = (id: string) => {
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, isVisible: !b.isVisible } : b));
   };

   // Update Block Style
   const updateBlockStyle = (id: string, field: 'backgroundColor' | 'textColor' | 'headingColor', value: string) => {
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
   };

   // Delete Block Logic
   const deleteBlock = (id: string) => {
      setBlocks(prev => prev.filter(b => b.id !== id));
   };

   // --- RENDERERS ---

   // The "Insertion Zone" Component
   const InsertionZone = ({ index }: { index: number }) => (
      <div className="group relative h-4 w-full -my-2 z-10 flex items-center justify-center hover:py-4 transition-all">
         <div className="absolute inset-x-0 h-px bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="relative opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button onClick={() => addBlockAtIndex(index, 'text')} className="bg-blue-500 text-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform"><Type className="w-3 h-3" /></button>
            <button onClick={() => addBlockAtIndex(index, 'team')} className="bg-blue-500 text-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform"><Users className="w-3 h-3" /></button>
         </div>
      </div>
   );

   // The Block Component
   const RenderBlock = ({ block }: { block: BlockData }) => {
      if (!block.isVisible) return null;

      switch (block.type) {
         case 'header':
            return (
               <div className="h-80 flex flex-col items-center justify-center text-center p-8 transition-all relative group" style={{ backgroundColor: block.backgroundColor || config.primaryColor }}>
                  <h1
                     contentEditable
                     suppressContentEditableWarning
                     onBlur={(e) => updateContent(block.id, 'title', e.currentTarget.textContent || "")}
                     className="text-5xl font-bold mb-4 tracking-tight outline-none border-b-2 border-transparent focus:border-white/50 cursor-text"
                     style={{ color: block.headingColor || '#FFFFFF' }}
                  >
                     {block.content.title}
                  </h1>
                  <p
                     contentEditable
                     suppressContentEditableWarning
                     onBlur={(e) => updateContent(block.id, 'subtitle', e.currentTarget.textContent || "")}
                     className="text-xl max-w-xl mx-auto outline-none border-b-2 border-transparent focus:border-white/50 cursor-text"
                     style={{ color: block.textColor || 'rgba(255,255,255,0.8)' }}
                  >
                     {block.content.subtitle}
                  </p>
                  <button className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold shadow-lg hover:scale-105 transition-transform">{block.content.cta}</button>
               </div>
            );
         case 'text':
            return (
               <div className="max-w-2xl mx-auto p-12 group hover:ring-1 hover:ring-blue-500/50 transition-all relative" style={{ backgroundColor: block.backgroundColor || '#FFFFFF' }}>
                  <h2
                     contentEditable
                     suppressContentEditableWarning
                     className="text-3xl font-bold mb-4 outline-none focus:bg-blue-50 rounded px-2 -mx-2"
                     style={{ color: block.headingColor || '#111827' }}
                  >
                     {block.content.heading}
                  </h2>
                  <p
                     contentEditable
                     suppressContentEditableWarning
                     className="leading-relaxed outline-none focus:bg-blue-50 rounded px-2 -mx-2"
                     style={{ color: block.textColor || '#4B5563' }}
                  >
                     {block.content.body}
                  </p>
               </div>
            );
         case 'team':
            return (
               <div className="p-12 group hover:ring-1 hover:ring-blue-500/50 transition-all relative" style={{ backgroundColor: block.backgroundColor || '#F9FAFB' }}>
                  <h3 className="text-2xl font-bold text-center mb-8" style={{ color: block.headingColor || '#111827' }}>Meet the Team</h3>
                  <div className="flex flex-wrap justify-center gap-8">
                     {block.content.members.map((m: any, i: number) => (
                        <div key={i} className="text-center group/member">
                           <img src={`https://i.pravatar.cc/150?img=${m.img}`} className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white shadow-sm" />
                           <p contentEditable suppressContentEditableWarning className="font-bold outline-none focus:bg-blue-100 px-1 rounded" style={{ color: block.headingColor || '#111827' }}>{m.name}</p>
                           <p contentEditable suppressContentEditableWarning className="text-xs outline-none focus:bg-blue-100 px-1 rounded" style={{ color: block.textColor || '#6B7280' }}>{m.role}</p>
                        </div>
                     ))}
                     {/* Repeater Button */}
                     <button onClick={() => addTeamMember(block.id)} className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-edluar-moss hover:text-edluar-moss transition-all">
                        <Plus className="w-6 h-6" />
                     </button>
                  </div>
               </div>
            );
         default: return null;
      }
   };

   return (
      <div className="flex h-full bg-gray-50 dark:bg-[#0B100D] animate-fade-in">
         {/* Sidebar (Controls) */}
         <div className="w-80 bg-white dark:bg-edluar-deep border-r border-gray-200 dark:border-white/5 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-white/5">
               <h2 className="font-bold text-lg text-gray-900 dark:text-white">Site Builder</h2>
            </div>

            <div className="flex p-2 gap-1 border-b border-gray-200 dark:border-white/5">
               {['editor', 'design'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2 px-1 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${activeTab === tab ? 'bg-edluar-moss/10 text-edluar-moss' : 'text-gray-500 hover:bg-gray-100'}`}>{tab}</button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               {activeTab === 'editor' && (
                  <div className="space-y-4">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Structure</h3>
                     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                           {blocks.map((block) => (
                              <SortableBlock key={block.id} id={block.id} isActive={true}>
                                 {({ listeners, attributes }) => (
                                    <div className="flex items-center gap-3 p-3 border rounded-xl bg-white hover:border-edluar-moss transition-all group">
                                       {/* Drag Handle */}
                                       <div {...listeners} {...attributes} className="cursor-grab text-gray-400 hover:text-gray-600 p-1">
                                          <GripVertical className="w-4 h-4" />
                                       </div>

                                       <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                          {block.type === 'header' ? <Layout className="w-4 h-4" /> : block.type === 'text' ? <Type className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                       </div>
                                       <span className="text-sm font-medium flex-1">{block.type.charAt(0).toUpperCase() + block.type.slice(1)}</span>

                                       {/* Actions */}
                                       <div className="flex items-center gap-1">
                                          {/* Color Pickers Group */}
                                          <div className="flex -space-x-1 hover:space-x-1 transition-all mr-2">
                                             {/* BG Color */}
                                             <div className="relative w-4 h-4 rounded-full overflow-hidden border border-gray-200 shadow-sm group/color cursor-pointer" title="Background Color">
                                                <input
                                                   type="color"
                                                   value={block.backgroundColor || '#ffffff'}
                                                   onChange={(e) => updateBlockStyle(block.id, 'backgroundColor', e.target.value)}
                                                   className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0 opacity-0 group-hover/color:opacity-100"
                                                />
                                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: block.backgroundColor || '#ffffff' }}></div>
                                             </div>
                                             {/* Heading Color */}
                                             <div className="relative w-4 h-4 rounded-full overflow-hidden border border-gray-200 shadow-sm group/color cursor-pointer" title="Heading Color">
                                                <input
                                                   type="color"
                                                   value={block.headingColor || '#111827'}
                                                   onChange={(e) => updateBlockStyle(block.id, 'headingColor', e.target.value)}
                                                   className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0 opacity-0 group-hover/color:opacity-100"
                                                />
                                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: block.headingColor || '#111827' }}></div>
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[8px] font-bold text-white mix-blend-difference">H</div>
                                             </div>
                                             {/* Text Color */}
                                             <div className="relative w-4 h-4 rounded-full overflow-hidden border border-gray-200 shadow-sm group/color cursor-pointer" title="Text Color">
                                                <input
                                                   type="color"
                                                   value={block.textColor || '#4B5563'}
                                                   onChange={(e) => updateBlockStyle(block.id, 'textColor', e.target.value)}
                                                   className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0 opacity-0 group-hover/color:opacity-100"
                                                />
                                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: block.textColor || '#4B5563' }}></div>
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[8px] font-bold text-white mix-blend-difference">T</div>
                                             </div>
                                          </div>

                                          <button
                                             onClick={(e) => { e.stopPropagation(); toggleVisibility(block.id); }}
                                             className={`p-1 rounded hover:bg-gray-100 ${block.isVisible ? 'text-green-500' : 'text-gray-300'}`}
                                             title={block.isVisible ? "Hide Section" : "Show Section"}
                                          >
                                             {block.isVisible ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                          </button>
                                          <button
                                             onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                                             className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                                             title="Delete Section"
                                          >
                                             <Trash2 className="w-4 h-4" />
                                          </button>
                                       </div>
                                    </div>
                                 )}
                              </SortableBlock>
                           ))}
                        </SortableContext>
                     </DndContext>
                     <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                        <p className="text-xs text-gray-400 text-center mb-3">Add New Section</p>
                        <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => addBlockAtIndex(blocks.length, 'text')} className="p-2 border rounded-lg text-xs font-bold hover:bg-gray-50 flex items-center gap-2 justify-center"><Type className="w-3 h-3" /> Text</button>
                           <button onClick={() => addBlockAtIndex(blocks.length, 'team')} className="p-2 border rounded-lg text-xs font-bold hover:bg-gray-50 flex items-center gap-2 justify-center"><Users className="w-3 h-3" /> Team</button>
                        </div>
                     </div>
                  </div>
               )}
               {activeTab === 'design' && (
                  <div className="space-y-6">
                     <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">Select a Template</h3>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mb-4">Applying a template will update your site's colors, fonts, and layout.</p>

                        <div className="grid grid-cols-1 gap-4">
                           {templates.map(t => (
                              <button
                                 key={t.id}
                                 onClick={() => applyTemplate(t.id)}
                                 className="group relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-edluar-moss transition-all text-left"
                              >
                                 <img src={t.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                    <span className="text-white font-bold text-sm">{t.name}</span>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-white/5"><Button className="w-full justify-center">Publish</Button></div>
         </div>

         {/* Live Preview */}
         <div className="flex-1 p-8 overflow-y-auto bg-gray-100 dark:bg-black/50 flex justify-center">
            <div className="w-full max-w-4xl bg-white min-h-[800px] shadow-2xl rounded-xl overflow-hidden flex flex-col animate-fade-in-up border border-gray-200/50">
               <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div></div>
                  <div className="flex-1 text-center"><span className="text-[10px] text-gray-400 font-mono">preview.edluar.com</span></div>
               </div>

               <div className="flex-1 relative group overflow-y-auto font-sans" style={{ fontFamily: config.font }}>
                  {blocks.map((block, index) => (
                     <React.Fragment key={block.id}>
                        <InsertionZone index={index} />
                        <RenderBlock block={block} />
                     </React.Fragment>
                  ))}
                  <InsertionZone index={blocks.length} /> {/* Bottom Zone */}
               </div>
            </div>
         </div>
      </div>
   );
};

// 4. INBOX VIEW (Video-Aligned Redesign)
const InboxView = () => {
   const [activeChat, setActiveChat] = useState<Conversation>(conversations[0]);
   const [inputMode, setInputMode] = useState<'email' | 'note'>('email'); // NEW: Toggle State
   const [newMessage, setNewMessage] = useState("");

   const handleSend = () => {
      if (!newMessage.trim()) return;
      // Mock Send Logic
      const msg: Message = {
         id: Date.now(),
         type: inputMode,
         sender: 'recruiter',
         text: newMessage,
         timestamp: 'Just now',
         isRead: true,
         authorName: inputMode === 'note' ? "Alex (You)" : undefined
      };
      const updatedChat = { ...activeChat, messages: [...activeChat.messages, msg] };
      setActiveChat(updatedChat);
      setNewMessage("");
   };

   return (
      <div className="flex h-full bg-white dark:bg-edluar-deep animate-fade-in overflow-hidden">

         {/* 1. LEFT RAIL: Candidate List */}
         <div className="w-80 border-r border-gray-200 dark:border-white/10 flex flex-col bg-white dark:bg-edluar-surface z-10">
            <div className="p-4 border-b border-gray-200 dark:border-white/10">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white">Inbox</h2>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500"><Filter className="w-4 h-4" /></button>
               </div>
               <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search candidates..." className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-white/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-edluar-moss/50 transition-all" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               {conversations.map((chat) => (
                  <div
                     key={chat.candidateId}
                     onClick={() => setActiveChat(chat)}
                     className={`p-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all ${activeChat.candidateId === chat.candidateId ? 'bg-blue-50 dark:bg-white/10 border-l-4 border-l-edluar-moss' : 'border-l-4 border-l-transparent'}`}
                  >
                     <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                           <div className="relative">
                              <img src={chat.candidateAvatar} className="w-10 h-10 rounded-full object-cover" />
                              {chat.unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-edluar-moss border-2 border-white rounded-full"></span>}
                           </div>
                           <div>
                              <span className="font-bold text-sm text-gray-900 dark:text-white block">{chat.candidateName}</span>
                              <span className="text-xs text-gray-500">{chat.role}</span>
                           </div>
                        </div>
                        <span className="text-[10px] text-gray-400">{chat.lastMessageTime}</span>
                     </div>
                     <p className="text-xs text-gray-500 truncate mt-2 pl-12">{chat.lastMessage}</p>
                  </div>
               ))}
            </div>
         </div>

         {/* 2. CENTER RAIL: Communication Stream */}
         <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0B100D] min-w-0">
            {/* Header */}
            <div className="h-16 bg-white dark:bg-edluar-surface border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 flex-shrink-0">
               <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{activeChat.candidateName}</h3>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">
                     {activeChat.stage}
                  </span>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="hidden sm:flex"><CheckCircle2 className="w-4 h-4 mr-2" /> Move to Offer</Button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><MoreHorizontal className="w-5 h-5" /></button>
               </div>
            </div>

            {/* Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
               {activeChat.messages.map((msg) => {
                  // SYSTEM EVENT (Center)
                  if (msg.type === 'event') {
                     return (
                        <div key={msg.id} className="flex justify-center">
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
                              {msg.text} • {msg.timestamp}
                           </span>
                        </div>
                     );
                  }

                  // INTERNAL NOTE (Yellow Bubble)
                  if (msg.type === 'note') {
                     return (
                        <div key={msg.id} className="flex justify-end px-8">
                           <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 p-4 rounded-xl max-w-lg w-full relative group">
                              <div className="flex items-center gap-2 mb-2 border-b border-yellow-200/50 pb-2">
                                 <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-white font-bold">N</div>
                                 <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">Internal Note from {msg.authorName}</span>
                                 <span className="text-[10px] text-yellow-600/60 ml-auto">{msg.timestamp}</span>
                              </div>
                              <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">{msg.text}</p>
                           </div>
                        </div>
                     );
                  }

                  // STANDARD EMAIL (Left/Right)
                  return (
                     <div key={msg.id} className={`flex ${msg.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-lg ${msg.sender === 'recruiter' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                           {/* Avatar only for candidate messages to reduce noise on sender side */}
                           {msg.sender === 'candidate' && <img src={activeChat.candidateAvatar} className="w-8 h-8 rounded-full self-end" />}

                           <div className={`p-4 rounded-2xl shadow-sm ${msg.sender === 'recruiter'
                              ? 'bg-white dark:bg-edluar-moss text-gray-900 dark:text-white rounded-tr-none border border-gray-200 dark:border-edluar-moss'
                              : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'
                              }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                              <div className={`text-[10px] mt-2 text-right ${msg.sender === 'recruiter' ? 'text-gray-400 dark:text-white/60' : 'text-gray-400'}`}>
                                 {msg.timestamp} {msg.isRead && msg.sender === 'recruiter' && '• Read'}
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>

            {/* Input Area (The "Tabbed" Interface from Video) */}
            <div className="bg-white dark:bg-edluar-surface border-t border-gray-200 dark:border-white/10 p-4">
               {/* Input Tabs */}
               <div className="flex gap-1 mb-0 ml-2">
                  <button
                     onClick={() => setInputMode('email')}
                     className={`px-4 py-2 text-xs font-bold rounded-t-lg border-t border-x transition-all ${inputMode === 'email' ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-edluar-dark dark:text-white relative top-[1px] z-10' : 'bg-gray-50 dark:bg-black/20 border-transparent text-gray-500'}`}
                  >
                     <Mail className="w-3 h-3 inline mr-2" /> Email
                  </button>
                  <button
                     onClick={() => setInputMode('note')}
                     className={`px-4 py-2 text-xs font-bold rounded-t-lg border-t border-x transition-all ${inputMode === 'note' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-500 relative top-[1px] z-10' : 'bg-gray-50 dark:bg-black/20 border-transparent text-gray-500'}`}
                  >
                     <FileText className="w-3 h-3 inline mr-2" /> Internal Note
                  </button>
               </div>

               {/* Input Box */}
               <div className={`rounded-xl rounded-tl-none border p-2 transition-colors ${inputMode === 'note' ? 'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/30' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10'}`}>
                  <textarea
                     className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-48 min-h-[80px] p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400"
                     placeholder={inputMode === 'email' ? "Write a reply to Liam..." : "Leave a private note for the team..."}
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <div className="flex justify-between items-center px-2 pb-2 mt-2">
                     <div className="flex gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-white/10"><Paperclip className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-white/10"><Layout className="w-4 h-4" /></button> {/* Templates */}
                     </div>
                     <button
                        onClick={handleSend}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-md ${inputMode === 'note' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-edluar-moss hover:bg-edluar-dark'}`}
                     >
                        {inputMode === 'email' ? 'Send Email' : 'Save Note'} <Send className="w-3 h-3" />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* 3. RIGHT RAIL: Context (Video Style) */}
         <div className="w-72 bg-white dark:bg-edluar-surface border-l border-gray-200 dark:border-white/10 hidden xl:flex flex-col overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 text-center">
               <img src={activeChat.candidateAvatar} className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-gray-50 dark:border-white/5" />
               <h2 className="font-bold text-lg text-gray-900 dark:text-white">{activeChat.candidateName}</h2>
               <p className="text-sm text-gray-500 mb-4">{activeChat.role}</p>
               <div className="flex justify-center gap-2">
                  <a href="#" className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-500 transition-colors"><Linkedin className="w-4 h-4" /></a>
                  <a href="#" className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200"><Globe className="w-4 h-4" /></a>
               </div>
            </div>

            <div className="p-6 space-y-6">
               <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Details</h4>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300 truncate">liam.chen@example.com</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">San Francisco, CA</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">5 Years Exp.</span>
                     </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Attachments</h4>
                  <div className="p-3 border border-gray-200 dark:border-white/10 rounded-lg flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                     <div className="w-8 h-8 bg-red-100 text-red-500 rounded flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                     <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Liam_Resume_2024.pdf</p>
                        <p className="text-[10px] text-gray-500">2.4 MB • Added 2d ago</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

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
   const [activeView, setActiveView] = useState<'overview' | 'jobs' | 'candidates' | 'career_site' | 'inbox' | 'calendar' | 'reports' | 'settings'>('overview');
   const [isJobModalOpen, setIsJobModalOpen] = useState(false);
   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

   const handleLogout = () => { logout(); onNavigate('home'); };

   const handleCreateJob = (jobData: any) => {
      console.log("Creating Job:", jobData);
      setIsJobModalOpen(false);
      setActiveView('career_site'); // Auto-redirect to Editor (Like Video)
   };

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
            <div className="p-6 relative">
               <div
                  className="flex items-center gap-3 cursor-pointer hover:bg-edluar-pale/20 dark:hover:bg-white/5 p-2 rounded-xl transition-colors"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
               >
                  <div className="w-10 h-10 bg-edluar-moss rounded-full flex items-center justify-center text-white font-bold font-serif shadow-md text-sm">
                     {initials}
                  </div>
                  <div className="flex flex-col">
                     <span className="font-bold text-sm text-edluar-dark dark:text-white leading-tight">{displayName}</span>
                     <span className="text-[10px] text-edluar-dark/50 dark:text-white/50">Workspace Admin</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 ml-auto text-edluar-dark/40 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
               </div>

               {/* PROFILE DROPDOWN MENU */}
               {isProfileMenuOpen && (
                  <>
                     <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                     <div className="absolute top-full left-0 w-full bg-white dark:bg-edluar-surface border border-edluar-pale dark:border-white/10 rounded-xl shadow-xl z-50 mt-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-edluar-pale/50 dark:border-white/5 bg-edluar-cream/30 dark:bg-white/5">
                           <p className="font-bold text-edluar-dark dark:text-white text-sm">{displayName}</p>
                           <p className="text-xs text-edluar-dark/50 dark:text-white/50 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                        <div className="p-2 space-y-1">
                           <button
                              onClick={() => { setIsProfileMenuOpen(false); setActiveView('settings'); }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-edluar-dark/70 dark:text-white/70 hover:bg-edluar-pale/30 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                           >
                              <User className="w-4 h-4" /> My Profile
                           </button>
                           <button
                              onClick={() => { setIsProfileMenuOpen(false); setActiveView('settings'); }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-edluar-dark/70 dark:text-white/70 hover:bg-edluar-pale/30 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                           >
                              <Settings className="w-4 h-4" /> Account Settings
                           </button>
                        </div>
                        <div className="h-px bg-edluar-pale/50 dark:bg-white/5 mx-2"></div>
                        <div className="p-2">
                           <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-edluar-moss hover:bg-edluar-moss/10 rounded-lg transition-colors text-left">
                              <ShieldCheck className="w-4 h-4" /> Workspace Admin
                           </button>
                        </div>
                        <div className="h-px bg-edluar-pale/50 dark:bg-white/5 mx-2"></div>
                        <div className="p-2">
                           <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-edluar-dark/70 dark:text-white/70 hover:bg-edluar-pale/30 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                              <HelpCircle className="w-4 h-4" /> Help & Support
                           </button>
                        </div>
                        <div className="h-px bg-edluar-pale/50 dark:bg-white/5 mx-2"></div>
                        <div className="p-2">
                           <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                           >
                              <LogOut className="w-4 h-4" /> Log Out
                           </button>
                        </div>
                     </div>
                  </>
               )}
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
            </div>
            <div className="p-4 border-t border-edluar-pale/50 dark:border-white/5 space-y-2">
               <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-edluar-dark/60 dark:text-edluar-cream/60 hover:text-edluar-moss transition-colors">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
               </button>
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
               {activeView === 'overview' && <OverviewView user={user} onOpenCreate={() => setIsJobModalOpen(true)} />}
               {activeView === 'jobs' && <JobsListView onOpenCreate={() => setIsJobModalOpen(true)} />}
               {activeView === 'candidates' && <ATSView />}
               {activeView === 'career_site' && <CareerSiteView />}
               {activeView === 'calendar' && <ScheduleView />}
               {activeView === 'reports' && <ReportsView />}
               {activeView === 'inbox' && <InboxView />}
               {activeView !== 'overview' && activeView !== 'jobs' && activeView !== 'candidates' && activeView !== 'career_site' && activeView !== 'calendar' && activeView !== 'reports' && activeView !== 'inbox' && activeView !== 'settings' && (
                  <div className="flex flex-col items-center justify-center h-full text-edluar-dark/40">
                     <Briefcase className="w-16 h-16 mb-4 opacity-20" />
                     <p>The {activeView} module is coming in Edluar v2.3</p>
                  </div>
               )}
            </div>
            <CreateJobModal
               isOpen={isJobModalOpen}
               onClose={() => setIsJobModalOpen(false)}
               onComplete={handleCreateJob}
            />
         </main>
      </div>
   );
};