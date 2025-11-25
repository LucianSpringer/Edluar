
import React from 'react';
import { Leaf, Heart, Users, Globe, Sprout, Wind, Target } from 'lucide-react';

export const AboutPage = () => {
  const values = [
    {
      icon: <Sprout className="w-8 h-8 text-edluar-moss" />,
      title: "Organic Growth",
      description: "We believe in sustainable scaling. Hiring isn't about filling seats quickly; it's about planting seeds for long-term success."
    },
    {
      icon: <Heart className="w-8 h-8 text-rose-400" />,
      title: "Radical Empathy",
      description: "Software should serve humans, not the other way around. We design every feature with the candidate and recruiter experience in mind."
    },
    {
      icon: <Wind className="w-8 h-8 text-sky-400" />,
      title: "Transparency",
      description: "Clear pipelines, honest feedback, and open communication. We eliminate the 'black box' of traditional hiring."
    },
    {
      icon: <Globe className="w-8 h-8 text-edluar-dark" />,
      title: "Diverse Roots",
      description: "A garden thrives with variety. We build tools that actively reduce bias and help you find talent from every walk of life."
    }
  ];

  const team = [
    {
      name: "Elena Rostova",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      bio: "Former HR Director tired of clunky spreadsheets. Elena built Edluar to bring joy back to hiring."
    },
    {
      name: "Marcus Chen",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      bio: "An architect turned product designer who believes software structure should feel as natural as a building."
    },
    {
      name: "Sarah Jenkins",
      role: "Chief People Officer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      bio: "Psychology PhD passionate about organizational behavior and building teams that last."
    }
  ];

  return (
    <div className="bg-edluar-cream dark:bg-edluar-deep min-h-screen transition-colors duration-300 animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-edluar-pale/40 dark:bg-edluar-moss/10 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-edluar-moss/10 text-edluar-moss dark:text-edluar-pale text-sm font-semibold mb-6">
            <Leaf className="w-4 h-4" />
            <span>Our Story</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-8 leading-tight">
            We're putting the <span className="text-edluar-moss dark:text-edluar-sage">Human</span> back in Human Resources.
          </h1>
          <p className="text-xl text-edluar-dark/70 dark:text-edluar-cream/70 leading-relaxed">
            Edluar was born from a simple belief: Recruitment software shouldn't feel like a factory line. It should feel like a garden—growing, living, and organic.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-edluar-surface transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-edluar-pale dark:bg-edluar-moss/30 rounded-full -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Team collaborating" 
                className="rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 p-6 bg-edluar-cream dark:bg-edluar-deep rounded-xl shadow-lg max-w-xs border border-edluar-pale dark:border-edluar-moss/20 hidden md:block">
                <p className="font-serif italic text-edluar-dark dark:text-edluar-cream">"Hiring is the most important thing you do. Treat it with care."</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-6">Rooted in Connection</h2>
              <p className="text-lg text-edluar-dark/80 dark:text-edluar-cream/80 mb-6">
                In 2021, we realized that ATS tools had become barriers rather than bridges. They filtered out great people because of keywords and treated candidates like data points.
              </p>
              <p className="text-lg text-edluar-dark/80 dark:text-edluar-cream/80 mb-8">
                We built Edluar to change that. By using AI to highlight potential rather than just matching keywords, and by designing workflows that encourage communication, we help companies build teams that actually stick together.
              </p>
              <div className="flex items-center space-x-8 text-edluar-moss dark:text-edluar-sage font-bold text-xl">
                <div>
                  <span className="block text-4xl mb-1">10k+</span>
                  <span className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60 font-sans font-normal">Hires Made</span>
                </div>
                <div>
                  <span className="block text-4xl mb-1">98%</span>
                  <span className="text-sm text-edluar-dark/60 dark:text-edluar-cream/60 font-sans font-normal">Retention Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-edluar-cream dark:bg-edluar-deep transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">Our Core Values</h2>
            <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/70">The principles that guide every line of code we write.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white dark:bg-edluar-surface p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-edluar-pale/50 dark:border-edluar-moss/20">
                <div className="mb-4 bg-edluar-cream dark:bg-black/20 w-16 h-16 rounded-full flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream mb-3">{value.title}</h3>
                <p className="text-edluar-dark/70 dark:text-edluar-cream/70 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white dark:bg-edluar-surface transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-4">Meet the Gardeners</h2>
            <p className="text-lg text-edluar-dark/70 dark:text-edluar-cream/70">The people cultivating Edluar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-edluar-moss rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-48 h-48 rounded-full object-cover border-4 border-edluar-pale dark:border-edluar-moss/30 mx-auto"
                  />
                </div>
                <h3 className="text-xl font-bold text-edluar-dark dark:text-edluar-cream">{member.name}</h3>
                <p className="text-edluar-moss dark:text-edluar-sage font-medium mb-3">{member.role}</p>
                <p className="text-edluar-dark/60 dark:text-edluar-cream/60 text-sm max-w-xs mx-auto">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-edluar-moss dark:bg-edluar-surface border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-white mb-6">Ready to grow with us?</h2>
          <p className="text-edluar-pale mb-8 text-lg">We are always looking for passionate people to join our team.</p>
          <button className="bg-white text-edluar-dark hover:bg-edluar-pale font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
            View Open Roles
          </button>
        </div>
      </section>
    </div>
  );
};
