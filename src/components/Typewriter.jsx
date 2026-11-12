import React, { useState, useEffect, useRef } from 'react';

// Web Audio API Typewriter Click Sound Synthesizer
// Completely self-contained, no external MP3 dependencies, 100% reliable!
const playClickSound = (char, audioCtxRef) => {
  try {
    // Lazy initialize or reuse AudioContext
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended (browser security policies)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Vary pitch based on space vs normal key for high realism
    if (char === ' ' || char === '<br/>') {
      // Space/Enter click: lower, duller thud
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100 + Math.random() * 50, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else {
      // Standard key strike: sharp click with bandpass filter
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150 + Math.random() * 100, ctx.currentTime + 0.04);
      
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 3;
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    console.warn('Web Audio API click sound could not play:', e);
  }
};

// Bell Sound Synthesizer for typewriter completion (Ding!)
const playBellSound = (audioCtxRef) => {
  try {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Classic typewriter bell frequency around 1500Hz - 1800Hz
    osc.frequency.setValueAtTime(1600, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Bell sound error:', e);
  }
};

export const Typewriter = ({ text, signature, trigger = false, audioEnabled = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const audioCtxRef = useRef(null);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  // Pre-parse text to separate characters from <br/> tags
  const chunksRef = useRef([]);
  useEffect(() => {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
      if (text.substring(i, i + 5) === '<br/>') {
        chunks.push('<br/>');
        i += 5;
      } else {
        chunks.push(text[i]);
        i += 1;
      }
    }
    chunksRef.current = chunks;
  }, [text]);

  useEffect(() => {
    if (!trigger) {
      // Reset if untriggered (user scrolled away)
      setDisplayedText('');
      setShowSignature(false);
      setIsTypingComplete(false);
      indexRef.current = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (indexRef.current > 0 || isTypingComplete) return; // Already running or finished

    const startTyping = () => {
      timerRef.current = setInterval(() => {
        const chunks = chunksRef.current;
        const currentIndex = indexRef.current;

        if (currentIndex < chunks.length) {
          const char = chunks[currentIndex];
          setDisplayedText(prev => prev + char);
          
          if (audioEnabled) {
            playClickSound(char, audioCtxRef);
          }
          
          indexRef.current += 1;
        } else {
          // Finished typing message
          clearInterval(timerRef.current);
          setIsTypingComplete(true);
          
          if (audioEnabled) {
            playBellSound(audioCtxRef);
          }
          
          // Delay signature fade-in slightly
          setTimeout(() => {
            setShowSignature(true);
          }, 800);
        }
      }, 35); // 35ms per character typing speed
    };

    // Tiny buffer before typing starts
    const startDelay = setTimeout(startTyping, 500);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [trigger, audioEnabled, isTypingComplete]);

  return (
    <div className="w-full flex flex-col justify-between h-full font-handwriting text-[#2C1E1B]">
      
      {/* Typewriter message section */}
      <div className="flex-grow select-text leading-[28px] paper-lined text-lg sm:text-xl md:text-2xl text-left max-h-[85%] overflow-y-auto pr-1">
        <span dangerouslySetInnerHTML={{ __html: displayedText }} />
        
        {/* Blinking Cursor */}
        {!isTypingComplete && (
          <span className="inline-block w-1.5 h-5 ml-1 bg-[#2C1E1B] animate-[ping_0.8s_infinite] vertical-align-middle" style={{ verticalAlign: 'middle' }} />
        )}
      </div>

      {/* Signature Section */}
      <div className="h-[12%] flex items-center justify-center mt-2 border-t border-rose-100/50 pt-2 z-10">
        {showSignature && (
          <div className="animate-[fadeIn_1.2s_ease-out_forwards] flex flex-col items-center gap-1 select-none">
            <span className="text-xl sm:text-2xl md:text-3xl text-brand-gold font-bold rotate-[-2deg]">
              {signature}
            </span>
            <span className="text-xs text-rose-400 font-sans tracking-widest uppercase animate-pulse">
              Happy Birthday Sonam!
            </span>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Typewriter;
