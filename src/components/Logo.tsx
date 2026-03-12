import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  className?: string;
  showMarkOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'light', className = '', showMarkOnly = false }) => {
  const colorClass = variant === 'gold' ? 'text-gold' : variant === 'light' ? 'text-white' : 'text-black';

  if (showMarkOnly) {
    return (
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${colorClass} ${className}`}
      >
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 60C40 55 60 40 85 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${colorClass} ${className}`}>
      <span className="font-serif text-3xl md:text-4xl tracking-[0.25em] leading-none">ÉLLISON</span>
      <span className="font-sans text-[7px] md:text-[9px] tracking-[0.6em] font-bold mt-3 opacity-90 uppercase">BEAUTY ROOM</span>
    </div>
  );
};
