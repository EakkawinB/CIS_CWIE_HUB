import React, { useState } from 'react';

interface CISLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
}

const CANDIDATES = [
  "/images (2).png",
  "/images%20(2).png",
  "images%20(2).png",
  "images (2).png",
  "/assets/images (2).png",
  "/assets/images%20(2).png"
];

export default function CISLogo({ className = '', size = 'md', showText = true }: CISLogoProps) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const showFallbackSvg = candidateIndex >= CANDIDATES.length;

  // Determine pixel sizes
  let width = 48;
  let height = 36;

  if (typeof size === 'number') {
    width = size;
    height = Math.round(size * 0.75);
  } else {
    switch (size) {
      case 'sm':
        width = 36;
        height = 27;
        break;
      case 'md':
        width = 48;
        height = 36;
        break;
      case 'lg':
        width = 64;
        height = 48;
        break;
      case 'xl':
        width = 96;
        height = 72;
        break;
    }
  }

  const handleImgError = () => {
    setCandidateIndex((prev) => prev + 1);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!showFallbackSvg ? (
        <img
          src={CANDIDATES[candidateIndex]}
          alt="CIS KMUTNB Logo"
          style={{ width: `${width}px`, height: 'auto', maxHeight: `${height * 1.5}px` }}
          className="shrink-0 object-contain"
          onError={handleImgError}
          referrerPolicy="no-referrer"
        />
      ) : (
        /* SVG rendering the precise CIS KMUTNB logo as a highly resilient fallback */
        <svg
          width={width}
          height={height}
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 animate-fade-in"
        >
          {/* Deep Maroon / Burgundy: #6B122C (KMUTNB CIS primary) */}
          {/* Vibrant Red: #E11D48 (KMUTNB CIS secondary / Atom ring) */}
          
          {/* Tilted Atom Orbital Ellipse in Red */}
          <g transform="translate(80, 52) rotate(-35) translate(-80, -52)">
            <ellipse
              cx="80"
              cy="52"
              rx="75"
              ry="45"
              stroke="#E11D48"
              strokeWidth="4"
              fill="none"
            />
            {/* Small red electron/atom bead on the orbit path with light glow */}
            <circle cx="80" cy="7" r="8" fill="#E11D48" />
            <circle cx="80" cy="7" r="3.5" fill="#FFFFFF" />
          </g>

          {/* CIS Double-stroke styled letters in Deep Burgundy with balanced uniform weights */}
          <g id="cis-letters" fill="none" stroke="#6B122C" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer stroke for 'C' */}
            <path
              d="M 64 28 C 45 28, 28 38, 28 58 C 28 78, 45 88, 64 88"
              strokeWidth="3.2"
            />
            {/* Inner stroke for 'C' */}
            <path
              d="M 60 36 C 49 36, 38 43, 38 58 C 38 73, 49 80, 60 80"
              strokeWidth="3.2"
            />

            {/* Outer double line for 'I' */}
            <line x1="75" y1="28" x2="75" y2="88" strokeWidth="3.2" />
            <line x1="84" y1="28" x2="84" y2="88" strokeWidth="3.2" />

            {/* Outer stroke for 'S' */}
            <path
              d="M 126 34 C 118 28, 98 26, 98 42 C 98 54, 126 52, 126 68 C 126 84, 108 88, 96 82"
              strokeWidth="3.2"
            />
            {/* Inner stroke for 'S' */}
            <path
              d="M 122 40 C 116 34, 104 33, 104 42 C 104 49, 120 48, 120 68 C 120 78, 108 81, 100 76"
              strokeWidth="3.2"
            />
          </g>

          {/* KMUTNB block text underneath */}
          <text
            x="78"
            y="110"
            fontFamily="'Inter', 'Helvetica Neue', sans-serif"
            fontWeight="900"
            fontSize="17.5"
            fill="#6B122C"
            letterSpacing="2.5"
            className="font-black"
          >
            KMUTNB
          </text>
        </svg>
      )}
      {showText && (
        <div className="flex flex-col text-left font-sans select-none">
          <span className="font-extrabold text-sm text-slate-900 leading-none">
            CIS CWIE Hub
          </span>
          <span className="text-[9px] font-bold text-slate-400 tracking-wide mt-0.5 uppercase">
            KMUTNB Department
          </span>
        </div>
      )}
    </div>
  );
}
