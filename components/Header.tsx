
import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productLinks = [
    { name: 'Features', action: () => handleNavClick('features') },
    { name: 'Customer', action: () => handleNavClick('customer') },
    { name: 'Integrations', action: () => onNavigate('integrations') },
  ];

  const resourceLinks = [
    { name: 'About Us', action: () => onNavigate('about') },
    { name: 'Careers', action: () => onNavigate('careers') },
    { name: 'Blog', action: () => onNavigate('blog') },
    { name: 'Contact', action: () => onNavigate('contact') },
    { name: 'Privacy Policy', action: () => onNavigate('privacy') },
  ];

  const handleNavClick = (target: string) => {
    if (currentPage !== 'home') {
      onNavigate('home');
      if (target !== 'home') {
        setTimeout(() => {
          const element = document.getElementById(target);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      if (target !== 'home') {
        const element = document.getElementById(target);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-edluar-cream/95 dark:bg-edluar-deep/95 backdrop-blur-md border-b border-edluar-pale/50 dark:border-edluar-moss/30 shadow-sm'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="bg-edluar-moss p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-edluar-cream" />
            </div>
            <span className="text-2xl font-serif font-bold text-edluar-dark dark:text-edluar-cream">Edluar</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Product Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 font-medium transition-colors px-1 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss dark:focus:ring-offset-edluar-deep group-hover:text-edluar-moss dark:group-hover:text-edluar-pale ${['features', 'customer', 'integrations'].includes(currentPage) ? 'text-edluar-moss dark:text-edluar-pale' : 'text-edluar-dark dark:text-edluar-cream/80'}`}
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="relative z-10">Product</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-edluar-moss dark:bg-edluar-pale origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>

              <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pt-2">
                <div className="relative bg-white dark:bg-edluar-surface rounded-xl shadow-xl border border-edluar-pale/50 dark:border-edluar-moss/30 overflow-hidden p-2">
                  {productLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => {
                        if (link.action) link.action();
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-edluar-dark dark:text-edluar-cream/90 hover:bg-edluar-cream dark:hover:bg-edluar-moss/20 rounded-lg transition-colors"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Link */}
            <button
              onClick={() => handleNavClick('pricing')}
              className="relative group text-edluar-dark dark:text-edluar-cream/80 dark:hover:text-edluar-cream font-medium transition-colors px-1 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss dark:focus:ring-offset-edluar-deep"
            >
              <span className="relative z-10">Pricing</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-edluar-moss dark:bg-edluar-pale origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus:scale-x-100"></span>
            </button>

            {/* Changelog Link */}
            <button
              onClick={() => onNavigate('changelog')}
              className="relative group text-edluar-dark dark:text-edluar-cream/80 dark:hover:text-edluar-cream font-medium transition-colors px-1 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss dark:focus:ring-offset-edluar-deep"
            >
              <span className="relative z-10">Changelog</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-edluar-moss dark:bg-edluar-pale origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus:scale-x-100"></span>
            </button>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 font-medium transition-colors px-1 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss dark:focus:ring-offset-edluar-deep group-hover:text-edluar-moss dark:group-hover:text-edluar-pale ${['about', 'careers', 'blog', 'contact', 'privacy'].includes(currentPage) ? 'text-edluar-moss dark:text-edluar-pale' : 'text-edluar-dark dark:text-edluar-cream/80'}`}
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="relative z-10">Resources</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-edluar-moss dark:bg-edluar-pale origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>

              <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pt-2">
                <div className="relative bg-white dark:bg-edluar-surface rounded-xl shadow-xl border border-edluar-pale/50 dark:border-edluar-moss/30 overflow-hidden p-2">
                  {resourceLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => {
                        if (link.action) link.action();
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-edluar-dark dark:text-edluar-cream/90 hover:bg-edluar-cream dark:hover:bg-edluar-moss/20 rounded-lg transition-colors"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-edluar-dark dark:text-edluar-pale hover:bg-edluar-pale/20 dark:hover:bg-edluar-surface transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss dark:focus:ring-offset-edluar-deep"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Button
              variant="outline"
              size="sm"
              className="ml-2 focus:ring-2 focus:ring-offset-2 focus:ring-edluar-dark dark:focus:ring-offset-edluar-deep outline-none"
              onClick={() => onNavigate('login', { mode: 'login' })}
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="ml-2 focus:ring-2 focus:ring-offset-2 focus:ring-edluar-dark dark:focus:ring-offset-edluar-deep outline-none"
              onClick={() => onNavigate('login', { mode: 'signup' })}
            >
              Start Free Trial
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-edluar-dark dark:text-edluar-pale hover:bg-edluar-pale/20 dark:hover:bg-edluar-surface transition-colors focus:outline-none focus:ring-2 focus:ring-edluar-moss"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-edluar-moss dark:text-edluar-pale hover:text-edluar-dark dark:hover:text-white p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-edluar-dark focus:bg-edluar-pale/20 dark:focus:ring-edluar-pale"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="true"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav with Smooth Transition */}
      <div
        className={`absolute top-full left-0 w-full bg-edluar-cream dark:bg-edluar-surface border-t border-edluar-pale dark:border-edluar-moss/30 shadow-lg overflow-hidden transition-all duration-300 ease-in-out origin-top ${isMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
      >
        <nav
          id="mobile-menu"
          className="md:hidden"
          aria-label="Mobile Navigation"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {/* Mobile Product Accordion */}
            <div>
              <button
                onClick={() => setIsProductOpen(!isProductOpen)}
                className="flex w-full items-center justify-between px-3 py-3 text-edluar-dark dark:text-edluar-cream font-medium hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss"
              >
                <span>Product</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`space-y-1 pl-4 overflow-hidden transition-all duration-300 ${isProductOpen ? 'max-h-72 mt-2' : 'max-h-0'}`}>
                {productLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      if (link.action) link.action();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-edluar-dark/80 dark:text-edluar-cream/80 hover:text-edluar-moss dark:hover:text-edluar-pale transition-colors rounded-md"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Button */}
            <button
              onClick={() => handleNavClick('pricing')}
              className="block w-full text-left px-3 py-3 text-edluar-dark dark:text-edluar-cream font-medium hover:bg-edluar-dark hover:text-white dark:hover:bg-edluar-moss focus:bg-edluar-dark focus:text-white dark:focus:bg-edluar-moss rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss"
            >
              Pricing
            </button>

            {/* Changelog Button */}
            <button
              onClick={() => { onNavigate('changelog'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-3 text-edluar-dark dark:text-edluar-cream font-medium hover:bg-edluar-dark hover:text-white dark:hover:bg-edluar-moss focus:bg-edluar-dark focus:text-white dark:focus:bg-edluar-moss rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss"
            >
              Changelog
            </button>

            {/* Mobile Resources Accordion */}
            <div className="border-t border-edluar-pale/20 dark:border-edluar-moss/20 pt-2 mt-2">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex w-full items-center justify-between px-3 py-3 text-edluar-dark dark:text-edluar-cream font-medium hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss"
              >
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`space-y-1 pl-4 overflow-hidden transition-all duration-300 ${isResourcesOpen ? 'max-h-72 mt-2' : 'max-h-0'}`}>
                {resourceLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      if (link.action) link.action();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-edluar-dark/80 dark:text-edluar-cream/80 hover:text-edluar-moss dark:hover:text-edluar-pale transition-colors rounded-md"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                variant="outline"
                className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-edluar-dark dark:focus:ring-offset-edluar-deep"
                onClick={() => { setIsMenuOpen(false); onNavigate('login', { mode: 'login' }); }}
              >
                Login
              </Button>
              <Button
                variant="primary"
                className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-edluar-dark dark:focus:ring-offset-edluar-deep"
                onClick={() => { setIsMenuOpen(false); onNavigate('login', { mode: 'signup' }); }}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
