import React, { useState } from 'react';
import { Menu, X, Leaf, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const resourceLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-edluar-cream/80 dark:bg-edluar-deep/90 backdrop-blur-md border-b border-edluar-pale/50 dark:border-edluar-moss/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-edluar-moss p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-edluar-cream" />
            </div>
            <span className="text-2xl font-serif font-bold text-edluar-dark dark:text-edluar-cream">Edluar</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {['Features', 'AI Demo', 'Pricing'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '')}`} 
                className="relative group text-edluar-dark dark:text-edluar-cream/80 dark:hover:text-edluar-cream font-medium transition-colors px-1 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss dark:focus:ring-offset-edluar-deep"
              >
                <span className="relative z-10">{item}</span>
                {/* Scale from center animation */}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-edluar-moss dark:bg-edluar-pale origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus:scale-x-100"></span>
              </a>
            ))}

            {/* Resources Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center space-x-1 text-edluar-dark dark:text-edluar-cream/80 dark:hover:text-edluar-cream font-medium transition-colors px-1 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss dark:focus:ring-offset-edluar-deep group-hover:text-edluar-moss dark:group-hover:text-edluar-pale"
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
                    <a
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-edluar-dark dark:text-edluar-cream/90 hover:bg-edluar-cream dark:hover:bg-edluar-moss/20 rounded-lg transition-colors"
                    >
                      {link.name}
                    </a>
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
            >
              Login
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="ml-2 focus:ring-2 focus:ring-offset-2 focus:ring-edluar-dark dark:focus:ring-offset-edluar-deep outline-none"
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

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav 
          id="mobile-menu" 
          className="md:hidden bg-edluar-cream dark:bg-edluar-surface border-t border-edluar-pale dark:border-edluar-moss/30 shadow-lg"
          aria-label="Mobile Navigation"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {['Features', 'AI Demo', 'Pricing'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '')}`} 
                className="block px-3 py-3 text-edluar-dark dark:text-edluar-cream font-medium hover:bg-edluar-dark hover:text-white dark:hover:bg-edluar-moss focus:bg-edluar-dark focus:text-white dark:focus:bg-edluar-moss rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}

            {/* Mobile Resources Accordion */}
            <div className="border-t border-edluar-pale/20 dark:border-edluar-moss/20 pt-2 mt-2">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex w-full items-center justify-between px-3 py-3 text-edluar-dark dark:text-edluar-cream font-medium hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edluar-moss"
              >
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`space-y-1 pl-4 overflow-hidden transition-all duration-300 ${isResourcesOpen ? 'max-h-60 mt-2' : 'max-h-0'}`}>
                {resourceLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-sm text-edluar-dark/80 dark:text-edluar-cream/80 hover:text-edluar-moss dark:hover:text-edluar-pale transition-colors rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-edluar-dark dark:focus:ring-offset-edluar-deep"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Button>
              <Button 
                variant="primary" 
                className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-edluar-dark dark:focus:ring-offset-edluar-deep"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
