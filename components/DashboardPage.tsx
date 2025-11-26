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
   MapPin,
   Settings,
   LogOut,
   User as UserIcon
} from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

interface DashboardPageProps {
   onNavigate: (page: string, params?: any) => void;
   toggleTheme: () => void;
   isDarkMode: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, toggleTheme, isDarkMode }) => {
   const { user, logout } = useAuth();
   const [isProfileOpen, setIsProfileOpen] = useState(false);

   const handleLogout = () => {
      logout();
      onNavigate('home');
   };

   const getInitials = (name: string) => {
      return name
         .split(' ')
         .map(part => part[0])
         .join('')
         .toUpperCase()
         .slice(0, 2);
   };

   const displayName = user?.name || 'Guest User';
   const firstName = displayName.split(' ')[0];
   const initials = user?.name ? getInitials(user.name) : 'GU';

   const templates = [
      { title: "No template", image: null, color: "bg-edluar-cream" },
      { title: "Future Forward", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80", color: "bg-emerald-900" },
      { title: "Niche Ceremony", image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=300&q=80", color: "bg-purple-200" },
      { title: "Dark Matters", image: "https://images.unsplash.com/photo-1492551557933-34265f7af79e?auto=format&fit=crop&w=300&q=80", color: "bg-black" },
      { title: "Calm Access", image: "https://images.unsplash.com/photo-1516383748727-85dd12b4b217?auto=format&fit=crop&w=300&q=80", color: "bg-amber-800" },
   ];

   const events = [
      {
         title: "Portfolio review (Sarah/Edluar)",
         time: "Today, 09:30",
         type: "video",
         attendees: [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
         ]
      },
      {
         title: "Screening call",
         time: "Wed Jan 23, 13:00",
         type: "video",
         attendees: [
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
         ]
      },
      {
         title: "Meet the team (Product Team)",
         time: "Wed Jan 24, 14:30",
         type: "location",
         attendees: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
         ]
      }
   ];

   const todos = [
      { title: "Review portfolio", tag: "Tue Jan 7", tagColor: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300", assignee: "Sanna Asselbergs" },
      { title: "Provide feedback", tag: "Today", tagColor: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300", assignee: "Juliette Nicholas" },
      { title: "Answer email", assignee: "Tom Valies" },
      { title: "Prepare second interview", assignee: "Irving Monzano" },
      { title: "Send email", assignee: "Mika Middelberg" }
   ];

   return (
      <div className="flex h-screen bg-edluar-cream dark:bg-edluar-deep overflow-hidden transition-colors duration-300">

         {/* Sidebar */}
         <aside className="w-64 bg-white dark:bg-edluar-surface border-r border-edluar-pale dark:border-edluar-moss/20 flex flex-col justify-between transition-colors duration-300 z-20">
            <div>
               {/* Logo Area */}
               <div className="h-20 flex items-center px-6 border-b border-edluar-pale/30 dark:border-edluar-moss/10">
                  <button onClick={() => onNavigate('home')} className="flex items-center space-x-2 group">
                     <div className="bg-edluar-moss p-1.5 rounded-lg group-hover:bg-edluar-dark transition-colors">
                        <Leaf className="w-5 h-5 text-edluar-cream" />
                     </div>
                     <span className="text-xl font-serif font-bold text-edluar-dark dark:text-edluar-cream">Edluar</span>
                  </button>
               </div>

               {/* Main Nav */}
               <nav className="p-4 space-y-1">
                  <button className="w-full flex items-center space-x-3 px-3 py-2.5 bg-edluar-cream dark:bg-edluar-moss/20 text-edluar-moss dark:text-edluar-pale font-medium rounded-xl">
                     <LayoutGrid className="w-5 h-5" />
                     <span>Home</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-edluar-dark/70 dark:text-edluar-cream/70 hover:bg-edluar-cream/50 dark:hover:bg-edluar-moss/10 hover:text-edluar-dark dark:hover:text-edluar-cream font-medium rounded-xl transition-colors">
                     <Search className="w-5 h-5" />
                     <span>Search</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-edluar-dark/70 dark:text-edluar-cream/70 hover:bg-edluar-cream/50 dark:hover:bg-edluar-moss/10 hover:text-edluar-dark dark:hover:text-edluar-cream font-medium rounded-xl transition-colors justify-between group">
                     <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5" />
                        <span>Notifications</span>
                     </div>
                     <span className="bg-edluar-moss text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-edluar-dark/70 dark:text-edluar-cream/70 hover:bg-edluar-cream/50 dark:hover:bg-edluar-moss/10 hover:text-edluar-dark dark:hover:text-edluar-cream font-medium rounded-xl transition-colors">
                     <Plus className="w-5 h-5" />
                     <span>Create job</span>
                  </button>
               </nav>

               {/* Jobs List Section */}
               <div className="px-6 py-4">
                  <div className="flex items-center justify-between text-xs font-bold text-edluar-dark/40 dark:text-edluar-cream/40 uppercase tracking-wider mb-3">
                     <span>Your Jobs</span>
                     <ChevronRight className="w-3 h-3" />
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center space-x-3 text-sm text-edluar-dark dark:text-edluar-cream font-medium cursor-pointer hover:text-edluar-moss transition-colors">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="truncate">Open application</span>
                     </div>
                     <div className="flex items-center space-x-3 text-sm text-edluar-dark dark:text-edluar-cream font-medium cursor-pointer hover:text-edluar-moss transition-colors">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="truncate">Product Manager</span>
                     </div>
                     <div className="flex items-center space-x-3 text-sm text-edluar-dark dark:text-edluar-cream font-medium cursor-pointer hover:text-edluar-moss transition-colors">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="truncate">Senior Designer</span>
                     </div>
                     <div className="flex items-center space-x-3 text-sm text-edluar-dark/60 dark:text-edluar-cream/60 cursor-pointer hover:text-edluar-dark dark:hover:text-edluar-cream transition-colors">
                        <div className="w-2 h-2 rounded-full border border-dashed border-edluar-dark/40"></div>
                        <span className="truncate">Full Stack Engineer</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-edluar-pale/30 dark:border-edluar-moss/10 space-y-1">
               <button
                  onClick={toggleTheme}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-edluar-dark/70 dark:text-edluar-cream/70 hover:bg-edluar-cream/50 dark:hover:bg-edluar-moss/10 rounded-xl transition-colors"
               >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
               </button>
               <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-edluar-dark/70 dark:text-edluar-cream/70 hover:bg-edluar-cream/50 dark:hover:bg-edluar-moss/10 rounded-xl transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
               </button>
               <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600/70 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-colors"
               >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
               </button>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Top Header */}
            <header className="h-20 flex items-center justify-between px-8 bg-edluar-cream dark:bg-edluar-deep sticky top-0 z-10">
               <h2 className="text-sm font-medium text-edluar-dark/50 dark:text-edluar-cream/50">Home</h2>
               <div className="flex items-center space-x-4">
                  <div className="relative">
                     <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors"
                     >
                        <span className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">{displayName}</span>
                        <div className="w-8 h-8 rounded-full bg-edluar-moss text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-edluar-deep">
                           {initials}
                        </div>
                     </button>

                     {/* Profile Dropdown */}
                     {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-edluar-surface rounded-xl shadow-lg border border-edluar-pale/50 dark:border-edluar-moss/20 py-1 z-50 animate-fade-in-up">
                           <div className="px-4 py-3 border-b border-edluar-pale/30 dark:border-edluar-moss/10">
                              <p className="text-sm font-bold text-edluar-dark dark:text-edluar-cream">{displayName}</p>
                              <p className="text-xs text-edluar-dark/50 dark:text-edluar-cream/50 truncate">{user?.email}</p>
                           </div>
                           <button className="w-full text-left px-4 py-2 text-sm text-edluar-dark/70 dark:text-edluar-cream/70 hover:bg-edluar-cream/50 dark:hover:bg-edluar-moss/10 flex items-center">
                              <UserIcon className="w-4 h-4 mr-2" /> Profile
                           </button>
                           <button className="w-full text-left px-4 py-2 text-sm text-edluar-dark/70 dark:text-edluar-cream/70 hover:bg-edluar-cream/50 dark:hover:bg-edluar-moss/10 flex items-center">
                              <Settings className="w-4 h-4 mr-2" /> Settings
                           </button>
                           <div className="border-t border-edluar-pale/30 dark:border-edluar-moss/10 my-1"></div>
                           <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                           >
                              <LogOut className="w-4 h-4 mr-2" /> Log out
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </header>

            <div className="px-8 pb-12 space-y-10">

               {/* Greeting */}
               <div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-6">
                     Hi, {firstName}
                  </h1>
               </div>

               {/* Hero Card */}
               <div className="w-full bg-[#2c2826] dark:bg-black rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between shadow-xl shadow-black/5 relative overflow-hidden group">
                  {/* Abstract blobs */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                  <div className="relative z-10 space-y-4 md:space-y-0">
                     <div className="flex items-start space-x-4">
                        <div className="bg-yellow-500/20 p-3 rounded-2xl">
                           <span className="text-3xl">👋</span>
                        </div>
                        <div>
                           <h3 className="text-xl font-bold font-serif mb-1">Portfolio review (Sarah/Homerun)</h3>
                           <div className="flex items-center space-x-4 text-white/60 text-sm">
                              <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> 9:30 - 10:30</div>
                              <div className="flex items-center"><Video className="w-4 h-4 mr-1.5" /> Google Meet</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10 mt-6 md:mt-0">
                     <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-indigo-900/20">
                        <Video className="w-4 h-4 mr-2" />
                        Join Meeting
                     </Button>
                  </div>
               </div>

               {/* Job Templates Carousel */}
               <div>
                  <div className="flex justify-between items-end mb-4">
                     <h3 className="text-xl text-edluar-dark dark:text-edluar-cream font-medium">Create a new job</h3>
                     <button className="text-sm text-edluar-dark/40 dark:text-edluar-cream/40 hover:text-edluar-moss">View all templates</button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                     <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-edluar-pale dark:border-edluar-moss/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-edluar-surface transition-colors group">
                        <Plus className="w-8 h-8 text-edluar-dark/30 dark:text-edluar-cream/30 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-edluar-dark/60 dark:text-edluar-cream/60">No template</span>
                     </div>

                     {templates.slice(1).map((template, idx) => (
                        <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-md transition-all">
                           <img src={template.image || ''} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                           <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm p-2 rounded-lg text-center">
                              <span className="text-xs font-bold text-edluar-dark dark:text-white uppercase tracking-wider">{template.title}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Bottom Grid */}
               <div className="grid lg:grid-cols-2 gap-8">

                  {/* Upcoming Events */}
                  <div className="bg-white dark:bg-edluar-surface rounded-3xl p-6 shadow-sm border border-edluar-pale/50 dark:border-edluar-moss/10">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                           <h3 className="text-xl text-edluar-dark dark:text-edluar-cream font-serif font-medium">Upcoming events</h3>
                           <span className="bg-edluar-cream dark:bg-edluar-deep text-edluar-dark/60 dark:text-edluar-cream/60 text-xs font-bold px-2 py-1 rounded-md">13</span>
                        </div>
                        <button className="text-edluar-moss hover:text-edluar-dark"><MoreHorizontal className="w-5 h-5" /></button>
                     </div>

                     <div className="space-y-1">
                        {events.map((event, idx) => (
                           <div key={idx} className="flex items-center p-3 hover:bg-edluar-cream/30 dark:hover:bg-edluar-deep/30 rounded-xl transition-colors group cursor-pointer">
                              <div className="mr-4 text-edluar-dark/40 dark:text-edluar-cream/40">
                                 {event.type === 'video' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-medium text-edluar-dark dark:text-edluar-cream text-sm">{event.title}</h4>
                                 <p className="text-xs text-edluar-dark/50 dark:text-edluar-cream/50">{event.time}</p>
                              </div>
                              <div className="flex -space-x-2">
                                 {event.attendees.map((img, i) => (
                                    <img key={i} src={img} alt="Attendee" className="w-8 h-8 rounded-full border-2 border-white dark:border-edluar-surface" />
                                 ))}
                                 <div className="w-8 h-8 rounded-full bg-edluar-cream dark:bg-edluar-deep border-2 border-white dark:border-edluar-surface flex items-center justify-center text-[10px] text-edluar-dark/60 dark:text-edluar-cream/60 font-bold">
                                    +2
                                 </div>
                              </div>
                           </div>
                        ))}
                        {/* Divider for dates logic could go here, simplified for demo */}
                     </div>
                  </div>

                  {/* To-dos */}
                  <div className="bg-white dark:bg-edluar-surface rounded-3xl p-6 shadow-sm border border-edluar-pale/50 dark:border-edluar-moss/10">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                           <h3 className="text-xl text-edluar-dark dark:text-edluar-cream font-serif font-medium">To-dos</h3>
                           <span className="bg-edluar-cream dark:bg-edluar-deep text-edluar-dark/60 dark:text-edluar-cream/60 text-xs font-bold px-2 py-1 rounded-md">7</span>
                        </div>
                        <button className="text-edluar-moss hover:text-edluar-dark"><MoreHorizontal className="w-5 h-5" /></button>
                     </div>

                     <div className="space-y-1">
                        {todos.map((todo, idx) => (
                           <div key={idx} className="flex items-center p-3 hover:bg-edluar-cream/30 dark:hover:bg-edluar-deep/30 rounded-xl transition-colors group">
                              <button className="w-5 h-5 rounded border border-edluar-dark/30 dark:border-edluar-cream/30 mr-4 hover:border-edluar-moss hover:bg-edluar-moss/10 transition-colors flex items-center justify-center text-transparent hover:text-edluar-moss">
                                 <CheckSquare className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex-1 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">{todo.title}</span>
                                    {todo.tag && (
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${todo.tagColor}`}>
                                          {todo.tag}
                                       </span>
                                    )}
                                 </div>
                                 <span className="text-xs text-edluar-dark/40 dark:text-edluar-cream/40 group-hover:text-edluar-dark/60 transition-colors">
                                    {todo.assignee}
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

               </div>

            </div>
         </main>
      </div>
   );
};