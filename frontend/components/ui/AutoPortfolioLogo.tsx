'use client';

import React from 'react';

interface AutoPortfolioLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  theme?: 'light' | 'dark' | 'auto';
}

export default function AutoPortfolioLogo({ 
  className = '', 
  size = 'md',
  variant = 'full',
  theme = 'auto'
}: AutoPortfolioLogoProps) {
  
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto', 
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  };

  // Icon only version
  const IconSVG = () => (
    <svg 
      viewBox="0 0 48 48" 
      className={`${sizeClasses[size]} ${className}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="logoGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        fill={theme === 'dark' ? 'url(#logoGradientDark)' : 'url(#logoGradient)'} 
        className="drop-shadow-lg"
      />
      
      {/* Inner tech pattern */}
      <g fill="white" fillOpacity="0.9">
        {/* Central robot/AI symbol */}
        <rect x="18" y="16" width="12" height="8" rx="2" />
        <circle cx="20" cy="19" r="1.5" />
        <circle cx="28" cy="19" r="1.5" />
        <rect x="21" y="21" width="6" height="1" rx="0.5" />
        
        {/* Tech circuit lines */}
        <path d="M12 24h4m16 0h4M24 12v4m0 16v4" stroke="white" strokeWidth="2" strokeOpacity="0.6" fill="none" />
        <path d="M16 16l2 2m12-2l-2 2M16 32l2-2m12 2l-2-2" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
        
        {/* Data nodes */}
        <circle cx="12" cy="24" r="2" fillOpacity="0.7" />
        <circle cx="36" cy="24" r="2" fillOpacity="0.7" />
        <circle cx="24" cy="12" r="2" fillOpacity="0.7" />
        <circle cx="24" cy="36" r="2" fillOpacity="0.7" />
      </g>
      
      {/* Animated pulse effect */}
      <circle 
        cx="24" 
        cy="24" 
        r="20" 
        fill="none" 
        stroke="white" 
        strokeWidth="0.5" 
        strokeOpacity="0.3"
        className="animate-pulse"
      />
    </svg>
  );

  // Text only version
  const TextLogo = () => (
    <span className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent ${textSizes[size]} ${className}`}>
      AutoPortfolio
    </span>
  );

  // Full logo with icon and text
  const FullLogo = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      <IconSVG />
      <TextLogo />
    </div>
  );

  switch (variant) {
    case 'icon':
      return <IconSVG />;
    case 'text':
      return <TextLogo />;
    case 'full':
    default:
      return <FullLogo />;
  }
}

// Export individual components for flexibility
export const AutoPortfolioIcon = (props: Omit<AutoPortfolioLogoProps, 'variant'>) => 
  <AutoPortfolioLogo {...props} variant="icon" />;

export const AutoPortfolioText = (props: Omit<AutoPortfolioLogoProps, 'variant'>) => 
  <AutoPortfolioLogo {...props} variant="text" />;