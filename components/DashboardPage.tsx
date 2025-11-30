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
   Pencil,
   TrendingUp,
   Mail,

   Trash2,
   Wand2,
   AlertCircle,
   LayoutDashboard,
   Archive,
   ArrowUpRight
} from 'lucide-react';
import { generateEmailDraft } from '../services/geminiService';
import { RichTextEditor } from './RichTextEditor';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';
import { CandidateProfileModal } from './CandidateProfileModal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { DroppableColumn, DraggableCandidate } from './KanbanHelpers';
import { JobEditor } from '../src/pages/JobEditor';
import { SITE_TEMPLATES } from '../src/data/templates';
import { CreateTodoModal } from './CreateTodoModal';
import { ScheduleView } from './ScheduleView';
import { GlassCard } from './GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

// --- ASSETS & CONSTANTS ---
const COLORS = {
   sageLight: '#A7C9B0',
   sageDark: '#7A9A85',
   cream: '#F5F7F2',
   creamDark: '#E6E8E3',
   textMain: '#2D362F',
   textMuted: '#6B7A6F',
   white: '#FFFFFF',
   glassBorder: 'rgba(255, 255, 255, 0.6)',
   accent: '#D4E2D4'
};



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
import { findTemplate } from '../src/data/jobTemplates';

// 1. CREATE JOB MODAL
const CreateJobModal = ({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete: (job: any) => void }) => {
   const [step, setStep] = useState(1);
   const [isCreating, setIsCreating] = useState(false);
   const [matchedTemplate, setMatchedTemplate] = useState<{ keyword: string; content: string } | null>(null);
   const [data, setData] = useState({
      title: '',
      type: 'Full-time',
      department: 'Product',
      location: 'Remote',
      strategy: 'balanced', // 'speed' | 'balanced' | 'quality'
      template: 'neon', // 'neon' | 'minimal' | 'corporate'
      content_blocks: [] as any[], // Initialize content_blocks
      formConfig: {
         personalInfo: {
            fullName: { enabled: true, required: true },
            email: { enabled: true, required: true },
            phone: { enabled: true, required: false },
            linkedin: { enabled: true, required: false },
            portfolio: { enabled: true, required: false }
         },
         questions: []
      }
   });

   if (!isOpen) return null;

   const handleNext = async () => {
      if (step < 3) {
         setStep(s => s + 1);
      } else {
         // Final Step: Create Job via API
         setIsCreating(true);
         try {
            // Find selected template config
            const selectedTemplate = SITE_TEMPLATES.find(t => t.name === data.template) || SITE_TEMPLATES[0];

            if (!selectedTemplate) {
               throw new Error("No template selected or available.");
            }

            const jobPayload = {
               title: data.title,
               type: data.type,
               department: data.department,
               location: data.location,
               status: 'active',
               content_blocks: selectedTemplate.config.blocks,
               theme_config: selectedTemplate.config,
               // Initialize empty form config or default
               application_form_config: {
                  personalInfo: {
                     fullName: { enabled: true, required: true },
                     email: { enabled: true, required: true },
                     phone: { enabled: true, required: true },
                     resume: { enabled: true, required: true },
                     coverLetter: { enabled: true, required: false },
                     linkedin: { enabled: true, required: false },
                     portfolio: { enabled: true, required: false }
                  },
                  questions: []
               }
            };

            const response = await fetch('http://localhost:5000/api/jobs', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(jobPayload)
            });

            if (response.ok) {
               const newJob = await response.json();
               onComplete(newJob); // Pass full job object back
            } else {
               console.error("Failed to create job");
               alert("Failed to create job. Please try again.");
            }
         } catch (error) {
            console.error("Error creating job:", error);
            alert("Error creating job: " + (error as Error).message);
         } finally {
            setIsCreating(false);
         }
      }
   };

   // TEMPLATE DATA
   const visualTemplates = SITE_TEMPLATES;

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
                           onChange={(e) => {
                              setData({ ...data, title: e.target.value });
                              // Check for template match
                              const match = findTemplate(e.target.value);
                              setMatchedTemplate(match);
                           }}
                           className="w-full p-5 text-2xl bg-white dark:bg-black/20 border-2 border-gray-200 dark:border-white/10 rounded-xl focus:border-edluar-moss focus:ring-4 focus:ring-edluar-moss/10 outline-none transition-all placeholder:text-gray-300"
                           placeholder="e.g. Senior Product Designer"
                        />
                        {matchedTemplate && (
                           <button
                              onClick={() => {
                                 // Inject template
                                 setData(prev => ({
                                    ...prev,
                                    content_blocks: [
                                       { type: 'text', content: matchedTemplate.content },
                                       ...prev.content_blocks.slice(1) // Keep other blocks if any, or just replace first
                                    ]
                                 }));
                                 setMatchedTemplate(null); // Hide button after use
                              }}
                              className="mt-2 flex items-center gap-2 text-sm text-edluar-moss font-medium hover:underline animate-fade-in"
                           >
                              <span className="w-5 h-5 rounded-full bg-edluar-moss/10 flex items-center justify-center">✨</span>
                              Use '{matchedTemplate.keyword}' description template?
                           </button>
                        )}
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
                                       <img src={tmpl.thumbnail} alt={tmpl.name} className="w-full h-full object-cover" />
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
                                             {/* Add template specific tags if any, or default */}
                                             <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                                                {tmpl.config?.font || 'Modern'}
                                             </span>
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
               <Button onClick={handleNext} className="shadow-xl px-8 py-3 text-base" disabled={isCreating}>
                  {isCreating ? 'Creating...' : step === 3 ? "Launch Live Editor" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
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

// --- 1.5 TODOS VIEW (Dedicated Module)
const TodosView = ({ todos, onRefresh }: { todos: any[], onRefresh: () => void }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const isPastDue = (dueDate: string) => {
      if (!dueDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(dueDate) < today;
   };

   const isToday = (dueDate: string) => {
      if (!dueDate) return false;
      const date = new Date(dueDate);
      const today = new Date();
      return date.toDateString() === today.toDateString();
   };

   const pendingTodos = todos.filter(t => t.status === 'pending');

   const overdueTasks = pendingTodos.filter(t => isPastDue(t.due_date));
   const todayTasks = pendingTodos.filter(t => isToday(t.due_date));
   const upcomingTasks = pendingTodos.filter(t => !isPastDue(t.due_date) && !isToday(t.due_date));

   const handleComplete = async (id: number) => {
      try {
         await fetch(`http://localhost:5000/api/todos/${id}/complete`, { method: 'PATCH' });
         onRefresh();
      } catch (e) { console.error(e); }
   };

   const TaskCard = ({ task }: { task: any }) => (
      <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group animate-fade-in">
         <div className="flex items-start gap-3">
            <button
               onClick={() => handleComplete(task.id)}
               className="mt-1 w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-edluar-moss hover:bg-edluar-moss/10 transition-all flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
               <p className="font-medium text-gray-900 dark:text-white truncate">{task.task}</p>
               <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                  {task.candidate_name && (
                     <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        <User className="w-3 h-3" /> {task.candidate_name}
                     </span>
                  )}
                  {task.due_date && (
                     <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(task.due_date).toLocaleDateString()}
                     </span>
                  )}
               </div>
            </div>
         </div>
      </div>
   );

   return (
      <div className="p-8 h-full flex flex-col bg-gray-50 dark:bg-[#0B100D] animate-fade-in">
         <div className="flex justify-between items-center mb-8">
            <div>
               <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">My Tasks</h1>
               <p className="text-gray-500 mt-1">Manage your recruiting priorities</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Task</Button>
         </div>

         <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden min-h-0">
            {/* Overdue */}
            <div className="flex flex-col h-full bg-red-50/30 dark:bg-red-900/5 rounded-2xl p-4 border border-red-100 dark:border-red-900/20">
               <div className="flex items-center gap-2 mb-4 text-red-600 font-bold">
                  <AlertCircle className="w-5 h-5" />
                  Overdue <span className="bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full text-xs">{overdueTasks.length}</span>
               </div>
               <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {overdueTasks.map(t => <TaskCard key={t.id} task={t} />)}
               </div>
            </div>

            {/* Today */}
            <div className="flex flex-col h-full bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
               <div className="flex items-center gap-2 mb-4 text-edluar-moss font-bold">
                  <Calendar className="w-5 h-5" />
                  Today <span className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs text-edluar-moss">{todayTasks.length}</span>
               </div>
               <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {todayTasks.map(t => <TaskCard key={t.id} task={t} />)}
               </div>
            </div>

            {/* Upcoming */}
            <div className="flex flex-col h-full bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
               <div className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-300 font-bold">
                  <TrendingUp className="w-5 h-5" />
                  Upcoming <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs">{upcomingTasks.length}</span>
               </div>
               <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {upcomingTasks.map(t => <TaskCard key={t.id} task={t} />)}
               </div>
            </div>
         </div>

         <CreateTodoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTaskCreated={onRefresh}
         />
      </div>
   );
};

// 1. OVERVIEW (Personal Dashboard - Reskinned)
const OverviewView = ({ user, onOpenCreate, notifications, onNavigateToInbox, onNavigateToSchedule }: { user: any; onOpenCreate: () => void; notifications: any[]; onNavigateToInbox: (candidateId: number) => void; onNavigateToSchedule: () => void }) => {
   const [todos, setTodos] = React.useState<any[]>([]);
   const [isTodoModalOpen, setIsTodoModalOpen] = React.useState(false);
   const [stats, setStats] = React.useState<any>({ total: 0, new: 0, history: [] });
   const [pipeline, setPipeline] = React.useState<any[]>([]);
   const [interviews, setInterviews] = React.useState<any[]>([]);
   const [recentActivities, setRecentActivities] = React.useState<any[]>([]);
   const [jobs, setJobs] = React.useState<any[]>([]);
   const [selectedPipelineJobId, setSelectedPipelineJobId] = React.useState<string>('all');
   const [allApplications, setAllApplications] = React.useState<any>({});

   const [templates, setTemplates] = React.useState<any[]>([
      { id: 'new', title: "No template", image: null, color: "bg-edluar-cream", type: "default" },
      { title: "Future Forward", image: "https://images.unsplash.com/photo-1497366216548-37526070297c", color: "bg-purple-100", type: "custom" },
      { title: "Clean Corporate", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174", color: "bg-blue-100", type: "custom" },
   ]);

   const getInitials = (name: string) => name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
   const displayName = user?.name || 'Guest User';
   const initials = user?.name ? getInitials(user.name) : 'GU';

   // Fetch Data
   React.useEffect(() => {
      fetchTodos();
      fetchApplications();
      fetchUpcomingInterviews();
      fetchTemplates();
      fetchRecentActivities();
      fetchJobs();
   }, []);

   // Calculate Stats & Pipeline when data or filter changes
   React.useEffect(() => {
      if (!allApplications || Object.keys(allApplications).length === 0) return;

      let filteredApps = Object.values(allApplications).flat() as any[];

      if (selectedPipelineJobId !== 'all') {
         filteredApps = filteredApps.filter(app => app.job_id === parseInt(selectedPipelineJobId));
      }

      // Calculate Stats
      const total = filteredApps.length;
      const today = new Date().toISOString().split('T')[0];
      const newCount = filteredApps.filter(app => app.applied_at?.startsWith(today)).length;

      // Calculate History (Last 7 days)
      const history = [];
      for (let i = 6; i >= 0; i--) {
         const d = new Date();
         d.setDate(d.getDate() - i);
         const dateString = d.toISOString().split('T')[0];
         const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

         const count = filteredApps.filter(app => app.applied_at?.startsWith(dateString)).length;
         history.push({ name: dayName, value: count });
      }

      setStats({ total, new: newCount, history });

      // Calculate Pipeline
      const stages = [
         { key: 'applied', label: 'Applied', color: 'bg-blue-200' },
         { key: 'phone_screen', label: 'Screening', color: 'bg-purple-200' },
         { key: 'interview', label: 'Interview', color: 'bg-yellow-200' },
         { key: 'offer', label: 'Offer', color: 'bg-green-200' }
      ];

      const pipelineData = stages.map(stage => {
         const stageApps = allApplications[stage.key] || [];
         const count = selectedPipelineJobId === 'all'
            ? stageApps.length
            : stageApps.filter((app: any) => app.job_id === parseInt(selectedPipelineJobId)).length;

         return { stage: stage.label, count, color: stage.color };
      });

      setPipeline(pipelineData);

   }, [allApplications, selectedPipelineJobId]);

   const fetchRecentActivities = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/activities/recent');
         const data = await response.json();
         setRecentActivities(Array.isArray(data) ? data : []);
      } catch (error) {
         console.error("Failed to fetch recent activities:", error);
      }
   };

   const fetchTemplates = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/jobs');
         const data = await response.json();
         // Use actual jobs as templates, plus the "No template" option
         const jobTemplates = Array.isArray(data) ? data.map((job: any) => ({
            id: job.id,
            title: job.title,
            image: null, // Placeholder or fetch if available
            color: "bg-white",
            type: "custom"
         })) : [];

         setTemplates([
            { id: 'new', title: "No template", image: null, color: "bg-edluar-cream", type: "default" },
            ...jobTemplates
         ]);
      } catch (error) {
         console.error("Failed to fetch templates:", error);
      }
   };

   const fetchTodos = async () => {
      try {
         // Fetch ALL todos to calculate progress
         const response = await fetch('http://localhost:5000/api/todos');
         const data = await response.json();
         setTodos(data.todos || []);
      } catch (error) {
         console.error('Failed to fetch todos:', error);
      }
   };

   const fetchJobs = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/jobs');
         const data = await response.json();
         setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
         console.error("Failed to fetch jobs:", error);
      }
   };

   const fetchApplications = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/applications');
         const data = await response.json();
         setAllApplications(data);
      } catch (error) {
         console.error("Failed to fetch applications:", error);
      }
   };

   const fetchUpcomingInterviews = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/interviews/upcoming');
         const data = await response.json();
         setInterviews(Array.isArray(data) ? data.slice(0, 3) : []); // Show top 3
      } catch (error) {
         console.error("Failed to fetch interviews:", error);
      }
   };

   const handleCompleteTodo = async (id: number) => {
      setTodos(prev => prev.filter(t => t.id !== id));
      try {
         await fetch(`http://localhost:5000/api/todos/${id}/complete`, { method: 'PATCH' });
      } catch (error) {
         fetchTodos();
      }
   };

   const pendingTodos = todos.filter(t => t.status === 'pending');
   const completedCount = todos.filter(t => t.status === 'completed').length;
   const totalDaily = todos.length;
   const progress = totalDaily > 0 ? (completedCount / totalDaily) * 100 : 0;
   const circumference = 2 * Math.PI * 28;
   const strokeDashoffset = circumference - (progress / 100) * circumference;

   return (
      <div className="p-8 max-w-[1600px] mx-auto animate-fade-in-up">
         {/* Greeting Section */}
         <section className="mb-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-white/60 flex items-center justify-center overflow-hidden flex-shrink-0">
               {(user as any)?.avatar ? (
                  <img src={`http://localhost:5000${(user as any).avatar}`} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <span className="text-2xl font-bold text-[#7A9A85]">{initials}</span>
               )}
            </div>
            <div>
               <h1 className="text-4xl font-serif text-[#2D362F] mb-1 tracking-tight">
                  Good afternoon, {displayName.split(' ')[0]}
               </h1>
               <p className="text-[#6B7A6F] text-lg">Here is what's happening at Edluar today.</p>
            </div>
         </section>

         {/* Job Creation Templates Section (Redesigned) */}
         <section className="mb-8">
            <GlassCard className="p-6">
               <h3 className="text-lg font-semibold text-[#2D362F] mb-4">Create a new job</h3>
               <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {templates.map((template, idx) => (
                     <div
                        key={idx}
                        className="min-w-[200px] h-[120px] rounded-xl border border-edluar-pale/50 hover:border-edluar-moss/50 cursor-pointer transition-all hover:shadow-md bg-white flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
                        onClick={onOpenCreate}
                     >
                        {template.type === 'default' ? (
                           <>
                              <div className="w-10 h-10 rounded-full bg-[#F5F7F2] flex items-center justify-center text-[#6B7A6F] group-hover:bg-[#EBF3ED] group-hover:text-[#557C60] transition-colors">
                                 <Plus size={24} />
                              </div>
                              <span className="font-medium text-[#6B7A6F] group-hover:text-[#2D362F]">{template.title}</span>
                           </>
                        ) : (
                           <>
                              <div className={`absolute inset-0 ${template.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                              <div className="z-10 text-center px-4">
                                 <h4 className="font-bold text-[#2D362F] text-sm line-clamp-2">{template.title}</h4>
                                 <p className="text-[10px] text-[#6B7A6F] mt-1 uppercase tracking-wider">Template</p>
                              </div>
                           </>
                        )}
                     </div>
                  ))}
               </div>
            </GlassCard>
         </section>

         <div className="grid grid-cols-12 gap-6 mb-8">
            {/* ROW 1: To-Dos & Active Pipeline */}

            {/* To-Do Widget */}
            <div className="col-span-12 lg:col-span-6">
               <GlassCard className="p-6 h-[320px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-semibold text-[#2D362F]">To-Dos</h3>
                     <button onClick={() => setIsTodoModalOpen(true)} className="text-[#A7C9B0] hover:text-[#7A9A85]">
                        <Plus size={20} />
                     </button>
                  </div>

                  <div className="flex items-center gap-6 mb-8">
                     <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="32" cy="32" r="28" stroke="#E6E8E3" strokeWidth="6" fill="none" />
                           <circle
                              cx="32" cy="32" r="28"
                              stroke="#A7C9B0" strokeWidth="6" fill="none"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                           />
                        </svg>
                        <span className="absolute text-xs font-bold text-[#557C60]">{Math.round(progress)}%</span>
                     </div>
                     <div>
                        <h4 className="font-medium text-[#2D362F]">Daily Progress</h4>
                        <p className="text-xs text-[#6B7A6F]">{completedCount} of {totalDaily} items completed</p>
                     </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                     {pendingTodos.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No pending tasks</p>
                     ) : (
                        pendingTodos.slice(0, 3).map(todo => (
                           <div key={todo.id} className="flex items-center gap-3 group">
                              <button
                                 onClick={() => handleCompleteTodo(todo.id)}
                                 className="w-5 h-5 rounded-full border-2 border-[#A7C9B0] group-hover:bg-[#A7C9B0] transition-colors"
                              />
                              <span className="text-sm text-[#2D362F]">{todo.task}</span>
                           </div>
                        ))
                     )}
                  </div>
               </GlassCard>
            </div>

            {/* Active Pipeline Widget */}
            <div className="col-span-12 lg:col-span-6">
               <GlassCard className="p-6 h-[320px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-semibold text-[#2D362F]">Active Pipeline</h3>
                     <select
                        value={selectedPipelineJobId}
                        onChange={(e) => setSelectedPipelineJobId(e.target.value)}
                        className="bg-white/50 border border-edluar-pale/50 rounded-lg px-2 py-1 text-xs text-[#2D362F] focus:outline-none focus:ring-2 focus:ring-edluar-moss/50"
                     >
                        <option value="all">All Jobs</option>
                        {jobs.map(job => (
                           <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                     </select>
                  </div>
                  <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                     {pipeline.map((stage) => (
                        <div key={stage.stage}>
                           <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-medium text-[#2D362F]">{stage.stage}</span>
                              <span className="text-[#6B7A6F]">{stage.count}</span>
                           </div>
                           <div className="h-2 bg-[#F5F7F2] rounded-full overflow-hidden">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(stage.count / (stats.total || 1)) * 100}%` }}
                                 transition={{ duration: 1, ease: "easeOut" }}
                                 className={`h-full ${stage.color} rounded-full`}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </GlassCard>
            </div>

            {/* ROW 2: Schedule, Stats, Inbox */}

            {/* Schedule Widget */}
            <div className="col-span-12 lg:col-span-4">
               <GlassCard className="p-6 h-[320px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-semibold text-[#2D362F]">Upcoming Event</h3>
                     <button className="text-[#A7C9B0] hover:text-[#7A9A85]" onClick={onNavigateToSchedule}>
                        <Calendar size={20} />
                     </button>
                  </div>
                  <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                     {interviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                           <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                           <p className="text-sm">No upcoming interviews</p>
                        </div>
                     ) : (
                        interviews.map((event) => (
                           <div key={event.id} className="flex gap-3 p-2 bg-white/40 rounded-xl border border-white/50">
                              <div className="flex flex-col items-center justify-center w-10 bg-white rounded-lg shadow-sm py-1">
                                 <span className="text-[10px] font-bold text-[#A7C9B0]">{new Date(event.interview_date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                 <span className="text-base font-bold text-[#2D362F]">{new Date(event.interview_date).getDate()}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                 <h4 className="font-medium text-[#2D362F] text-sm truncate">{event.title}</h4>
                                 <p className="text-xs text-[#6B7A6F] truncate">{new Date(event.interview_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.candidate_name}</p>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </GlassCard>
            </div>

            {/* Candidates Stats Widget */}
            <div className="col-span-12 lg:col-span-4">
               <GlassCard className="p-6 h-[320px] flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[#6B7A6F] text-sm font-medium mb-1">Total Candidates</p>
                        <h3 className="text-4xl font-serif text-[#2D362F]">{stats.total}</h3>
                     </div>
                     <div className="bg-[#EBF3ED] px-3 py-1 rounded-full text-xs font-bold text-[#557C60]">
                        +{stats.new} New
                     </div>
                  </div>
                  <div className="h-40 w-full mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.history}>
                           <Bar dataKey="value" fill="#A7C9B0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </GlassCard>
            </div>

            {/* Inbox Widget (Real Data) */}
            <div className="col-span-12 lg:col-span-4">
               <GlassCard className="p-6 h-[320px] flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-semibold text-[#2D362F]">Inbox</h3>
                     <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                        Recent
                     </span>
                  </div>
                  <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                     {recentActivities.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No recent messages</p>
                     ) : (
                        recentActivities.map((activity) => (
                           <div
                              key={activity.id}
                              className="flex items-center gap-3 p-2 hover:bg-white/40 rounded-lg transition-colors cursor-pointer"
                              onClick={() => {
                                 // Use application_id if available, otherwise we might need to look it up or just open the candidate
                                 // Assuming activity has candidate_id or application_id
                                 if (activity.candidate_id) {
                                    onNavigateToInbox(activity.candidate_id);
                                 } else if (activity.application_id) {
                                    // Fallback if candidate_id is missing but application_id exists (though logic usually needs candidateId)
                                    // For now, we rely on candidate_id being present in the view model
                                    console.warn("No candidate_id found for activity", activity);
                                 }
                              }}
                           >
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                                 {activity.type === 'email' ? <MessageSquare size={14} /> : <FileText size={14} />}
                              </div>
                              <div className="min-w-0 flex-1">
                                 <p className="text-sm font-medium text-[#2D362F] truncate">{activity.candidate_name}</p>
                                 <p className="text-xs text-[#6B7A6F] truncate">{activity.content}</p>
                              </div>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                 {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                        ))
                     )}
                  </div>
               </GlassCard>
            </div>
         </div>

         {/* Todo Modal */}
         <CreateTodoModal
            isOpen={isTodoModalOpen}
            onClose={() => setIsTodoModalOpen(false)}
            onTaskCreated={fetchTodos}
         />
      </div>
   );
};

// 2. JOBS LIST VIEW
const JobsListView = ({ onOpenCreate, onEdit, onNavigate }: { onOpenCreate: () => void; onEdit: (id: number) => void; onNavigate: (page: string, params?: any) => void }) => {
   const [jobs, setJobs] = useState<any[]>([]);
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
      fetch('http://localhost:5000/api/jobs')
         .then(res => res.json())
         .then(data => setJobs(data))
         .catch(err => console.error("Failed to fetch jobs:", err));
   }, []);

   // NEW: Track editing state
   const [editingJobId, setEditingJobId] = useState<number | null>(null);

   const handleDelete = async (id: number) => {
      if (window.confirm("Are you sure you want to permanently delete this job? This action cannot be undone and will remove all associated applications.")) {
         try {
            const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
               method: 'DELETE',
            });
            if (response.ok) {
               setJobs(jobs.filter(job => job.id !== id));
            } else {
               alert("Failed to delete job");
            }
         } catch (error) {
            console.error("Error deleting job:", error);
            alert("Error deleting job");
         }
      }
   };

   if (editingJobId) {
      return <JobEditor onBack={() => setEditingJobId(null)} jobId={editingJobId} onSwitchJob={setEditingJobId} onNavigate={onNavigate} />;
   }

   // Filter Logic
   const filteredJobs = jobs.filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <div className="p-8 max-w-7xl mx-auto animate-fade-in">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Jobs</h2>
            <Button variant="primary" size="sm" onClick={onOpenCreate}><Plus className="w-4 h-4 mr-2" /> Create Job</Button>
         </div>

         {/* Search Bar */}
         <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
               type="text"
               placeholder="Search jobs by title, department..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-edluar-moss"
            />
         </div>

         <div className="grid gap-4">
            {filteredJobs.length === 0 && (
               <div className="text-center py-12 text-gray-500">
                  {jobs.length === 0 ? "No active jobs found. Start by creating one!" : "No jobs match your search."}
               </div>
            )}
            {filteredJobs.map((job) => (
               <div
                  key={job.id}
                  onClick={() => setEditingJobId(job.id)}
                  className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:shadow-md transition-all cursor-pointer group"
               >
                  <div className="flex justify-between items-start">
                     <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-edluar-moss transition-colors">{job.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{job.location || 'Remote'} • {job.employment_type || 'Full-time'} • {job.department || 'General'}</p>
                     </div>
                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold capitalize">{job.status}</span>
                  </div>
                  <div className="mt-4 flex gap-4 text-sm text-gray-500">
                     <span><strong>{job.candidate_count || 0}</strong> Candidates</span>
                     <span><strong>{job.interview_count || 0}</strong> Interviews</span>
                     <span><strong>{job.offer_count || 0}</strong> Offers</span>
                     <div className="ml-auto flex gap-3">
                        <button
                           onClick={(e) => {
                              e.stopPropagation();
                              setEditingJobId(job.id);
                           }}
                           className="flex items-center gap-1 text-gray-500 hover:text-edluar-moss transition-colors"
                        >
                           <Pencil className="w-4 h-4" />
                           <span className="text-xs font-medium">Edit</span>
                        </button>
                        <button
                           onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(job.id);
                           }}
                           className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                           <Trash2 className="w-4 h-4" />
                           <span className="text-xs font-medium">Delete</span>
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};


// 3. ATS / PIPELINE (The Candidate Portal) - WITH REAL DATA & DRAG-AND-DROP
const ATSView = ({ openCandidateId, setActiveView, setOpenCandidateId }: { openCandidateId?: number | null, setActiveView: (view: any) => void, setOpenCandidateId: (id: number | null) => void }) => {
   const { user } = useAuth();
   const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
   const [applications, setApplications] = useState<any>({ applied: [], phone_screen: [], interview: [], offer: [], hired: [] });
   const [selectedJobId, setSelectedJobId] = useState<number | null>(null); // Null means "All Jobs"
   const [jobs, setJobs] = useState<any[]>([]);
   const [automationPrompt, setAutomationPrompt] = useState<{ show: boolean; action: string | null; applicationId: number | null }>({ show: false, action: null, applicationId: null });
   const [activeCandidate, setActiveCandidate] = useState<any | null>(null);
   const [ratings, setRatings] = useState<Map<number, { average: number; count: number }>>(new Map());
   const [candidateSearch, setCandidateSearch] = useState('');

   // Auto-open logic
   useEffect(() => {
      if (openCandidateId && Object.values(applications).flat().length > 0) {
         const app = Object.values(applications).flat().find((a: any) => a.candidate_id === openCandidateId);
         if (app) setSelectedApplication(app);
      }
   }, [openCandidateId, applications]);

   // Filter Logic
   const filterApps = (apps: any[]) => {
      if (!candidateSearch) return apps;
      const lowerQ = candidateSearch.toLowerCase();
      return apps.filter(app =>
         (app.first_name + ' ' + app.last_name).toLowerCase().includes(lowerQ) ||
         app.email.toLowerCase().includes(lowerQ)
      );
   };

   // Fetch jobs and applications on mount
   useEffect(() => {
      fetchJobs();
   }, []);

   useEffect(() => {
      fetchApplications();
   }, [selectedJobId]);

   const fetchJobs = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/jobs');
         const data = await response.json();
         setJobs(data);
      } catch (error) {
         console.error("Failed to fetch jobs:", error);
      }
   };

   const fetchApplications = async () => {
      try {
         const url = selectedJobId
            ? `http://localhost:5000/api/applications/job/${selectedJobId}`
            : `http://localhost:5000/api/applications`; // Fetch all if no job selected

         const response = await fetch(url);
         const data = await response.json();
         setApplications(data);

         // Fetch ratings for all applications
         fetchRatingsForApplications(data);
      } catch (error) {
         console.error("Failed to fetch applications:", error);
      }
   };

   const fetchRatingsForApplications = async (apps: any) => {
      const allApps = Object.values(apps).flat() as any[];
      const ratingsMap = new Map<number, { average: number; count: number }>();

      await Promise.all(
         allApps.map(async (app) => {
            try {
               const response = await fetch(`http://localhost:5000/api/applications/${app.id}/reviews/average`);
               const stats = await response.json();
               ratingsMap.set(app.id, stats);
            } catch (error) {
               console.error(`Failed to fetch rating for application ${app.id}:`, error);
            }
         })
      );

      setRatings(ratingsMap);
   };

   const handleQuickAdvance = async (applicationId: number, currentStage: string) => {
      const stages = ['applied', 'phone_screen', 'interview', 'offer', 'hired'];
      const currentIndex = stages.indexOf(currentStage);

      if (currentIndex < stages.length - 1) {
         const nextStage = stages[currentIndex + 1];
         await handleStageUpdate(applicationId, nextStage);
      }
   };

   const handleStageUpdate = async (applicationId: number, newStage: string) => {
      try {
         const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/stage`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newStage })
         });

         const result = await response.json();

         // Show automation prompt if suggested
         if (result.suggestAction) {
            setAutomationPrompt({ show: true, action: result.suggestAction, applicationId });
         }

         // Refresh data
         await fetchApplications();
      } catch (error) {
         console.error("Failed to update stage:", error);
      }
   };

   const columns = [
      { id: 'applied', title: 'New Applied', color: 'bg-blue-500', data: filterApps(applications.applied) },
      { id: 'phone_screen', title: 'Phone Screen', color: 'bg-purple-500', data: filterApps(applications.phone_screen) },
      { id: 'interview', title: 'Interviewing', color: 'bg-yellow-500', data: filterApps(applications.interview) },
      { id: 'offer', title: 'Offer Sent', color: 'bg-green-500', data: filterApps(applications.offer) },
      { id: 'hired', title: 'Hired', color: 'bg-edluar-moss', data: filterApps(applications.hired) },
   ];

   // Helper: Find which stage an application belongs to
   const findStageOfItem = (id: string | number): string | undefined => {
      for (const column of columns) {
         if (column.data.find((app: any) => app.id.toString() === id.toString())) {
            return column.id;
         }
      }
      return undefined;
   };

   // DnD Sensors
   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 8, // 8px of movement required before drag starts
         },
      }),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      })
   );

   const handleDragStart = (event: any) => {
      const candidate = Object.values(applications)
         .flat()
         .find((app: any) => app.id.toString() === event.active.id.toString());
      setActiveCandidate(candidate || null);
   };

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
         setActiveCandidate(null);
         return;
      }

      const activeId = active.id.toString();
      const overId = over.id.toString();
      const activeStage = findStageOfItem(activeId);

      // The drop target ID is either the column's ID or we find it from the card
      const overStage = columns.find(col => col.id === overId)
         ? overId
         : findStageOfItem(overId);

      // Cross-column movement (Stage Transition)
      if (activeStage && overStage && activeStage !== overStage) {
         // Optimistic UI Update
         const updatedApplications = { ...applications };
         const sourceArray = updatedApplications[activeStage as keyof typeof applications];
         const appIndex = sourceArray.findIndex((app: any) => app.id.toString() === activeId);

         if (appIndex !== -1) {
            const [movedApp] = sourceArray.splice(appIndex, 1);
            movedApp.status = overStage;
            updatedApplications[overStage as keyof typeof applications].push(movedApp);
            setApplications(updatedApplications);

            // API Call
            handleStageUpdate(parseInt(activeId), overStage);
         }
      }

      setActiveCandidate(null);
   };

   return (
      <DndContext
         sensors={sensors}
         collisionDetection={closestCenter}
         onDragStart={handleDragStart}
         onDragEnd={handleDragEnd}
      >
         <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0B100D] animate-fade-in relative">
            <div className="h-16 bg-white dark:bg-edluar-deep border-b border-gray-200 dark:border-white/5 px-6 flex items-center justify-between flex-shrink-0">
               <div className="flex items-center gap-2 relative group">
                  <select
                     value={selectedJobId || ""}
                     onChange={(e) => setSelectedJobId(e.target.value ? Number(e.target.value) : null)}
                     className="text-xl font-bold text-gray-900 dark:text-white bg-transparent outline-none cursor-pointer appearance-none pr-8 z-10 relative"
                  >
                     <option value="" className="text-gray-900">All Jobs</option>
                     {jobs.map(job => (
                        <option key={job.id} value={job.id} className="text-gray-900">{job.title}</option>
                     ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-900 dark:text-white absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg mr-2">
                     <Search className="w-4 h-4 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Filter candidates..."
                        value={candidateSearch}
                        onChange={(e) => setCandidateSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-48 text-gray-900 dark:text-white placeholder-gray-400"
                     />
                  </div>
                  <Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Candidate</Button>
               </div>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
               <div className="flex h-full gap-6 min-w-max">
                  {columns.map(col => (
                     <DroppableColumn key={col.id} id={col.id} title={col.title} color={col.color} count={col.data.length}>
                        <SortableContext items={col.data.map((app: any) => app.id.toString())} strategy={verticalListSortingStrategy}>
                           {col.data.map((app: any) => (
                              <DraggableCandidate
                                 key={app.id}
                                 id={app.id}
                                 application={app}
                                 onClick={() => setSelectedApplication(app)}
                                 rating={ratings.get(app.id)}
                                 onQuickAdvance={col.id !== 'hired' ? () => handleQuickAdvance(app.id, col.id) : undefined}
                              />
                           ))}
                        </SortableContext>
                     </DroppableColumn>
                  ))}
               </div>
            </div>

            {/* DragOverlay for visual feedback */}
            <DragOverlay>
               {activeCandidate ? (
                  <div className="bg-white dark:bg-edluar-surface p-4 rounded-xl shadow-2xl border-2 border-edluar-moss opacity-90 rotate-3">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                           {activeCandidate.first_name?.[0]}{activeCandidate.last_name?.[0]}
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                           {activeCandidate.first_name} {activeCandidate.last_name}
                        </h4>
                     </div>
                  </div>
               ) : null}
            </DragOverlay>

            {/* Automation Prompt Modal */}
            {automationPrompt.show && (
               <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white dark:bg-edluar-surface p-6 rounded-xl shadow-2xl max-w-md">
                     <h3 className="text-lg font-bold mb-2">Next Step?</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {automationPrompt.action === 'OPEN_INBOX' && 'Candidate moved to Phone Screen. Would you like to send them a message?'}
                        {automationPrompt.action === 'OPEN_SCHEDULER_MODAL' && 'Candidate moved to Interview. Would you like to schedule an interview?'}
                        {automationPrompt.action === 'JOB_CLOSED' && 'Headcount reached! This job has been automatically closed.'}
                     </p>
                     <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => setAutomationPrompt({ show: false, action: null, applicationId: null })}>Later</Button>
                        <Button variant="primary" size="sm" onClick={() => {
                           const { action, applicationId } = automationPrompt;
                           setAutomationPrompt({ show: false, action: null, applicationId: null });

                           if (action === 'OPEN_INBOX' && applicationId) {
                              setActiveView('inbox');
                              setOpenCandidateId(applicationId);
                           } else if (action === 'OPEN_SCHEDULER_MODAL') {
                              setActiveView('calendar');
                           }
                        }}>
                           {automationPrompt.action === 'JOB_CLOSED' ? 'Got it' : 'Yes'}
                        </Button>
                     </div>
                  </div>
               </div>
            )}

            {/* Enhanced Candidate Profile Modal */}
            {selectedApplication && (
               <CandidateProfileModal
                  application={selectedApplication}
                  onClose={() => setSelectedApplication(null)}
                  currentUserId={user?.id || 1}
               />
            )}
         </div>
      </DndContext>
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
const CareerSiteView = ({ initialData, pendingJobData, onPublish }: { initialData?: any; pendingJobData?: any; onPublish?: () => void }) => {
   const [isPublishing, setIsPublishing] = useState(false);

   const handlePublish = async () => {
      if (!pendingJobData || !onPublish) return;

      setIsPublishing(true);
      try {
         const response = await fetch('http://localhost:5000/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingJobData)
         });

         if (response.ok) {
            onPublish();
         } else {
            console.error("Failed to publish job");
         }
      } catch (error) {
         console.error("Error publishing job:", error);
      } finally {
         setIsPublishing(false);
      }
   };
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
            <div className="p-4 border-t border-gray-200 dark:border-white/5">
               <Button className="w-full justify-center" onClick={handlePublish} disabled={isPublishing}>
                  {isPublishing ? 'Publishing...' : 'Publish'}
               </Button>
            </div>
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

// 4. INBOX VIEW - WITH REAL ACTIVITIES DATA
const InboxView = ({ openCandidateId }: { openCandidateId?: number | null }) => {
   const [applications, setApplications] = useState<any[]>([]);
   const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
   const [activities, setActivities] = useState<any[]>([]);
   const [inputMode, setInputMode] = useState<'email' | 'note'>('email');
   const [newMessage, setNewMessage] = useState("");
   const [loading, setLoading] = useState(true);
   const [isDrafting, setIsDrafting] = useState(false);
   const [isScheduleOpen, setIsScheduleOpen] = useState(false);
   const [scheduledDate, setScheduledDate] = useState("");
   const { user } = useAuth();

   // Fetch all applications and their activities
   useEffect(() => {
      fetchApplicationsWithActivities();
   }, []);

   const fetchApplicationsWithActivities = async () => {
      try {
         setLoading(true);
         // Fetch applications from all jobs (Global Inbox)
         const response = await fetch('http://localhost:5000/api/applications');
         const data = await response.json();

         // Flatten all applications from all stages
         const allApps = Object.values(data).flat();
         setApplications(allApps);

         // Select application logic
         if (openCandidateId) {
            const target = allApps.find((a: any) => a.candidate_id === openCandidateId);
            if (target) {
               await selectApplication(target);
            } else if (allApps.length > 0) {
               await selectApplication(allApps[0]);
            }
         } else if (allApps.length > 0) {
            await selectApplication(allApps[0]);
         }

         setLoading(false);
      } catch (error) {
         console.error("Failed to fetch applications:", error);
         setLoading(false);
      }
   };

   const selectApplication = async (app: any) => {
      setSelectedApplication(app);

      // Fetch activities for this application (communications only)
      try {
         const response = await fetch(`http://localhost:5000/api/applications/${app.id}/activities?communications=true`);
         const data = await response.json();
         setActivities(data);
      } catch (error) {
         console.error("Failed to fetch activities:", error);
      }
   };

   const handleMagicDraft = async (intent: 'invite' | 'reject') => {
      if (!selectedApplication) return;
      setIsDrafting(true);

      const draft = await generateEmailDraft(
         intent,
         `${selectedApplication.first_name}`,
         'this position',
         user?.name || 'Hiring Team'
      );

      setNewMessage(draft);
      setIsDrafting(false);
   };

   const handleSend = async () => {
      if (!newMessage.trim() || !selectedApplication) return;

      try {
         // Create new activity
         const response = await fetch(`http://localhost:5000/api/applications/${selectedApplication.id}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               type: inputMode,
               content: newMessage,
               scheduledAt: scheduledDate || null
            })
         });

         if (response.ok) {
            // Refresh activities
            await selectApplication(selectedApplication);
            setNewMessage("");
            setScheduledDate("");
            setIsScheduleOpen(false);
         }
      } catch (error) {
         console.error("Failed to send message:", error);
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-full">
            <div className="text-center">
               <div className="animate-spin w-8 h-8 border-4 border-edluar-moss border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="text-gray-500">Loading inbox...</p>
            </div>
         </div>
      );
   }

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
               {applications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                     <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                     <p className="text-sm">No conversations yet</p>
                  </div>
               ) : (
                  applications.map((app: any) => (
                     <div
                        key={app.id}
                        onClick={() => selectApplication(app)}
                        className={`p-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all ${selectedApplication?.id === app.id ? 'bg-blue-50 dark:bg-white/10 border-l-4 border-l-edluar-moss' : 'border-l-4 border-l-transparent'}`}
                     >
                        <div className="flex justify-between items-start mb-1">
                           <div className="flex items-center gap-2">
                              <div className="relative">
                                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                                    {app.first_name?.[0]}{app.last_name?.[0]}
                                 </div>
                              </div>
                              <div>
                                 <h3 className="font-bold text-sm text-gray-900 dark:text-white">{app.first_name} {app.last_name}</h3>
                                 <p className="text-xs text-gray-500">{app.status.replace('_', ' ')}</p>
                              </div>
                           </div>
                        </div>
                        <p className="text-xs text-gray-500 ml-12 mt-1 line-clamp-1">
                           {app.email}
                        </p>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* 2. CENTER: Conversation Thread */}
         <div className="flex-1 flex flex-col bg-gray-50 dark:bg-edluar-deep/50">
            {selectedApplication ? (
               <>
                  {/* Header */}
                  <div className="h-16 bg-white dark:bg-edluar-surface border-b border-gray-200 dark:border-white/10 px-6 flex items-center justify-between flex-shrink-0">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                           {selectedApplication.first_name?.[0]}{selectedApplication.last_name?.[0]}
                        </div>
                        <div>
                           <h2 className="font-bold text-gray-900 dark:text-white">{selectedApplication.first_name} {selectedApplication.last_name}</h2>
                           <p className="text-xs text-gray-500">{selectedApplication.status.replace('_', ' ')}</p>
                        </div>
                     </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                     {activities.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20">
                           <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                           <p>No messages yet. Start the conversation!</p>
                        </div>
                     ) : (
                        activities.map((activity: any) => {
                           const isRecruiter = activity.type === 'note' || activity.type === 'email';
                           const isNote = activity.type === 'note';

                           return (
                              <div key={activity.id} className={`flex ${isRecruiter ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-md rounded-2xl p-4 shadow-sm
                                    ${isNote
                                       ? 'bg-yellow-50 border border-yellow-200 text-gray-800 dark:bg-yellow-900/20 dark:border-yellow-700/30 dark:text-yellow-100' // 🟡 Note Style
                                       : isRecruiter
                                          ? 'bg-edluar-moss text-white' // 🟢 Recruiter Email Style
                                          : 'bg-white dark:bg-edluar-surface border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white' // ⚪ Candidate Email Style
                                    }`}
                                 >
                                    {isNote && (
                                       <div className="flex items-center gap-2 mb-2 text-xs font-bold opacity-70 uppercase tracking-wider">
                                          <FileText className="w-3 h-3" />
                                          <span>Internal Note</span>
                                       </div>
                                    )}
                                    <div
                                       className="text-sm prose prose-sm dark:prose-invert max-w-none"
                                       dangerouslySetInnerHTML={{ __html: activity.content }}
                                    />
                                    <span className={`text-xs mt-2 block ${isRecruiter && !isNote ? 'text-white/70' : 'text-gray-400'}`}>
                                       {new Date(activity.created_at).toLocaleString()}
                                    </span>
                                 </div>
                              </div>
                           );
                        })
                     )}
                  </div>

                  {/* Input Area */}
                  <div className="bg-white dark:bg-edluar-surface border-t border-gray-200 dark:border-white/10 p-4">
                     {/* Mode Toggle */}
                     <div className="flex items-center gap-2 mb-3">
                        <button
                           onClick={() => setInputMode('email')}
                           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${inputMode === 'email' ? 'bg-edluar-moss text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                        >
                           <Mail className="w-3 h-3 inline mr-1" />
                           Email
                        </button>
                        <button
                           onClick={() => setInputMode('note')}
                           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${inputMode === 'note' ? 'bg-edluar-moss text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                        >
                           <FileText className="w-3 h-3 inline mr-1" />
                           Internal Note
                        </button>
                     </div>

                     <div className="flex gap-2 mb-2">
                        <button
                           onClick={() => handleMagicDraft('invite')}
                           disabled={isDrafting}
                           className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-100 transition-colors"
                        >
                           <Wand2 className="w-3 h-3" /> Draft Invite
                        </button>
                        <button
                           onClick={() => handleMagicDraft('reject')}
                           disabled={isDrafting}
                           className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-red-100 transition-colors"
                        >
                           <Wand2 className="w-3 h-3" /> Draft Rejection
                        </button>
                     </div>

                     <div className="flex flex-col gap-2">
                        <RichTextEditor
                           value={newMessage}
                           onChange={setNewMessage}
                           placeholder={inputMode === 'email' ? "Type your email..." : "Add an internal note..."}
                        />
                        <div className="flex justify-between items-center mt-2">
                           {/* Schedule Indicator */}
                           {scheduledDate && (
                              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center gap-1">
                                 <Clock className="w-3 h-3" />
                                 Will send: {new Date(scheduledDate).toLocaleString()}
                                 <button onClick={() => setScheduledDate("")} className="ml-2 hover:text-red-500">×</button>
                              </div>
                           )}

                           <div className="flex gap-2 ml-auto relative">
                              {/* Toggle Picker */}
                              <button
                                 onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                                 className={`p-2 rounded-lg transition-colors ${scheduledDate ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-gray-100 text-gray-500'}`}
                                 title="Schedule Send"
                              >
                                 <Clock className="w-5 h-5" />
                              </button>

                              {/* The Pop-up Picker */}
                              {isScheduleOpen && (
                                 <div className="absolute bottom-full right-0 mb-2 bg-white p-4 rounded-xl shadow-xl border border-gray-200 w-64 z-50 animate-scale-in">
                                    <h4 className="text-sm font-bold mb-3">Schedule for later</h4>
                                    <input
                                       type="datetime-local"
                                       className="w-full border p-2 rounded text-sm mb-3"
                                       onChange={(e) => setScheduledDate(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                       <button
                                          className="px-3 py-1 bg-edluar-moss text-white rounded text-sm"
                                          onClick={() => setIsScheduleOpen(false)}
                                       >
                                          Set Time
                                       </button>
                                    </div>
                                 </div>
                              )}

                              <button
                                 onClick={handleSend}
                                 className="px-6 py-2 bg-edluar-moss hover:bg-edluar-moss/90 text-white rounded-lg font-bold transition-all flex items-center gap-2"
                              >
                                 <Send className="w-4 h-4" />
                                 {scheduledDate ? 'Schedule' : 'Send'}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            ) : (
               <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                     <MessageSquare className="w-20 h-20 mx-auto mb-4 opacity-20" />
                     <p>Select a conversation to start messaging</p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

// 5. SCHEDULE VIEW - WITH REAL SCHEDULED ACTIVITIES


// 6. REPORTS VIEW - REPLACED BY ReportsPage.tsx
import { ReportsPage } from '../src/pages/ReportsPage';

// --- MAIN CONTROLLER ---
interface DashboardPageProps {
   onNavigate: (page: string, params?: any) => void;
   toggleTheme: () => void;
   isDarkMode: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, toggleTheme, isDarkMode }) => {
   const { user, logout } = useAuth();
   const [activeView, setActiveView] = useState<'overview' | 'jobs' | 'candidates' | 'career_site' | 'inbox' | 'calendar' | 'reports' | 'settings' | 'todos'>('overview');
   const [isJobModalOpen, setIsJobModalOpen] = useState(false);
   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
   const [pendingJobData, setPendingJobData] = useState<any>(null);

   // TODOS STATE (Lifted)
   const [todos, setTodos] = useState<any[]>([]);
   const fetchTodos = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/todos?status=pending');
         const data = await response.json();
         setTodos(data.todos || []);
      } catch (error) {
         console.error('Failed to fetch todos:', error);
      }
   };
   useEffect(() => { fetchTodos(); }, []);

   // --- GLOBAL SEARCH STATE ---
   const [globalQuery, setGlobalQuery] = useState('');
   const [globalResults, setGlobalResults] = useState<any[]>([]);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const [openCandidateId, setOpenCandidateId] = useState<number | null>(null);

   useEffect(() => {
      const timer = setTimeout(async () => {
         if (globalQuery.length < 2) return setGlobalResults([]);
         try {
            const res = await fetch(`http://localhost:5000/api/search?q=${globalQuery}`);
            if (res.ok) setGlobalResults(await res.json());
         } catch (e) { console.error("Search failed", e); }
      }, 300);
      return () => clearTimeout(timer);
   }, [globalQuery]);

   // NOTIFICATIONS STATE
   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
   const [notifications, setNotifications] = useState<any[]>([]);
   const [unreadCount, setUnreadCount] = useState(0);

   // Fetch notifications on mount
   useEffect(() => {
      fetchNotifications();
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
   }, []);

   const fetchNotifications = async () => {
      try {
         // Assuming user ID 1 for now or getting it from user object if available
         const userId = (user as any)?.id || 1;
         const response = await fetch(`http://localhost:5000/api/notifications?userId=${userId}`);
         if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
         }
      } catch (error) {
         console.error("Failed to fetch notifications:", error);
      }
   };

   const handleNotificationClick = async (notification: any) => {
      if (!notification.is_read) {
         try {
            await fetch(`http://localhost:5000/api/notifications/${notification.id}/read`, { method: 'PATCH' });
            // Update local state
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
         } catch (error) {
            console.error("Failed to mark notification as read:", error);
         }
      }

      // Navigate based on type
      if (notification.type === 'new_candidate') {
         // If we have resource_id as application_id, we might want to go to candidates view
         // For now, let's go to the candidates tab
         setActiveView('candidates');
         setIsNotificationsOpen(false);
      }
   };

   const handleLogout = () => { logout(); onNavigate('home'); };

   const handleCreateJob = (newJob: any) => {
      console.log("Created Job:", newJob);
      setIsJobModalOpen(false);
      // Navigate to editor with the new job ID
      onNavigate('job-editor', { jobId: newJob.id, tab: 'design' });
   };

   const handleEditJob = (jobId: number) => {
      onNavigate('job-editor', { jobId });
   };

   const handleJobPublished = () => {
      setPendingJobData(null);
      setActiveView('jobs');
   };

   const getInitials = (name: string) => name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
   const displayName = user?.name || 'Guest User';
   const initials = user?.name ? getInitials(user.name) : 'GU';

   const NavItem = ({ id, icon: Icon, label, count, onClick }: any) => (
      <button
         onClick={onClick || (() => setActiveView(id))}
         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${activeView === id
            ? 'bg-[#EBF3ED] text-edluar-moss'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
      >
         <Icon className={`w-5 h-5 ${activeView === id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
         <span className="flex-1 text-left">{label}</span>
         {count && <span className={`text-xs px-2 py-0.5 rounded-full ${activeView === id ? 'bg-edluar-moss text-white' : 'bg-gray-200 dark:bg-white/20 text-gray-700 dark:text-gray-200'}`}>{count}</span>}
         {activeView === id && (
            <div className="w-2 h-2 rounded-full bg-edluar-moss absolute right-4" />
         )}
      </button>
   );

   return (
      <div className="flex h-screen bg-edluar-cream dark:bg-edluar-deep transition-colors duration-300 overflow-hidden">
         <aside className="w-64 bg-white dark:bg-black/20 border-r border-edluar-pale/50 dark:border-white/5 flex flex-col z-20">
            <div className="p-8 flex flex-col items-center relative">
               <div
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
               >
                  <div className="relative">
                     <div className="w-20 h-20 rounded-full p-1 border border-edluar-pale dark:border-white/10">
                        <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                           {(user as any)?.avatar ? (
                              <img src={`http://localhost:5000${(user as any).avatar}`} alt="Profile" className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center bg-edluar-moss text-white text-2xl font-serif font-bold">
                                 {initials}
                              </div>
                           )}
                        </div>
                     </div>
                     <div className="absolute bottom-1 right-1 w-5 h-5 bg-edluar-moss rounded-full border-2 border-white dark:border-edluar-deep"></div>
                  </div>

                  <div className="text-center">
                     <h3 className="font-bold text-lg text-edluar-dark dark:text-white">{displayName}</h3>
                     <p className="text-[10px] font-bold text-edluar-dark/40 dark:text-white/40 uppercase tracking-widest mt-1">Workspace Admin</p>
                  </div>
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
                              onClick={() => { setIsProfileMenuOpen(false); onNavigate('settings', { tab: 'profile' }); }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-edluar-dark/70 dark:text-white/70 hover:bg-edluar-pale/30 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                           >
                              <User className="w-4 h-4" /> My Profile
                           </button>
                           <button
                              onClick={() => { setIsProfileMenuOpen(false); onNavigate('settings', { tab: 'account' }); }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-edluar-dark/70 dark:text-white/70 hover:bg-edluar-pale/30 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                           >
                              <Settings className="w-4 h-4" /> Account Settings
                           </button>
                        </div>
                        <div className="h-px bg-edluar-pale/50 dark:bg-white/5 mx-2"></div>
                        <div className="p-2">
                           <button
                              onClick={() => { setIsProfileMenuOpen(false); onNavigate('settings', { tab: 'workspace' }); }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-edluar-moss hover:bg-edluar-moss/10 rounded-lg transition-colors text-left"
                           >
                              <ShieldCheck className="w-4 h-4" /> Workspace Admin
                           </button>
                        </div>
                        <div className="h-px bg-edluar-pale/50 dark:bg-white/5 mx-2"></div>
                        <div className="p-2">
                           <button
                              onClick={() => { setIsProfileMenuOpen(false); onNavigate('settings', { tab: 'support' }); }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-edluar-dark/70 dark:text-white/70 hover:bg-edluar-pale/30 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                           >
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
               <NavItem id="overview" icon={LayoutDashboard} label="Dashboard" />
               <NavItem
                  id="todos"
                  icon={CheckCircle2}
                  label="To-Dos"
                  count={todos.length}
               />
               <NavItem id="jobs" icon={Briefcase} label="Jobs & Pipeline" />
               <NavItem id="candidates" icon={Users} label="Candidates" />
               <NavItem id="inbox" icon={MessageSquare} label="Inbox" />
               <NavItem id="calendar" icon={Calendar} label="Schedule" />
               <NavItem id="reports" icon={Archive} label="Archives" />
            </div>
            <div className="p-4 border-t border-edluar-pale/50 dark:border-white/5 space-y-2">
               <div className="p-6 border-t border-edluar-pale/50 dark:border-white/5">
                  <div className="flex items-center justify-between px-2">
                     <div className="flex items-center gap-2 text-sm font-medium text-edluar-dark/60 dark:text-edluar-cream/60">
                        <Moon size={18} />
                        <span>Dark Mode</span>
                     </div>
                     <button
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${isDarkMode ? 'bg-edluar-moss' : 'bg-gray-300'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${isDarkMode ? 'left-7' : 'left-1'}`} />
                     </button>
                  </div>
               </div>
            </div>
         </aside>

         <main className="flex-1 relative flex flex-col min-w-0">
            <div className="h-16 border-b border-edluar-pale/50 dark:border-white/5 flex items-center justify-between px-8 bg-edluar-cream/80 dark:bg-edluar-deep/80 backdrop-blur-md z-10">
               <h2 className="text-lg font-bold text-edluar-dark dark:text-edluar-cream capitalize">
                  {activeView === 'jobs' ? 'Applicant Tracking' : activeView === 'career_site' ? 'Career Site OS' : activeView}
               </h2>
               <div className="flex items-center gap-4">
                  {/* GLOBAL SEARCH UI */}
                  <div className="relative z-50">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-edluar-dark/40" />
                     <input
                        type="text"
                        placeholder="Search jobs or candidates..."
                        className="pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-edluar-pale dark:border-white/10 rounded-full text-sm focus:ring-2 focus:ring-edluar-moss/50 w-64 transition-all"
                        value={globalQuery}
                        onChange={(e) => setGlobalQuery(e.target.value)}
                        onFocus={() => setIsSearchOpen(true)}
                        onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                     />

                     {/* DROPDOWN RESULTS */}
                     {isSearchOpen && globalResults.length > 0 && (
                        <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-edluar-surface rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                           <div className="p-2">
                              {globalResults.map((result, idx) => (
                                 <button
                                    key={`${result.type}-${result.id}`}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-4 rounded-lg group"
                                    onClick={() => {
                                       if (result.type === 'job') {
                                          onNavigate('job-editor', { jobId: result.id });
                                       } else {
                                          setActiveView('candidates');
                                          setOpenCandidateId(result.id);
                                       }
                                       setIsSearchOpen(false);
                                       setGlobalQuery('');
                                    }}
                                 >
                                    <div className={`p-2 rounded-lg shrink-0 ${result.type === 'job' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                       {result.type === 'job' ? <Briefcase className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="font-bold text-gray-900 dark:text-white truncate">
                                          {result.type === 'job' ? result.title : result.name}
                                       </p>
                                       <p className="text-xs text-gray-500 truncate">
                                          {result.type === 'job' ? result.department : result.email}
                                       </p>
                                    </div>
                                    <div className="text-xs text-gray-400 group-hover:text-edluar-moss">Go</div>
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* NOTIFICATIONS */}
                  <div className="relative">
                     <button
                        className="relative p-2 text-edluar-dark/60 hover:text-edluar-moss transition-colors"
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                     >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-edluar-cream animate-pulse"></span>
                        )}
                     </button>

                     {isNotificationsOpen && (
                        <>
                           <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                           <div className="absolute top-full right-0 w-80 bg-white dark:bg-edluar-surface border border-edluar-pale dark:border-white/10 rounded-xl shadow-xl z-50 mt-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="p-4 border-b border-edluar-pale/50 dark:border-white/5 flex justify-between items-center bg-edluar-cream/30 dark:bg-white/5">
                                 <h3 className="font-bold text-edluar-dark dark:text-white text-sm">Notifications</h3>
                                 {unreadCount > 0 && <span className="text-xs text-edluar-moss font-medium">{unreadCount} new</span>}
                              </div>
                              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                 {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">
                                       No notifications yet
                                    </div>
                                 ) : (
                                    notifications.map((notif: any) => (
                                       <div
                                          key={notif.id}
                                          className={`p-4 border-b border-edluar-pale/30 dark:border-white/5 hover:bg-edluar-pale/20 dark:hover:bg-white/5 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                          onClick={() => handleNotificationClick(notif)}
                                       >
                                          <div className="flex gap-3">
                                             <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                             <div>
                                                <p className={`text-sm ${!notif.is_read ? 'font-semibold text-edluar-dark dark:text-white' : 'text-edluar-dark/70 dark:text-white/70'}`}>
                                                   {notif.content}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
                                             </div>
                                          </div>
                                       </div>
                                    ))
                                 )}
                              </div>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-auto">
               {activeView === 'overview' && (
                  <OverviewView
                     user={user}
                     onOpenCreate={() => setIsJobModalOpen(true)}
                     notifications={notifications}
                     onNavigateToInbox={(candidateId) => {
                        setActiveView('inbox');
                        setOpenCandidateId(candidateId);
                     }}
                     onNavigateToSchedule={() => setActiveView('calendar')}
                  />
               )}
               {activeView === 'jobs' && <JobsListView onOpenCreate={() => setIsJobModalOpen(true)} onEdit={handleEditJob} onNavigate={onNavigate} />}
               {activeView === 'candidates' && <ATSView openCandidateId={openCandidateId} setActiveView={setActiveView} setOpenCandidateId={setOpenCandidateId} />}
               {activeView === 'career_site' && <CareerSiteView pendingJobData={pendingJobData} onPublish={handleJobPublished} />}
               {activeView === 'calendar' && <ScheduleView />}
               {activeView === 'reports' && <ReportsPage />}
               {activeView === 'inbox' && <InboxView openCandidateId={openCandidateId} />}
               {activeView === 'todos' && <TodosView todos={todos} onRefresh={fetchTodos} />}
               {activeView !== 'overview' && activeView !== 'jobs' && activeView !== 'candidates' && activeView !== 'career_site' && activeView !== 'calendar' && activeView !== 'reports' && activeView !== 'inbox' && activeView !== 'settings' && activeView !== 'todos' && (
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