import React, { useState, useEffect } from 'react';
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
  Check,
  ChevronLeft
} from 'lucide-react';
import { Button } from './Button';
import { JobBlockRenderer } from './JobBlockRenderer';
import { ContentBlock } from './ContentBuilder';

interface Job {
  id: number;
  title: string;
  location: string;
  employment_type: string;
  department: string;
  content_blocks: string | null;
}

export const CareersPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'apply'>('details');
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
  const [pageBlocks, setPageBlocks] = useState<ContentBlock[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    // Fetch jobs
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Failed to fetch jobs:", err));

    // Fetch page content
    fetch('http://localhost:5000/api/pages/careers')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Page not found');
      })
      .then(data => {
        if (data.content_blocks) {
          try {
            setPageBlocks(JSON.parse(data.content_blocks));
          } catch (e) {
            console.error("Failed to parse blocks", e);
          }
        }
      })
      .catch(err => {
        console.log("No dynamic page found, using fallback");
        // Fallback content if no page is saved yet
        setPageBlocks([
          { id: 'hero', type: 'hero', value: 'Join Our Mission', subtitle: 'We are building the future of work.', ctaText: 'View Open Roles', ctaLink: '#jobs' },
          {
            id: 'features', type: 'features', features: [
              { title: "Remote-First", description: "Work from anywhere. We trust you to do your best work, wherever you are." },
              { title: "Health & Wellness", description: "Comprehensive coverage and mental health days to keep you feeling your best." },
              { title: "Growth Budget", description: "$2,000 annual stipend for courses, books, and conferences." }
            ]
          },
          { id: 'job_list', type: 'job_list', value: '' }
        ]);
      })
      .finally(() => setIsLoadingPage(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplicationSubmitted(true);
    setTimeout(() => {
      setIsApplicationSubmitted(false);
      setSelectedJob(null);
      setViewMode('details');
    }, 2000);
  };

  const handleOpenJob = (job: Job) => {
    setSelectedJob(job);
    setViewMode('details');
  };

  const getParsedBlocks = (jsonString: string | null): ContentBlock[] => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse content blocks", e);
      return [];
    }
  };

  if (selectedJob) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-edluar-deep overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedJob(null)}
            className="mb-8 flex items-center text-edluar-dark/60 dark:text-edluar-cream/60 hover:text-edluar-moss transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> Back to Careers
          </button>

          {viewMode === 'details' ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">{selectedJob.title}</h1>
                <div className="flex flex-wrap gap-4 text-edluar-dark/60 dark:text-edluar-cream/60">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {selectedJob.employment_type}</span>
                  <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {selectedJob.department}</span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-12">
                <JobBlockRenderer blocks={getParsedBlocks(selectedJob.content_blocks)} />
              </div>

              <div className="flex justify-center pt-8 border-t border-gray-200 dark:border-white/10">
                <Button size="lg" onClick={() => setViewMode('apply')}>Apply for this Role</Button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold mb-4">Apply for {selectedJob.title}</h2>
                <p className="opacity-60">Please complete the form below. We'll get back to you within 48 hours.</p>
              </div>

              {isApplicationSubmitted ? (
                <div className="text-center py-20 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Application Sent!</h3>
                  <p className="text-green-600 dark:text-green-300">Thanks for your interest. We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider opacity-70">First Name</label>
                      <input required type="text" className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider opacity-70">Last Name</label>
                      <input required type="text" className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider opacity-70">Email Address</label>
                    <input required type="email" className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider opacity-70">Resume / CV</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-70">Drag and drop your resume here, or click to browse</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider opacity-70">Cover Letter (Optional)</label>
                    <textarea rows={4} className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-edluar-moss/50 outline-none transition-all"></textarea>
                  </div>
                  <Button type="submit" size="lg" className="w-full">Submit Application</Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-edluar-cream dark:bg-edluar-deep min-h-screen transition-colors duration-300 animate-fade-in-up">
      {isLoadingPage ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-edluar-moss border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <JobBlockRenderer blocks={pageBlocks} jobs={jobs} onJobClick={handleOpenJob} />
      )}
    </div>
  );
};
