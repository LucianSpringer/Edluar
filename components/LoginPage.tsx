
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Linkedin, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  initialMode?: 'login' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, initialMode = 'login' }) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  // Reset state when initialMode changes
  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
    setError('');
  }, [initialMode]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isSignUp && !formData.name) {
      setError('Please enter your full name.');
      return;
    }
    if (isSignUp && !formData.agreeToTerms) {
      setError('You must agree to the terms to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignUp
        ? { email: formData.email, password: formData.password, name: formData.name }
        : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Save token and user to auth context
      login(data.token, data.user);

      // Navigate to dashboard
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider} not yet implemented`);
    setError(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen bg-edluar-cream dark:bg-edluar-deep flex transition-colors duration-300">

      {/* Left Column - Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-edluar-moss dark:bg-edluar-surface relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-edluar-sage/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-edluar-pale hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-10 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex text-edluar-pale mb-6">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              ))}
            </div>
            <p className="text-xl font-serif italic mb-6 leading-relaxed">
              "Edluar transformed how we hire. We spend less time on paperwork and more time connecting with people. It feels natural."
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-edluar-pale text-edluar-moss flex items-center justify-center font-bold">MC</div>
              <div>
                <p className="font-bold text-white">Marcus Chen</p>
                <p className="text-edluar-pale text-sm">Head of Product @ Nimbus</p>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-serif font-bold mb-4">
            {isSignUp ? "Join the Ecosystem" : "Welcome Back"}
          </h2>
          <p className="text-edluar-pale/80 text-lg leading-relaxed">
            {isSignUp
              ? "Create an account to start writing organic job descriptions and managing your pipeline with empathy."
              : "Log in to continue cultivating your team and accessing your AI-powered tools."}
          </p>
        </div>

        <div className="relative z-10 text-sm text-edluar-pale/60">
          © {new Date().getFullYear()} Edluar Inc.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
        <button
          onClick={() => onNavigate('home')}
          className="lg:hidden absolute top-8 left-8 p-2 rounded-full hover:bg-edluar-pale/50 dark:hover:bg-edluar-moss/20 text-edluar-dark dark:text-edluar-cream transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-full max-w-md space-y-8 animate-fade-in-up">

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-serif font-bold text-edluar-dark dark:text-edluar-cream mb-2">
              {isSignUp ? "Create your account" : "Log in to Edluar"}
            </h1>
            <p className="text-edluar-dark/60 dark:text-edluar-cream/60">
              {isSignUp ? "Start your 14-day free trial. No credit card required." : "Enter your details below to access your account."}
            </p>
          </div>

          <div className="space-y-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-edluar-pale dark:border-edluar-moss/30 hover:bg-white dark:hover:bg-edluar-surface bg-white/50 dark:bg-black/20 text-edluar-dark dark:text-edluar-cream font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-edluar-moss/50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                onClick={() => handleSocialLogin('LinkedIn')}
                className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-edluar-pale dark:border-edluar-moss/30 hover:bg-white dark:hover:bg-edluar-surface bg-white/50 dark:bg-black/20 text-edluar-dark dark:text-edluar-cream font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-edluar-moss/50"
              >
                <Linkedin className="w-5 h-5 mr-2 text-[#0077b5]" />
                LinkedIn
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-edluar-pale dark:border-edluar-moss/30"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-edluar-cream dark:bg-edluar-deep px-2 text-edluar-dark/50 dark:text-edluar-cream/50">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-sm font-medium text-edluar-dark dark:text-edluar-cream ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-edluar-dark/40 dark:text-edluar-cream/40" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-edluar-pale dark:border-edluar-moss/30 bg-white/50 dark:bg-black/20 text-edluar-dark dark:text-edluar-cream focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none transition-all"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-edluar-dark dark:text-edluar-cream ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-edluar-dark/40 dark:text-edluar-cream/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-edluar-pale dark:border-edluar-moss/30 bg-white/50 dark:bg-black/20 text-edluar-dark dark:text-edluar-cream focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-edluar-dark dark:text-edluar-cream">Password</label>
                  {!isSignUp && (
                    <button type="button" className="text-xs font-medium text-edluar-moss hover:text-edluar-dark dark:hover:text-edluar-sage transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-edluar-dark/40 dark:text-edluar-cream/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-edluar-pale dark:border-edluar-moss/30 bg-white/50 dark:bg-black/20 text-edluar-dark dark:text-edluar-cream focus:ring-2 focus:ring-edluar-moss/50 focus:border-edluar-moss outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-edluar-dark/40 dark:text-edluar-cream/40 hover:text-edluar-dark dark:hover:text-edluar-cream transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="flex items-start space-x-3">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="w-4 h-4 rounded border-edluar-pale text-edluar-moss focus:ring-edluar-moss cursor-pointer"
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm text-edluar-dark/70 dark:text-edluar-cream/70 leading-tight">
                    I agree to the <a href="#" className="font-medium text-edluar-moss hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-edluar-moss hover:underline">Privacy Policy</a>.
                  </label>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-900/30 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-3.5 text-lg shadow-xl shadow-edluar-moss/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isSignUp ? "Create Account" : "Log In"
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-edluar-dark/60 dark:text-edluar-cream/60 text-sm">
                {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="ml-1.5 font-bold text-edluar-moss hover:text-edluar-dark dark:hover:text-edluar-sage transition-colors underline decoration-2 underline-offset-4"
                >
                  {isSignUp ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
