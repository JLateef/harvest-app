import { useRef } from 'react';
import { useApp } from '../context/AppContext';

const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s7-2 5 10c-2-4-5-5-5-5s5 2 3 9c-2-6-6-7-6-7 4 2 4 6 4 6-4-4-9-3-9-3z"/>
  </svg>
);

export default function Header({ showBack = false, title = null }) {
  const { navigate, prevScreen, punches, screen, resetDemo } = useApp();
  const longPressTimer = useRef(null);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(resetDemo, 2500);
  };
  const cancelLongPress = () => clearTimeout(longPressTimer.current);

  return (
    <div className="flex-shrink-0 bg-forest px-4 py-3 flex items-center justify-between gap-2">
      {/* Left: back button or spacer */}
      {showBack ? (
        <button
          onClick={() => navigate(prevScreen || 'menu')}
          className="w-8 h-8 flex items-center justify-center text-white rounded-full -ml-1 active:bg-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <div className="w-8" />
      )}

      {/* Center: logo or title */}
      {title ? (
        <h1 className="flex-1 text-center text-white font-semibold text-base tracking-tight">{title}</h1>
      ) : (
        <button
          className="flex items-center gap-1.5"
          onMouseDown={startLongPress}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
        >
          <LeafIcon className="w-5 h-5 text-moss" />
          <span className="text-white font-bold text-lg tracking-tight">Harvest</span>
        </button>
      )}

      {/* Right: rewards chip or spacer */}
      {screen === 'menu' ? (
        <button
          onClick={() => navigate('rewards', 'menu')}
          className="flex items-center gap-1 bg-white/10 border border-moss/40 rounded-full px-2.5 py-1 active:bg-white/20"
        >
          <LeafIcon className="w-3 h-3 text-moss" />
          <span className="text-moss text-xs font-semibold">{punches}/9</span>
        </button>
      ) : (
        <div className="w-14" />
      )}
    </div>
  );
}
