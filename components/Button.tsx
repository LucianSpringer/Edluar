import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-edluar-moss text-white hover:bg-edluar-dark dark:hover:bg-edluar-sage dark:hover:text-edluar-deep focus:ring-edluar-moss shadow-lg hover:shadow-xl",
    secondary: "bg-edluar-sage text-white hover:bg-edluar-moss focus:ring-edluar-sage",
    outline: "border-2 border-edluar-moss text-edluar-moss dark:text-edluar-pale dark:border-edluar-pale hover:bg-edluar-moss hover:text-white dark:hover:bg-edluar-pale dark:hover:text-edluar-deep focus:ring-edluar-moss"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};