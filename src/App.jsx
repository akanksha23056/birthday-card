import React, { useState, useEffect, useRef, Component } from 'react';
import Hero from './components/Hero';
import DiaryBook from './components/DiaryBook';

// Error Boundary component to prevent blank white screens on mobile browsers
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Mobile app error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 bg-[#FFF0F2] text-center font-sans">
          <h2 className="text-2xl font-bold text-rose-600 mb-2 font-handwriting">happy birthday sonam! 💖</h2>
          <p className="text-gray-700 text-sm mb-4">{this.state.error?.toString()}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-rose-500 text-white rounded-lg font-bold shadow-md cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const bgMusicRef = useRef(null);

  useEffect(() => {
    // Pure HTML5 Audio for 100% mobile compatibility across iOS Safari & Android Chrome
    const audio = new Audio('/song.mp3');
    audio.loop = true;
    audio.volume = 1.0;
    bgMusicRef.current = audio;

    const playAudio = () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.play().catch((err) => {
          console.log('Mobile autoplay deferred until user gesture:', err);
        });
      }
    };

    // Attempt direct play immediately
    playAudio();

    // Trigger on any first mobile gesture (touch, scroll, click)
    const handleGesture = () => {
      playAudio();
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('click', handleGesture);
    };

    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('scroll', handleGesture, { passive: true });
    window.addEventListener('click', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('click', handleGesture);
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);

    if (bgMusicRef.current) {
      if (nextState) {
        bgMusicRef.current.volume = 1.0;
        bgMusicRef.current.play().catch(e => console.log(e));
      } else {
        bgMusicRef.current.pause();
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF0F2] text-[#2C1E1B] selection:bg-rose-200 selection:text-brand-dark overflow-x-hidden font-sans">
      
      {/* Fixed Audio Controller (Floats in top right corner of screen) */}
      <button 
        onClick={toggleAudio}
        className="fixed top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-md shadow-lg border border-rose-200 hover:border-rose-300 hover:bg-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 scale-100 hover:scale-105 active:scale-95"
        title={audioEnabled ? "Mute background music" : "Play song.mp3"}
      >
        {audioEnabled ? (
          <div className="flex items-center gap-2 px-1">
            <svg className="w-5 h-5 text-rose-500 fill-current animate-bounce" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <span className="font-handwriting text-sm text-rose-500 font-bold hidden sm:inline select-none">
              Music Playing 🎵
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-1">
            <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
              <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.03c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
            <span className="font-handwriting text-sm text-gray-400 font-bold hidden sm:inline select-none">Music Muted</span>
          </div>
        )}
      </button>

      {/* ACT 1: maximalist Pinterest-style Hero banner */}
      <Hero />

      {/* ACT 2 & TRANSITION: GSAP Pinned 3D book flipping diary */}
      <DiaryBook audioEnabled={audioEnabled} />

      {/* Footer credits / small signature */}
      <footer className="w-full py-10 bg-[#FDFBF7] text-center border-t border-rose-100 flex flex-col items-center justify-center gap-2 select-none">
        <p className="font-handwriting text-xl text-brand-dark/50">
          made with 💖 for Sonam
        </p>
        <p className="text-xs text-brand-dark/30 font-sans tracking-wide">
          © {new Date().getFullYear()} — All chapters preserved forever.
        </p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
