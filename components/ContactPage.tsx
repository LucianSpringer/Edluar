
import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, ChevronDown, MessageSquare, Sparkles, Newspaper, LifeBuoy, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const MESSAGE_LIMIT = 500;
  const WARNING_THRESHOLD = 50;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
        newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.message.length > MESSAGE_LIMIT) newErrors.message = "Message too long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
        setIsSubmitted(true);
        // Reset after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ firstName: '', lastName: '', email: '', countryCode: '+1', phone: '', message: '' });
            setErrors({});
        }, 3000);
    }
  };

  const getMessageCounterClass = () => {
    const remaining = MESSAGE_LIMIT - formData.message.length;
    if (remaining < 0) return "text-red-500 font-bold";
    if (remaining <= WARNING_THRESHOLD) return "text-yellow-600 dark:text-yellow-500 font-bold";
    return "text-edluar-dark/40 dark:text-edluar-cream/40";
  };

  return (
    <div className="bg-edluar-cream dark:bg-edluar-deep min-h-screen transition-colors duration-300 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          
          {/* Left Column: Contact Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-6">
                Contact Us
              </h1>
              <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/70 max-w-md mb-8 leading-relaxed">
                Email, call, or complete the form to learn how Edluar can solve your recruitment challenges naturally.
              </p>
              
              <div className="space-y-4">
                <a href="mailto:info@edluar.io" className="flex items-center text-edluar-dark dark:text-edluar-cream font-medium hover:text-edluar-moss dark:hover:text-edluar-sage transition-colors group">
                   <Mail className="w-5 h-5 mr-3 text-edluar-moss dark:text-edluar-sage group-hover:scale-110 transition-transform" />
                   info@edluar.io
                </a>
                <a href="tel:+321221231" className="flex items-center text-edluar-dark dark:text-edluar-cream font-medium hover:text-edluar-moss dark:hover:text-edluar-sage transition-colors group">
                   <Phone className="w-5 h-5 mr-3 text-edluar-moss dark:text-edluar-sage group-hover:scale-110 transition-transform" />
                   321-221-231
                </a>
              </div>

              <div className="mt-8">
                <button className="inline-flex items-center text-edluar-dark dark:text-edluar-cream font-bold underline decoration-edluar-moss decoration-2 underline-offset-4 hover:text-edluar-moss transition-colors">
                  Visit Customer Support <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
              <div>
                <h3 className="text-lg font-bold text-edluar-dark dark:text-edluar-cream mb-3 flex items-center">
                    <LifeBuoy className="w-5 h-5 mr-2 text-edluar-moss" /> Customer Support
                </h3>
                <p className="text-sm text-edluar-dark/70 dark:text-edluar-cream/70 leading-relaxed">
                  Our support team is available around the clock to address any concerns or queries you may have.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-edluar-dark dark:text-edluar-cream mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-edluar-moss" /> Feedback & Suggestions
                </h3>
                <p className="text-sm text-edluar-dark/70 dark:text-edluar-cream/70 leading-relaxed">
                  We value your feedback and are continuously working to improve Edluar. Your input is crucial.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-edluar-dark dark:text-edluar-cream mb-3 flex items-center">
                    <Newspaper className="w-5 h-5 mr-2 text-edluar-moss" /> Media Inquiries
                </h3>
                <p className="text-sm text-edluar-dark/70 dark:text-edluar-cream/70 leading-relaxed">
                  For media-related questions or press inquiries, please contact us at media@edluar.io.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white dark:bg-edluar-surface p-8 md:p-10 rounded-3xl shadow-xl shadow-edluar-moss/5 border border-edluar-pale dark:border-edluar-moss/20 relative overflow-hidden">
             {/* Decorative background blob inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-edluar-pale/20 dark:bg-edluar-moss/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-2">Get in Touch</h2>
                    <p className="text-edluar-dark/60 dark:text-edluar-cream/60">You can reach us anytime</p>
                </div>

                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in-up">
                        <div className="w-16 h-16 bg-edluar-moss rounded-full flex items-center justify-center text-white shadow-lg">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-edluar-dark dark:text-edluar-cream">Message Sent!</h3>
                        <p className="text-edluar-dark/70 dark:text-edluar-cream/70">We'll get back to you as soon as possible.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <input 
                                    type="text" 
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-edluar-pale dark:border-edluar-moss/30 bg-edluar-cream/20 dark:bg-black/20'} text-edluar-dark dark:text-edluar-cream placeholder-edluar-dark/40 dark:placeholder-edluar-cream/40 focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none transition-all`} 
                                />
                                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <input 
                                    type="text" 
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-edluar-pale dark:border-edluar-moss/30 bg-edluar-cream/20 dark:bg-black/20'} text-edluar-dark dark:text-edluar-cream placeholder-edluar-dark/40 dark:placeholder-edluar-cream/40 focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none transition-all`} 
                                />
                                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <input 
                                type="text" 
                                placeholder="Your email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-edluar-pale dark:border-edluar-moss/30 bg-edluar-cream/20 dark:bg-black/20'} text-edluar-dark dark:text-edluar-cream placeholder-edluar-dark/40 dark:placeholder-edluar-cream/40 focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none transition-all`} 
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="flex space-x-2">
                             <div className="w-24 relative">
                                <select 
                                  value={formData.countryCode}
                                  onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                                  className="w-full px-3 py-3 rounded-xl border border-edluar-pale dark:border-edluar-moss/30 bg-edluar-cream/20 dark:bg-black/20 text-edluar-dark dark:text-edluar-cream focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none appearance-none cursor-pointer"
                                >
                                  <option value="+1">US +1</option>
                                  <option value="+44">UK +44</option>
                                  <option value="+61">AU +61</option>
                                  <option value="+49">DE +49</option>
                                  <option value="+33">FR +33</option>
                                  <option value="+31">NL +31</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-edluar-dark/50 pointer-events-none" />
                             </div>
                            <input 
                                type="tel" 
                                placeholder="Phone number"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="flex-1 px-4 py-3 rounded-xl border border-edluar-pale dark:border-edluar-moss/30 bg-edluar-cream/20 dark:bg-black/20 text-edluar-dark dark:text-edluar-cream placeholder-edluar-dark/40 dark:placeholder-edluar-cream/40 focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none transition-all" 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <textarea 
                                placeholder="How can we help?"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-edluar-pale dark:border-edluar-moss/30 bg-edluar-cream/20 dark:bg-black/20'} text-edluar-dark dark:text-edluar-cream placeholder-edluar-dark/40 dark:placeholder-edluar-cream/40 focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none transition-all resize-none`} 
                            ></textarea>
                            <div className="flex justify-between items-center text-xs mt-1">
                                {errors.message ? (
                                    <span className="text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.message}</span>
                                ) : (
                                    <span></span>
                                )}
                                <span className={getMessageCounterClass()}>
                                    {formData.message.length}/{MESSAGE_LIMIT}
                                </span>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" className="w-full justify-center py-3 text-lg shadow-xl shadow-edluar-moss/20">
                            Submit
                        </Button>

                        <p className="text-center text-xs text-edluar-dark/50 dark:text-edluar-cream/50 mt-4">
                            By contacting us, you agree to our <a href="#" className="underline hover:text-edluar-moss">Terms of service</a> and <a href="#" className="underline hover:text-edluar-moss">Privacy Policy</a>.
                        </p>
                    </form>
                )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="bg-white dark:bg-edluar-surface rounded-3xl p-4 md:p-6 shadow-xl shadow-edluar-moss/5 border border-edluar-pale dark:border-edluar-moss/20">
          <div className="rounded-2xl overflow-hidden h-80 md:h-96 w-full relative grayscale hover:grayscale-0 transition-all duration-700 ease-in-out group">
             {/* Overlay for interaction hint */}
             <div className="absolute inset-0 bg-edluar-moss/10 pointer-events-none group-hover:opacity-0 transition-opacity z-10"></div>
             
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.798154185794!2d4.895168016143977!3d52.36757397978553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c2a74c43a3%3A0xc36768a35368a69d!2sKeizersgracht%20264%2C%201016%20EV%20Amsterdam%2C%20Netherlands!5e0!3m2!1sen!2sus!4v1677654321098!5m2!1sen!2sus"
               className="absolute inset-0 w-full h-full border-0"
               allowFullScreen={false}
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
               title="Edluar Headquarters"
             ></iframe>
             
             <div className="absolute bottom-6 left-6 bg-white dark:bg-edluar-deep p-4 rounded-xl shadow-lg border border-edluar-pale dark:border-edluar-moss/30 max-w-xs z-20">
                <h4 className="font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-1">Our HQ</h4>
                <p className="text-sm text-edluar-dark/70 dark:text-edluar-cream/70">
                   Keizersgracht 264<br/>
                   1016 EV Amsterdam, NL
                </p>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};
