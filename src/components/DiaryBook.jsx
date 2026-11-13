import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { diaryPages, finalSpread } from '../content';
import DiaryPage from './DiaryPage';
import Typewriter from './Typewriter';

gsap.registerPlugin(ScrollTrigger);

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

export const DiaryBook = ({ audioEnabled = true }) => {
  const containerRef = useRef(null);
  const bookRef = useRef(null);
  const wrapperRef = useRef(null);
  const leftCoverRef = useRef(null);
  
  const sheetsRef = useRef([]);
  const mobilePagesRef = useRef([]);
  
  const [isMobile, setIsMobile] = useState(false);
  const [triggerTypewriter, setTriggerTypewriter] = useState(false);

  // Resize handler to toggle between single-page mobile layout and double-page desktop layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Kill existing ScrollTriggers to prevent duplicates on resize/re-render
    const triggers = ScrollTrigger.getAll();
    triggers.forEach(t => t.kill());

    const ctx = gsap.context(() => {
      if (isMobile) {
        // ==========================================
        // MOBILE ANIMATION: 8 FLIPS (9 Pages stack)
        // ==========================================
        const pages = mobilePagesRef.current.filter(Boolean);
        if (pages.length === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=5000", // 5000px scroll journey
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              // Trigger typewriter at the very end of the scroll scrub
              if (self.progress >= 0.96) {
                setTriggerTypewriter(true);
              } else {
                setTriggerTypewriter(false);
              }
            }
          }
        });

        // Setup initial styles for mobile stack
        pages.forEach((page, i) => {
          gsap.set(page, {
            rotationY: 0,
            zIndex: 50 - i,
            display: "block",
            transformOrigin: "left center"
          });
        });

        // Animate each page flipping left off-screen sequentially
        pages.forEach((page, i) => {
          if (i < pages.length - 1) {
            // Flip page
            tl.to(page, {
              rotationY: -180,
              ease: "power1.inOut",
              duration: 1,
            }, i);

            // Shadow sweep overlay for page curl realism
            const shadow = page.querySelector('.shadow-overlay');
            if (shadow) {
              tl.fromTo(shadow, 
                { opacity: 0 }, 
                { opacity: 0.3, ease: "power1.in", duration: 0.5 }, 
                i
              );
              tl.to(shadow, 
                { opacity: 0, ease: "power1.out", duration: 0.5 }, 
                i + 0.5
              );
            }

            // Hide page completely once flipped to save rendering and prevent click intercepts
            tl.set(page, { display: "none" }, i + 0.99);
          }
        });

      } else {
        // ==========================================
        // DESKTOP ANIMATION: 4 FLIPS (5 Sheets stack)
        // ==========================================
        const sheets = sheetsRef.current.filter(Boolean);
        if (sheets.length === 0) return;

        const bookWidth = bookRef.current.offsetWidth || 900;
        const shiftX = bookWidth / 4; // Shift amount to center closed cover

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=4000", // 4000px scroll journey
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              if (self.progress >= 0.96) {
                setTriggerTypewriter(true);
              } else {
                setTriggerTypewriter(false);
              }
            }
          }
        });

        // Set initial positions and rotations
        gsap.set(sheets, { rotationY: 0, transformOrigin: "left center" });
        
        // Stacking order: Sheet 0 is top right, Sheet 3 is bottom
        sheets.forEach((sheet, i) => {
          gsap.set(sheet, { zIndex: 20 - i });
        });

        // Left cover starts invisible (closed book) and fades in as cover opens
        tl.fromTo(leftCoverRef.current, 
          { opacity: 0 }, 
          { opacity: 1, ease: "none", duration: 1 }, 
          0
        );

        // Slide the book container from center to left as it opens to maintain screen balance
        tl.fromTo(wrapperRef.current, 
          { x: shiftX }, 
          { x: 0, ease: "power1.inOut", duration: 1 }, 
          0
        );

        // Animate each sheet flip
        sheets.forEach((sheet, i) => {
          // Set sheet active z-index during flip
          tl.set(sheet, { zIndex: 50 }, i);

          // Rotate sheet 0 to -180 degrees
          tl.to(sheet, {
            rotationY: -180,
            ease: "power1.inOut",
            duration: 1
          }, i);

          // Stacking order updates at the midpoint of the flip (-90 degrees)
          tl.set(sheet, { zIndex: 10 + i }, i + 0.5);

          // Shadow sweep effects on front and back page faces
          const frontShadow = sheet.querySelector('.page-front .shadow-overlay');
          const backShadow = sheet.querySelector('.page-back .shadow-overlay');

          if (frontShadow) {
            tl.fromTo(frontShadow, 
              { opacity: 0 }, 
              { opacity: 0.25, ease: "power1.in", duration: 0.5 }, 
              i
            );
          }
          if (backShadow) {
            tl.fromTo(backShadow, 
              { opacity: 0.25 }, 
              { opacity: 0, ease: "power1.out", duration: 0.5 }, 
              i + 0.5
            );
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Desktop Sheets mapping:
  // Sheet 0: Front = Cover, Back = Page 1
  // Sheet 1: Front = Page 2, Back = Page 3
  // Sheet 2: Front = Page 4, Back = Page 5
  // Sheet 3: Front = Page 6, Back = Page 7 (Blank)
  // Base Right (static): Page 8 (Typewriter)
  
  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen flex items-center justify-center bg-gingham overflow-hidden"
    >
      {/* Flatlay desktop details for Pinterest atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Artistic Painterly Pastel Stickers scattered around the checkered picnic blanket */}
        
        {/* Top-Left Cluster */}
        <SafeSticker 
          src="/images/stickers/pastel_2_10.png" 
          alt="Vintage Teapot" 
          className="absolute top-[5%] left-[3%] w-24 md:w-34 h-auto hidden sm:block shadow-md hover:scale-105 transition-transform" 
          rotation={-18} 
        />
        <SafeSticker 
          src="/images/stickers/pastel_2_2.png" 
          alt="Cherries" 
          className="absolute top-[18%] left-[10%] w-22 md:w-28 h-auto hidden sm:block shadow-sm" 
          rotation={15} 
        />
        <SafeSticker 
          src="/images/stickers/lily_1.png" 
          alt="Lily Flower" 
          className="absolute top-[32%] left-[2%] w-20 md:w-28 h-auto hidden sm:block shadow-sm" 
          rotation={-25} 
        />

        {/* Bottom-Left Cluster */}
        <SafeSticker 
          src="/images/stickers/pastel_1_8.png" 
          alt="Picnic Basket" 
          className="absolute bottom-[5%] left-[3%] w-32 md:w-44 h-auto hidden sm:block shadow-lg" 
          rotation={10} 
        />
        <SafeSticker 
          src="/images/stickers/cake_1.png" 
          alt="Birthday Cake" 
          className="absolute bottom-[18%] left-[16%] w-28 md:w-36 h-auto hidden sm:block shadow-md" 
          rotation={-8} 
        />
        <SafeSticker 
          src="/images/stickers/pastel_2_1.png" 
          alt="Wild Honey Jar" 
          className="absolute bottom-[36%] left-[2%] w-20 md:w-26 h-auto hidden sm:block shadow-sm" 
          rotation={-15} 
        />

        {/* Top-Right Cluster */}
        <SafeSticker 
          src="/images/stickers/pastel_1_4.png" 
          alt="Pink Ribbon Bow" 
          className="absolute top-[5%] right-[5%] w-24 md:w-32 h-auto hidden sm:block shadow-md" 
          rotation={12} 
        />
        <SafeSticker 
          src="/images/stickers/pastel_2_3.png" 
          alt="Ornate Key" 
          className="absolute top-[20%] right-[12%] w-16 md:w-22 h-auto hidden sm:block shadow-sm" 
          rotation={-28} 
        />
        <SafeSticker 
          src="/images/stickers/pastel_1_5.png" 
          alt="Lavender Sprigs" 
          className="absolute top-[34%] right-[3%] w-20 md:w-28 h-auto hidden sm:block shadow-sm" 
          rotation={22} 
        />

        {/* Bottom-Right Cluster */}
        <SafeSticker 
          src="/images/stickers/pastel_2_11.png" 
          alt="Watering Can with Roses" 
          className="absolute bottom-[5%] right-[3%] w-30 md:w-40 h-auto hidden sm:block shadow-md" 
          rotation={-10} 
        />
        <SafeSticker 
          src="/images/stickers/pastel_1_3.png" 
          alt="Porcelain Teacup" 
          className="absolute bottom-[22%] right-[14%] w-24 md:w-32 h-auto hidden sm:block shadow-sm" 
          rotation={16} 
        />
        <SafeSticker 
          src="/images/stickers/pastel_1_6.png" 
          alt="Postage Stamp" 
          className="absolute bottom-[40%] right-[3%] w-18 md:w-24 h-auto hidden sm:block shadow-sm" 
          rotation={-12} 
        />

        {/* Center-Top & Center-Bottom Accents */}
        <SafeSticker 
          src="/images/stickers/pastel_2_15.png" 
          alt="Botanical Flower Journal" 
          className="absolute top-[3%] left-[42%] w-24 md:w-32 h-auto hidden md:block shadow-md" 
          rotation={-6} 
        />
        <SafeSticker 
          src="/images/stickers/pastel_1_7.png" 
          alt="Teddy Bear" 
          className="absolute bottom-[2%] left-[44%] w-20 md:w-28 h-auto hidden md:block shadow-sm" 
          rotation={8} 
        />

        {/* Flatlay handwritten notes */}
        <span className="absolute top-[3%] right-[22%] font-handwriting text-brand-dark/40 rotate-[15deg] text-lg hidden lg:block pointer-events-none select-none">
          love, memories, forever... ✏️
        </span>
        <span className="absolute bottom-[3%] left-[24%] font-handwriting text-brand-dark/40 rotate-[-12deg] text-lg hidden lg:block pointer-events-none select-none">
          happy 24th birthday! 🎂
        </span>
      </div>

      {isMobile ? (
        // ==========================================
        // MOBILE RENDER: Stack of Single Pages
        // ==========================================
        <div className="relative w-[90%] max-w-[340px] aspect-[2/3] bg-white rounded-lg shadow-xl preserve-3d perspective-container z-10">
          
          {/* Page 0: Cover */}
          <div 
            ref={el => mobilePagesRef.current[0] = el}
            className="absolute inset-0 rounded-lg overflow-hidden preserve-3d"
          >
            <div className="absolute inset-0 bg-[#E11D48] text-white p-6 flex flex-col justify-between items-center text-center shadow-lg border-2 border-[#BE123C] bg-cover bg-center select-none" style={{ backgroundImage: "url('/images/diary_closed.png')" }}>
              <div className="absolute inset-0 bg-rose-950/20 backdrop-brightness-[90%]" />
              <div className="w-full flex justify-between z-10">
                <span className="font-bubble text-yellow-300">★</span>
                <span className="font-bubble text-yellow-300">★</span>
              </div>
              <div className="z-10 bg-white/95 text-brand-dark p-6 rounded shadow-lg border-2 border-brand-gold rotate-[-2deg] my-auto">
                <h2 className="font-bubble text-3xl text-rose-500 leading-tight">Sonam's</h2>
                <h3 className="font-handwriting text-2xl text-brand-gold mt-1">Birthday Scrapbook</h3>
              </div>
              <div className="z-10 font-handwriting text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                scroll to open 📖
              </div>
            </div>
            {/* Shadows */}
            <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
          </div>

          {/* Pages 1 to 6 (Memories) */}
          {diaryPages.map((page, i) => (
            <div 
              key={page.pageNumber}
              ref={el => mobilePagesRef.current[i + 1] = el}
              className="absolute inset-0 rounded-lg overflow-hidden preserve-3d"
            >
              <DiaryPage 
                pageNumber={page.pageNumber}
                image={page.image}
                imageAlt={page.imageAlt}
                caption={page.caption}
                message={page.message}
                bgColor={page.bgColor}
                isLeft={false}
              />
              <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
            </div>
          ))}

          {/* Page 7: Framed 7th Photo before Finale */}
          <div 
            ref={el => mobilePagesRef.current[7] = el}
            className="absolute inset-0 rounded-lg overflow-hidden preserve-3d"
          >
            <div className="w-full h-full p-6 flex flex-col justify-between items-center bg-[#FFFDF9] bg-paper paper-grain shadow-inner">
              <div className="font-handwriting text-xl text-brand-dark/60 mt-2">One last memory before the letter... ✨</div>
              
              {/* Beautiful Polaroid Frame for 7th photo */}
              <div className="relative p-2.5 bg-white shadow-xl border border-gray-100 flex flex-col items-center rotate-[-2deg] max-w-[230px] my-auto">
                <div className="w-full aspect-[4/5] bg-[#FCFBF7] overflow-hidden border border-gray-100/80">
                  <img 
                    src="/images/photo-7.jpg" 
                    alt="Our favorite memory" 
                    className="w-full h-full object-cover grayscale-[5%] contrast-[95%]"
                    loading="eager"
                  />
                </div>
                <div className="mt-2.5 font-handwriting text-base text-brand-dark/80">
                  forever with you ❤️
                </div>
              </div>

              <div className="font-handwriting text-base text-brand-dark/40 mb-2">keep scrolling for your letter 💌</div>
            </div>
            <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
          </div>

          {/* Page 8: Grand Finale (Typewriter) */}
          <div 
            ref={el => mobilePagesRef.current[8] = el}
            className="absolute inset-0 rounded-lg overflow-hidden z-0"
          >
            <div className="w-full h-full p-6 flex flex-col bg-[#FFFDF9] bg-paper paper-grain shadow-inner relative">
              <Typewriter 
                text={finalSpread.message} 
                signature={finalSpread.signature} 
                trigger={triggerTypewriter}
                audioEnabled={audioEnabled}
              />
            </div>
          </div>

        </div>
      ) : (
        // ==========================================
        // DESKTOP RENDER: Double-Page Book Layout
        // ==========================================
        <div 
          ref={wrapperRef}
          className="relative w-[90%] max-w-[900px] aspect-[3/2] z-10 preserve-3d perspective-container"
        >
          {/* Static Book Back Spine & Cover underneath pages */}
          <div className="absolute w-[101%] h-[103%] -top-[1.5%] -left-[0.5%] bg-[#4C1A17] rounded-lg shadow-2xl border-4 border-[#3D1513] z-0 flex overflow-hidden pointer-events-none">
            {/* Spine seam */}
            <div className="absolute top-0 bottom-0 left-[50%] -translate-x-[2px] w-[4px] bg-black/60 shadow-lg" />
          </div>

          {/* Static Left Cover Inside Paste-Down (Starts invisible, fades in as book opens) */}
          <div 
            ref={leftCoverRef}
            className="absolute top-0 left-0 w-1/2 h-full bg-[#3D1513] rounded-l-lg shadow-inner z-1 overflow-hidden opacity-0 pointer-events-none"
          >
            {/* Stylized vintage inner lining */}
            <div className="w-full h-full bg-paper paper-grid opacity-15" />
          </div>

          {/* The Book Container itself */}
          <div ref={bookRef} className="relative w-full h-full preserve-3d z-10">

            {/* SHEET 0 (Cover / Page 1) */}
            <div 
              ref={el => sheetsRef.current[0] = el}
              className="absolute top-0 left-1/2 w-1/2 h-full preserve-3d z-10"
            >
              {/* Front Page: Closed Cover Design */}
              <div className="page-face page-front rounded-r-lg bg-red-800 text-white p-10 flex flex-col justify-between items-center text-center shadow-lg border-l border-red-950 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/images/diary_closed.png')" }}>
                {/* Washi tape overlays and gold latch details */}
                <div className="absolute inset-0 bg-rose-950/20 backdrop-brightness-[90%]" />
                
                {/* Cute diary label */}
                <div className="z-10 bg-white/95 text-brand-dark p-8 rounded-md shadow-2xl border-2 border-brand-gold rotate-[-3deg] my-auto max-w-[80%] flex flex-col items-center">
                  <h2 className="font-bubble text-4xl text-rose-500 tracking-wide">Sonam's</h2>
                  <h3 className="font-handwriting text-2xl text-brand-gold mt-1 font-bold">24th Birthday Scrapbook</h3>
                  <div className="w-8 h-8 rounded-full border border-pink-200 mt-4 flex items-center justify-center bg-rose-50">
                    <svg className="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
                    </svg>
                  </div>
                </div>

                {/* Lock Clasp graphic on the right edge */}
                <div className="absolute right-0 top-[45%] w-10 h-12 bg-amber-500/90 rounded-l-md border border-amber-600 shadow-md flex items-center justify-center z-20">
                  <div className="w-3 h-3 rounded-full bg-amber-800" />
                </div>
                
                <span className="z-10 font-handwriting text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  scroll down to open 📖
                </span>
                <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
              </div>

              {/* Back Page: Page 1 */}
              <div className="page-face page-back rounded-l-lg overflow-hidden">
                <DiaryPage 
                  pageNumber={1}
                  image={diaryPages[0].image}
                  imageAlt={diaryPages[0].imageAlt}
                  caption={diaryPages[0].caption}
                  message={diaryPages[0].message}
                  bgColor={diaryPages[0].bgColor}
                  isLeft={true}
                />
                <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
              </div>
            </div>

            {/* SHEET 1 (Page 2 / Page 3) */}
            <div 
              ref={el => sheetsRef.current[1] = el}
              className="absolute top-0 left-1/2 w-1/2 h-full preserve-3d z-9"
            >
              {/* Front: Page 2 */}
              <div className="page-face page-front rounded-r-lg overflow-hidden">
                <DiaryPage 
                  pageNumber={2}
                  image={diaryPages[1].image}
                  imageAlt={diaryPages[1].imageAlt}
                  caption={diaryPages[1].caption}
                  message={diaryPages[1].message}
                  bgColor={diaryPages[1].bgColor}
                  isLeft={false}
                />
                <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
              </div>
              {/* Back: Page 3 */}
              <div className="page-face page-back rounded-l-lg overflow-hidden">
                <DiaryPage 
                  pageNumber={3}
                  image={diaryPages[2].image}
                  imageAlt={diaryPages[2].imageAlt}
                  caption={diaryPages[2].caption}
                  message={diaryPages[2].message}
                  bgColor={diaryPages[2].bgColor}
                  isLeft={true}
                />
                <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
              </div>
            </div>

            {/* SHEET 2 (Page 4 / Page 5) */}
            <div 
              ref={el => sheetsRef.current[2] = el}
              className="absolute top-0 left-1/2 w-1/2 h-full preserve-3d z-8"
            >
              {/* Front: Page 4 */}
              <div className="page-face page-front rounded-r-lg overflow-hidden">
                <DiaryPage 
                  pageNumber={4}
                  image={diaryPages[3].image}
                  imageAlt={diaryPages[3].imageAlt}
                  caption={diaryPages[3].caption}
                  message={diaryPages[3].message}
                  bgColor={diaryPages[3].bgColor}
                  isLeft={false}
                />
                <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
              </div>
              {/* Back: Page 5 */}
              <div className="page-face page-back rounded-l-lg overflow-hidden">
                <DiaryPage 
                  pageNumber={5}
                  image={diaryPages[4].image}
                  imageAlt={diaryPages[4].imageAlt}
                  caption={diaryPages[4].caption}
                  message={diaryPages[4].message}
                  bgColor={diaryPages[4].bgColor}
                  isLeft={true}
                />
                <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
              </div>
            </div>

            {/* SHEET 3 (Page 6 / Page 7) */}
            <div 
              ref={el => sheetsRef.current[3] = el}
              className="absolute top-0 left-1/2 w-1/2 h-full preserve-3d z-7"
            >
              {/* Front: Page 6 */}
              <div className="page-face page-front rounded-r-lg overflow-hidden">
                <DiaryPage 
                  pageNumber={6}
                  image={diaryPages[5].image}
                  imageAlt={diaryPages[5].imageAlt}
                  caption={diaryPages[5].caption}
                  message={diaryPages[5].message}
                  bgColor={diaryPages[5].bgColor}
                  isLeft={false}
                />
                <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
              </div>
              {/* Back: Page 7 (Framed 7th Photo facing letter on Page 8) */}
              <div className="page-face page-back rounded-l-lg overflow-hidden">
                <div className="w-full h-full p-8 flex flex-col justify-between items-center bg-[#FFFDF9] bg-paper paper-grain">
                  <div className="font-handwriting text-2xl text-brand-dark/60 mt-2">
                    A special memory for you... ✨
                  </div>
                  
                  {/* Polaroid Frame for 7th photo */}
                  <div className="relative p-3 bg-white shadow-xl border border-gray-100 flex flex-col items-center rotate-[-3deg] max-w-[260px] my-auto">
                    <div className="w-full aspect-[4/5] bg-[#FCFBF7] overflow-hidden border border-gray-100/80">
                      <img 
                        src="/images/photo-7.jpg" 
                        alt="Special memory" 
                        className="w-full h-full object-cover grayscale-[5%] contrast-[95%]"
                        loading="eager"
                      />
                    </div>
                    <div className="mt-3 font-handwriting text-lg text-brand-dark/80">
                      forever with you ❤️
                    </div>
                  </div>
                  
                  <div className="font-handwriting text-lg text-brand-dark/30 select-none">
                    p. 7
                  </div>
                </div>
                <div className="shadow-overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-30" />
              </div>
            </div>

            {/* STATIC BASE RIGHT: Page 8 (Grand Finale - Typewriter) */}
            <div className="absolute top-0 left-1/2 w-1/2 h-full rounded-r-lg bg-[#FFFDF9] bg-paper paper-grain shadow-inner overflow-hidden z-0">
              {/* Spine shadow overlay */}
              <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/15 to-transparent pointer-events-none z-10" />
              
              {/* Typewriter message inside page */}
              <div className="w-full h-full p-8 relative flex flex-col justify-between select-none">
                <Typewriter 
                  text={finalSpread.message} 
                  signature={finalSpread.signature} 
                  trigger={triggerTypewriter}
                  audioEnabled={audioEnabled}
                />
                <div className="flex justify-between items-center text-xs mt-2 text-brand-dark/30 font-handwriting select-none">
                  <span />
                  <span>p. 8</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryBook;
