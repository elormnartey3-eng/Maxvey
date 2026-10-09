import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base font-black tracking-tight',
    md: 'text-xl font-black tracking-tighter',
    lg: 'text-2xl font-black tracking-tighter',
    xl: 'text-4xl font-black tracking-tighter',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official MAXVEY Bubble M¥ Monogram */}
      <div className={`relative shrink-0 flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-200 hover:scale-105"
        >
          {/* Outer Black Border Bubble */}
          <path
            d="M 50 25 C 22 25 10 45 10 75 C 10 115 26 140 52 140 C 68 140 82 130 92 115 C 98 132 115 140 140 140 C 172 140 190 115 190 82 C 190 50 174 25 145 25 C 128 25 114 34 105 48 C 98 33 80 25 50 25 Z"
            fill="#000000"
            stroke="#ffffff"
            strokeWidth="5"
          />
          {/* Inner White Body of 'M' */}
          <path
            d="M 46 36 C 28 36 22 50 22 75 C 22 108 34 128 52 128 C 65 128 75 118 80 102 C 82 96 85 96 87 102 C 92 118 100 128 100 128 C 94 92 90 60 76 44 C 68 36 56 36 46 36 Z"
            fill="#ffffff"
          />
          {/* Inner Highlight of 'M' */}
          <ellipse cx="40" cy="55" rx="10" ry="16" fill="#f4f4f5" />
          <path
            d="M 33 46 Q 38 42 45 44"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Inner Body of '¥' (Y with double crossbar) */}
          <path
            d="M 125 46 C 120 40 130 36 140 36 C 160 36 178 50 178 78 C 178 105 162 128 142 128 C 128 128 120 118 120 102 C 120 90 125 80 132 72 L 138 65 C 130 55 125 48 125 46 Z"
            fill="#ffffff"
          />
          {/* Double crossbar cuts for Japanese/Yen symbol style ¥ */}
          <rect x="118" y="76" width="46" height="10" rx="5" fill="#000000" />
          <rect x="122" y="78" width="38" height="6" rx="3" fill="#ffffff" />
          <rect x="116" y="96" width="48" height="10" rx="5" fill="#000000" />
          <rect x="120" y="98" width="40" height="6" rx="3" fill="#ffffff" />

          {/* Bubble reflection highlight on ¥ */}
          <ellipse cx="152" cy="54" rx="8" ry="12" fill="#f4f4f5" />
          <path
            d="M 148 47 Q 154 44 158 48"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-heading uppercase text-white tracking-widest ${textSizes[size]}`}>
          MAXVEY<span className="text-[#dc2626]">.</span>
        </span>
      )}
    </div>
  );
};
