
import React from 'react';
import { Shield, Lock, Eye, FileText, Server, UserCheck, Cookie, Leaf, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "1. Information We Collect (Seeds We Plant)",
      content: "We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This includes your name, email address, job title, and company details. Like a careful gardener, we only gather what is necessary for our ecosystem to thrive. We also collect usage data automatically to help us improve our services."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "2. How We Use Your Data (Nurturing Growth)",
      content: "We use your information to provide, maintain, and improve our services. Think of it as watering the plants. We use data to generate AI job descriptions, process applications, and send you important updates. We treat your data with respect and never sell your personal information to third parties for marketing purposes."
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "3. Data Storage & Security (Garden Fences)",
      content: "Your data is stored on secure servers with robust encryption. We implement industry-standard security measures—our digital garden fence—to protect against unauthorized access, alteration, or destruction of your personal information. While no system is 100% impenetrable, we cultivate a security-first culture to keep your information safe."
    },
    {
      icon: <Cookie className="w-6 h-6" />,
      title: "4. Cookies & Tracking (Soil Quality)",
      content: "We use cookies to improve your experience. These small text files help us understand how you use our site, remember your preferences, and keep you signed in. They are the nutrients in our digital soil. You can control cookie settings in your browser, though some features may wither without them."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "5. Your Rights (Pruning & Harvesting)",
      content: "You have the right to access, correct, or delete your personal data at any time. You can also object to processing or request data portability. If you wish to prune your digital footprint or harvest your data to take elsewhere, just reach out to our support team. We are committed to transparency and user control."
    }
  ];

  return (
    <div className="bg-edluar-cream dark:bg-edluar-deep min-h-screen transition-colors duration-300 animate-fade-in-up">
      {/* Header Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-edluar-pale/30 dark:border-edluar-moss/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-edluar-moss/10 text-edluar-moss dark:text-edluar-pale text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            <span>Effective Date: October 24, 2023</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-6">
            Our Privacy <span className="text-edluar-moss dark:text-edluar-sage">Promise</span>
          </h1>
          <p className="text-xl text-edluar-dark/70 dark:text-edluar-cream/70 leading-relaxed max-w-2xl mx-auto">
            At Edluar, we treat your data like a rare plant—with care, respect, and protection. We believe privacy is a fundamental human right, not a luxury.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="bg-white dark:bg-edluar-surface p-8 rounded-3xl shadow-sm border border-edluar-pale/50 dark:border-edluar-moss/20">
            <h2 className="text-2xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">Introduction</h2>
            <p className="text-edluar-dark/80 dark:text-edluar-cream/80 leading-relaxed">
              This Privacy Policy describes how Edluar Inc. ("Edluar", "we", "us", or "our") collects, uses, and discloses your personal information when you use our website and services. By using our Service, you agree to the collection and use of information in accordance with this policy. We are committed to protecting your personal information and your right to privacy.
            </p>
          </div>

          <div className="grid gap-6">
            {sections.map((section, idx) => (
              <div 
                key={idx} 
                className="bg-white/50 dark:bg-edluar-surface/50 p-8 rounded-2xl border border-edluar-pale/30 dark:border-edluar-moss/10 hover:bg-white dark:hover:bg-edluar-surface transition-colors duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-edluar-cream dark:bg-black/20 rounded-xl flex items-center justify-center text-edluar-moss dark:text-edluar-sage flex-shrink-0 mt-1">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-3">
                      {section.title}
                    </h3>
                    <p className="text-edluar-dark/70 dark:text-edluar-cream/70 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-edluar-moss dark:bg-edluar-surface rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <Leaf className="w-12 h-12 mx-auto mb-6 text-edluar-pale" />
              <h3 className="text-2xl font-serif font-bold mb-4">Still have questions?</h3>
              <p className="text-edluar-pale/80 mb-8 max-w-lg mx-auto">
                If you have any questions about this Privacy Policy, please contact us. We're happy to explain exactly how we keep your data safe.
              </p>
              <a href="mailto:privacy@edluar.io" className="inline-block bg-white text-edluar-moss font-bold px-8 py-3 rounded-full hover:bg-edluar-pale transition-colors shadow-lg">
                Contact Privacy Team
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
