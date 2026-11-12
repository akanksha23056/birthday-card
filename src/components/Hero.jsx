import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { heroContent } from '../content';

// Inline SVG Doodle Components
const SparkleSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="#D4AF37" stroke="#B3922E" strokeWidth="1" />
  </svg>
);

const HeartSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#F43F5E" stroke="#E11D48" strokeWidth="1" />
  </svg>
);

const RibbonSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4H90L95 12L90 20H10L5 12L10 4Z" fill="#FBCFE8" stroke="#F472B6" strokeWidth="1" />
    <path d="M15 8H85" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

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

export const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getParallaxStyle = (factor) => ({
    x: mousePos.x * factor,
    y: mousePos.y * factor,
  });

  const floatTransition = (delay = 0, duration = 4) => ({
    y: {
      duration: duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay: delay
    },
    opacity: { duration: 0.8, ease: "easeOut" },
    scale: { duration: 0.8, ease: "easeOut" }
  });

  const floatVariants = {
    animate: (custom = {}) => ({
      y: [0, -8, 0],
      transition: floatTransition(custom.delay, custom.duration)
    }),
    initial: { opacity: 0, scale: 0.8 }
  };

  return (
    <section 
      className="relative w-full min-height-[100vh] h-screen overflow-hidden flex flex-col items-center justify-center bg-[#FFF0F2] bg-paper paper-grain select-none border-b border-rose-100"
      style={{
        backgroundImage: "url('/images/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Subtle elements */}
      <div className="absolute inset-0 paper-grid opacity-25 pointer-events-none" />

      {/* COLLAGE ITEM 1: Polaroid Top Left */}
      <motion.div 
        className="absolute top-[8%] left-[8%] md:top-[12%] md:left-[15%] z-20 hidden sm:block pointer-events-auto"
        custom={{ delay: 0.2, duration: 4.5 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(30)}
      >
        <div className="relative p-3 bg-white shadow-xl border border-rose-50 flex flex-col items-center rotate-[-8deg] w-40 md:w-52">
          {/* Washi tape overlay */}
          <div className="absolute -top-3 left-[25%] w-16 h-5 washi-pattern-1 border border-pink-300/20 torn-edges rotate-[5deg] z-30" />
          <div className="w-full aspect-square bg-[#FAF7F0] overflow-hidden border border-gray-100 flex items-center justify-center p-2">
            <SafeSticker src="/images/stickers/lily_1.png" alt="Lily flower" className="w-full h-full object-contain" />
          </div>
          <span className="mt-2 font-handwriting text-base text-brand-dark/80">our happy place 💖</span>
        </div>
      </motion.div>

      {/* COLLAGE ITEM 2: Polaroid Bottom Right */}
      <motion.div 
        className="absolute bottom-[12%] right-[8%] md:bottom-[15%] md:right-[15%] z-20 hidden sm:block pointer-events-auto"
        custom={{ delay: 0.5, duration: 5 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(-25)}
      >
        <div className="relative p-3 bg-white shadow-xl border border-rose-50 flex flex-col items-center rotate-[6deg] w-40 md:w-52">
          {/* Washi tape overlay */}
          <div className="absolute -top-3 right-[20%] w-16 h-5 washi-pattern-2 border border-yellow-400/20 torn-edges rotate-[-8deg] z-30" />
          <div className="w-full aspect-square bg-[#FAF7F0] overflow-hidden border border-gray-100 flex items-center justify-center p-2">
            <SafeSticker src="/images/stickers/cake_1.png" alt="Birthday cake" className="w-full h-full object-contain animate-pulse" />
          </div>
          <span className="mt-2 font-handwriting text-base text-brand-dark/80">sweetest memories 🎂</span>
        </div>
      </motion.div>

      {/* COLLAGE ITEM 3: Sticky Note Top Right */}
      <motion.div 
        className="absolute top-[10%] right-[10%] md:top-[15%] md:right-[20%] z-10 pointer-events-auto"
        custom={{ delay: 0.8, duration: 4.8 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(15)}
      >
        <div className={`p-4 ${heroContent.stickyNotes[1].color} shadow-md rotate-[8deg] w-36 md:w-44 aspect-square flex flex-col justify-between torn-edges font-handwriting border border-pink-200/50`}>
          <div className="w-4 h-4 bg-gray-400/20 rounded-full mx-auto mb-1 border border-gray-400/40" />
          <p className="text-lg md:text-xl text-[#4C3B30] text-center my-auto leading-tight">{heroContent.stickyNotes[1].text}</p>
          <div className="text-right text-xs text-rose-500/60 font-sans font-bold">xoxo</div>
        </div>
      </motion.div>

      {/* COLLAGE ITEM 4: Sticky Note Bottom Left */}
      <motion.div 
        className="absolute bottom-[10%] left-[8%] md:bottom-[18%] md:left-[18%] z-10 pointer-events-auto"
        custom={{ delay: 0.1, duration: 5.2 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(-18)}
      >
        <div className={`p-4 ${heroContent.stickyNotes[0].color} shadow-md rotate-[-6deg] w-36 md:w-44 aspect-square flex flex-col justify-between torn-edges font-handwriting border border-yellow-200/50`}>
          <div className="w-8 h-4 bg-yellow-400/30 -mt-2 -ml-2 self-start rotate-[-15deg] border border-yellow-300/30" />
          <p className="text-lg md:text-xl text-[#5C4B30] text-center my-auto leading-tight">{heroContent.stickyNotes[0].text}</p>
          <div className="text-center"><HeartSVG className="w-4 h-4 inline-block text-rose-500 animate-pulse" /></div>
        </div>
      </motion.div>

      {/* COLLAGE ITEM 5: Custom Extracted Stickers (Scattered) */}
      
      {/* Lily 2 floating top left of title */}
      <motion.div 
        className="absolute top-[28%] left-[26%] z-20 pointer-events-none"
        custom={{ delay: 0.4, duration: 3.8 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(40)}
      >
        <SafeSticker src="/images/stickers/lily_2.png" alt="Lily 2" className="w-12 h-12 md:w-16 md:h-16" rotation={-15} />
      </motion.div>

      {/* Fallback stickers from stickers.png (if they exist) */}
      <motion.div 
        className="absolute top-[20%] left-[45%] z-20 pointer-events-none hidden md:block"
        custom={{ delay: 0.7, duration: 4.2 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(25)}
      >
        <SafeSticker src="/images/stickers/stickers_1.png" alt="Custom Sticker 1" className="w-14 h-14" rotation={10} />
      </motion.div>

      <motion.div 
        className="absolute bottom-[20%] right-[25%] z-20 pointer-events-none"
        custom={{ delay: 0.5, duration: 4.6 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(-30)}
      >
        <SafeSticker src="/images/stickers/stickers_2.png" alt="Custom Sticker 2" className="w-16 h-16" rotation={-20} />
      </motion.div>

      {/* Sparkle top right of title */}
      <motion.div 
        className="absolute top-[24%] right-[26%] z-20 pointer-events-none"
        custom={{ delay: 0.9, duration: 3.5 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(35)}
      >
        <SparkleSVG className="w-8 h-8 md:w-12 md:h-12 rotate-[20deg] animate-pulse" />
      </motion.div>

      {/* Heart near the center bottom of title */}
      <motion.div 
        className="absolute bottom-[26%] left-[32%] z-20 pointer-events-none"
        custom={{ delay: 0.6, duration: 4.2 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(20)}
      >
        <HeartSVG className="w-8 h-8 md:w-10 md:h-10 rotate-[12deg]" />
      </motion.div>

      {/* Lily 1 miniature bottom-right of title */}
      <motion.div 
        className="absolute bottom-[28%] right-[32%] z-20 pointer-events-none"
        custom={{ delay: 0.3, duration: 4.7 }}
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={getParallaxStyle(-22)}
      >
        <SafeSticker src="/images/stickers/lily_1.png" alt="Lily mini" className="w-10 h-10 md:w-14 md:h-14" rotation={-25} />
      </motion.div>

      {/* MAIN HERO TITLE */}
      <div className="relative px-6 py-12 flex flex-col items-center justify-center max-w-3xl text-center z-30 pointer-events-none">
        
        {/* Decorative banner tape above header */}
        <motion.div 
          className="mb-4 w-44 md:w-60 h-6 opacity-85"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <RibbonSVG className="w-full h-full" />
        </motion.div>

        {/* Playful Scrapbook rotated title */}
        <h1 className="relative font-bubble text-5xl sm:text-7xl md:text-8xl text-brand-dark tracking-wide rotate-[-3deg] select-none select-text">
          <span className="absolute inset-0 text-white translate-x-[4px] translate-y-[4px] blur-[1px] select-none pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
            happy birthday sonam!
          </span>
          <span className="absolute inset-0 text-rose-200 translate-x-[2px] translate-y-[2px] select-none pointer-events-none">
            happy birthday sonam!
          </span>
          <span className="relative text-brand-dark">
            happy birthday sonam!
          </span>
        </h1>

        {/* Curly highlight doodle under title */}
        <svg className="w-48 sm:w-72 md:w-96 h-6 mt-4 text-brand-gold opacity-80" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M5 15C50 5 150 5 295 15C190 12 90 18 10 12" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
        </svg>

        {/* Small subtitle sticker */}
        <p className="mt-8 font-handwriting text-2xl md:text-3xl text-brand-dark/70 rotate-[2deg]">
          open the diary to see our story... 📖
        </p>
      </div>

      {/* BOUNCING SCROLL DOWN INDICATOR */}
      <div className="absolute bottom-6 flex flex-col items-center justify-center font-handwriting text-lg text-brand-dark/60 z-35 animate-bounce">
        <span>open my diary</span>
        <svg className="w-5 h-5 mt-1 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>

    </section>
  );
};

export default Hero;
