import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { generateJobDescription } from '../services/geminiService';

export const AIDemo: React.FC = () => {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const ROLE_LIMIT = 50;
  const SKILLS_LIMIT = 150;
  const WARNING_THRESHOLD = 10;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !skills) return;

    setIsLoading(true);
    setResult('');
    
    const text = await generateJobDescription(role, skills);
    
    setResult(text);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInputClass = (length: number, limit: number) => {
    const isError = length >= limit;
    const isWarning = length >= limit - WARNING_THRESHOLD;
    
    const base = "w-full px-4 py-3 pr-10 rounded-xl border bg-edluar-cream/30 dark:bg-black/20 dark:text-edluar-cream focus:ring-2 outline-none transition-all";
    
    if (isError) {
      return `${base} border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-800 dark:focus:ring-red-900`;
    }
    if (isWarning) {
      return `${base} border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200 dark:border-yellow-700 dark:focus:ring-yellow-900`;
    }
    return `${base} border-edluar-sage/30 dark:border-edluar-moss/30 focus:border-edluar-sage focus:ring-edluar-pale/50 dark:focus:ring-edluar-moss/30`;
  };

  const getCounterClass = (length: number, limit: number) => {
    if (length >= limit) return 'text-red-500 font-bold';
    if (length >= limit - WARNING_THRESHOLD) return 'text-yellow-600 dark:text-yellow-500 font-semibold';
    return 'text-edluar-dark/50 dark:text-edluar-pale/50';
  };

  const renderValidationIcon = (length: number, limit: number) => {
    if (length >= limit) {
      return <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />;
    }
    if (length >= limit - WARNING_THRESHOLD) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />;
    }
    return null;
  };

  return (
    <div id="aidemo" className="py-24 bg-gradient-to-b from-edluar-cream to-edluar-pale/30 dark:from-edluar-deep dark:to-edluar-surface/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Context */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-edluar-pale/50 dark:bg-edluar-moss/20 text-edluar-moss dark:text-edluar-pale text-sm font-semibold border border-edluar-sage/30 dark:border-edluar-moss/30">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Gemini 2.5</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-edluar-dark dark:text-edluar-cream">
              Write Job Descriptions <br/>
              <span className="text-edluar-moss dark:text-edluar-pale">Organically. Instantly.</span>
            </h2>
            <p className="text-lg text-edluar-dark/80 dark:text-edluar-cream/70">
              Stop staring at a blank page. Let Edluar's AI engine craft the perfect, human-centric job description in seconds. Just tell us who you need.
            </p>
            
            <div className="hidden lg:block p-6 bg-white/50 dark:bg-edluar-surface/50 backdrop-blur-sm rounded-2xl border border-edluar-sage/20 dark:border-edluar-moss/20">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-edluar-moss flex items-center justify-center shrink-0">
                  <span className="text-white font-serif font-bold text-xl">“</span>
                </div>
                <p className="text-edluar-dark dark:text-edluar-cream/90 italic">
                  I used to spend hours drafting requirements. Edluar gives me a 90% draft in 10 seconds. It feels like magic, but clearer.
                </p>
              </div>
              <div className="mt-4 flex items-center space-x-3 pl-14">
                <div className="h-px w-8 bg-edluar-sage"></div>
                <span className="text-sm font-medium text-edluar-moss dark:text-edluar-pale">Sarah Jenkins, HR Director</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card */}
          <div className="bg-white dark:bg-edluar-surface rounded-3xl shadow-xl shadow-edluar-moss/10 dark:shadow-none border border-edluar-pale dark:border-edluar-moss/20 overflow-hidden transition-colors duration-300">
            <div className="bg-edluar-moss/5 dark:bg-black/20 p-6 border-b border-edluar-pale dark:border-edluar-moss/20">
              <h3 className="font-serif font-bold text-xl text-edluar-dark dark:text-edluar-cream">Try it yourself</h3>
              <p className="text-sm text-edluar-dark/70 dark:text-edluar-cream/60">See the power of our engine right now.</p>
            </div>
            
            <div className="p-6 space-y-6">
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="role" className="block text-sm font-medium text-edluar-dark dark:text-edluar-pale">Job Role</label>
                    <span className={`text-xs ${getCounterClass(role.length, ROLE_LIMIT)}`}>
                      {role.length}/{ROLE_LIMIT}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                        type="text"
                        id="role"
                        value={role}
                        maxLength={ROLE_LIMIT}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Senior Product Designer"
                        className={getInputClass(role.length, ROLE_LIMIT)}
                    />
                    {renderValidationIcon(role.length, ROLE_LIMIT)}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="skills" className="block text-sm font-medium text-edluar-dark dark:text-edluar-pale">Key Skills Required</label>
                    <span className={`text-xs ${getCounterClass(skills.length, SKILLS_LIMIT)}`}>
                      {skills.length}/{SKILLS_LIMIT}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                        type="text"
                        id="skills"
                        value={skills}
                        maxLength={SKILLS_LIMIT}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. Figma, React, Empathy"
                        className={getInputClass(skills.length, SKILLS_LIMIT)}
                    />
                     {renderValidationIcon(skills.length, SKILLS_LIMIT)}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !role || !skills}
                  className="w-full justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Crafting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Description
                    </>
                  )}
                </Button>
              </form>

              {/* Output Area */}
              <div className={`relative mt-6 p-4 rounded-xl bg-edluar-cream dark:bg-black/20 border border-edluar-pale dark:border-edluar-moss/30 transition-all duration-500 ${result ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
                {result && (
                  <>
                    <button 
                      onClick={handleCopy}
                      className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-300 ${
                        copied 
                          ? 'bg-edluar-moss text-white scale-110 shadow-md' 
                          : 'text-edluar-moss dark:text-edluar-pale hover:bg-edluar-pale dark:hover:bg-edluar-surface'
                      }`}
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="prose prose-sm prose-stone text-edluar-dark/90 dark:text-edluar-cream/90 max-h-60 overflow-y-auto pr-2 custom-scrollbar whitespace-pre-line font-medium">
                      {result}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};