import React, { useState } from 'react';

// Graceful Sticker Image component that hides if the image file fails to load
const SafeSticker = ({ src, alt, className = "", rotation = 0, style = {} }) => {
  const [error, setError] = useState(false);
  if (error) return null;
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`object-contain pointer-events-none select-none ${className}`} 
      style={{ transform: `rotate(${rotation}deg)`, ...style }}
      onError={() => setError(true)} 
    />
  );
};

// Reusable Washi Tape component
export const WashiTape = ({ className = '', rotation = 0, style = {}, pattern = 1 }) => {
  const patternClass = pattern === 1 ? 'washi-pattern-1' : 'washi-pattern-2';
  return (
    <div 
      className={`absolute w-24 h-6 ${patternClass} border border-rose-300/10 shadow-sm opacity-80 torn-edges z-20 ${className}`} 
      style={{ 
        transform: `rotate(${rotation}deg)`,
        ...style 
      }}
    />
  );
};

// Reusable Polaroid Component
export const Polaroid = ({ src, alt, caption, rotation = 0, className = '' }) => {
  return (
    <div 
      className={`relative p-3 bg-white shadow-lg border border-gray-100 flex flex-col items-center select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape on top-left of the photo inside polaroid, or outside */}
      <WashiTape className="-top-3 left-[15%] w-16 h-5" rotation={-12} pattern={1} />
      
      <div className="relative w-full aspect-square bg-[#FCFBF7] overflow-hidden border border-gray-100/80 flex items-center justify-center">
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover grayscale-[10%] sepia-[10%] contrast-[95%]"
            loading="lazy"
            onError={(e) => {
              // Draw a cute placeholder with a heart if the photo fails to load / hasn't been added yet
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Placeholder Artwork (drawn when image is missing or errors out) */}
        <div className={`absolute inset-0 flex-col items-center justify-center bg-[#FAF6EE] text-rose-300 p-4 text-center ${src ? 'hidden' : 'flex'}`}>
          <svg className="w-10 h-10 mb-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-handwriting text-xs text-brand-dark/50">Add memory photo at {alt}</span>
        </div>
      </div>
      
      {caption && (
        <div className="mt-3 font-handwriting text-lg text-brand-dark/80 leading-none select-none">
          {caption}
        </div>
      )}
    </div>
  );
};

export const DiaryPage = ({ 
  pageNumber, 
  image, 
  imageAlt, 
  caption, 
  message, 
  bgColor = 'bg-[#FFFDF9]', 
  isLeft = false 
}) => {
  // Select doodles based on page number to make pages feel unique
  const renderDoodles = () => {
    switch (pageNumber) {
      case 1:
        return (
          <>
            <WashiTape className="top-4 right-4 w-20 h-5" rotation={15} pattern={2} />
            <SafeSticker src="/images/stickers/lily_1.png" alt="Flower doodle" className="absolute bottom-6 right-8 w-12 h-12 shadow-sm" rotation={-10} />
          </>
        );
      case 2:
        return (
          <>
            <WashiTape className="top-6 left-6 w-24 h-6" rotation={-8} pattern={1} />
            <SafeSticker src="/images/stickers/stickers_1.png" alt="Heart doodle" className="absolute bottom-6 right-8 w-12 h-12 shadow-sm" rotation={12} />
            <span className="absolute bottom-6 left-12 font-handwriting text-xs text-brand-dark/40 rotate-[5deg] border border-dashed border-gray-300 px-2 py-0.5 rounded">Coffee spill here ☕</span>
          </>
        );
      case 3:
        return (
          <>
            <SafeSticker src="/images/stickers/lily_2.png" alt="Star sparkle" className="absolute top-6 right-8 w-12 h-12 shadow-sm" rotation={15} />
            <WashiTape className="bottom-6 right-10 w-16 h-5" rotation={-25} pattern={2} />
          </>
        );
      case 4:
        return (
          <>
            <WashiTape className="top-4 right-12 w-20 h-5" rotation={8} pattern={1} />
            <SafeSticker src="/images/stickers/cake_1.png" alt="Mini cake sticker" className="absolute bottom-4 left-6 w-14 h-14 shadow-sm" rotation={12} />
          </>
        );
      case 5:
        return (
          <>
            <WashiTape className="top-8 left-8 w-24 h-5" rotation={12} pattern={2} />
            <SafeSticker src="/images/stickers/stickers_2.png" alt="Deco sticker" className="absolute bottom-8 right-8 w-14 h-14 shadow-sm" rotation={-8} />
            <span className="absolute bottom-8 left-8 font-handwriting text-xl text-yellow-600 rotate-[-8deg] font-bold">our favorite day! 🌴</span>
          </>
        );
      case 6:
        return (
          <>
            <SafeSticker src="/images/stickers/lily_1.png" alt="Lily flower" className="absolute top-4 right-4 w-12 h-12 shadow-sm" rotation={10} />
            <WashiTape className="bottom-8 left-10 w-20 h-5" rotation={-10} pattern={1} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden shadow-inner ${bgColor} bg-paper paper-grain border-r border-rose-100/50`}
    >
      {/* Spine highlight overlay on the binding edge */}
      <div 
        className={`absolute top-0 bottom-0 w-8 pointer-events-none opacity-40 z-10 ${
          isLeft 
            ? 'right-0 bg-gradient-to-l from-black/15 to-transparent' 
            : 'left-0 bg-gradient-to-r from-black/15 to-transparent'
        }`} 
      />

      {/* Scattered doodles */}
      {renderDoodles()}

      {/* Top Header Section */}
      <div className="flex justify-between items-center z-10">
        <span className="font-sans font-bold text-xs uppercase tracking-widest text-brand-dark/30">
          Memory Chapter
        </span>
        <span className="font-bubble text-brand-gold/70 text-sm font-bold">
          ★ ★ ★
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center gap-6 my-4 z-10">
        {/* Memory Polaroid */}
        <Polaroid 
          src={image} 
          alt={imageAlt} 
          caption={caption} 
          rotation={isLeft ? -4 : 4} 
          className="w-48 sm:w-56 md:w-64 max-w-full"
        />

        {/* Written Message */}
        <div className="relative w-full max-w-sm px-2 text-center">
          {/* Lined paper texture background just for the handwriting area */}
          <div className="paper-lined font-handwriting text-xl sm:text-2xl text-brand-dark/85 text-center leading-[28px] px-2 py-1 select-text">
            {message}
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex justify-between items-center mt-2 z-10">
        {isLeft ? (
          <span className="font-handwriting text-lg text-brand-dark/40 ml-2">p. {pageNumber}</span>
        ) : (
          <div />
        )}
        
        {/* Ribbon decoration at bottom of left pages or flowers on right */}
        {isLeft ? (
          <div className="w-12 h-1 bg-pink-100/60 rounded" />
        ) : (
          <span className="font-handwriting text-lg text-brand-dark/40 mr-2">p. {pageNumber}</span>
        )}
      </div>
    </div>
  );
};

export default DiaryPage;
