import { useState } from 'react';
import { useApp } from '../context/AppContext';

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s7-2 5 10c-2-4-5-5-5-5s5 2 3 9c-2-6-6-7-6-7 4 2 4 6 4 6-4-4-9-3-9-3z"/>
  </svg>
);

export default function SplashScreen() {
  const { navigate } = useApp();
  const [leaving, setLeaving] = useState(false);

  const handleViewMenu = () => {
    if (leaving) return;
    setLeaving(true);
    // Wait for the exit animation to finish, then switch screens
    setTimeout(() => navigate('menu', 'splash'), 460);
  };

  return (
    <div className="relative flex flex-col h-full bg-forest items-center justify-center px-8 text-center select-none">

      {/* All content fades out together on exit */}
      <div className={leaving ? 'splash-exit' : ''}>
        {/* Leaf icon — scales up first */}
        <div className="splash-leaf w-20 h-20 text-moss mx-auto mb-1">
          <LeafIcon />
        </div>

        {/* App name */}
        <h1
          className="splash-title text-white font-extrabold tracking-tight mt-4"
          style={{ fontSize: '3rem', lineHeight: 1.05 }}
        >
          Harvest
        </h1>

        {/* Decorative divider */}
        <div
          className="splash-divider h-0.5 bg-moss/50 rounded-full mt-5 mb-5 mx-auto"
          style={{ width: '3rem' }}
        />

        {/* Slogan — two lines, staggered */}
        <p className="splash-slogan-1 text-moss font-semibold text-xl leading-snug">
          Healthy Food That
        </p>
        <p className="splash-slogan-2 text-moss font-semibold text-xl leading-snug">
          Nourishes the Soul
        </p>

        {/* Subtle subline */}
        <p className="splash-tagline text-white/40 text-xs font-medium tracking-widest uppercase mt-3">
          Fresh · Local · Independent
        </p>

        {/* CTA */}
        <div className="splash-btn mt-14">
          <button
            onClick={handleViewMenu}
            className="bg-moss text-forest font-bold text-base px-10 py-4 rounded-2xl
                       shadow-[0_4px_24px_rgba(151,188,98,0.35)]
                       active:scale-[0.96] transition-transform duration-100
                       flex items-center gap-2 mx-auto"
          >
            <span>View Menu</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Ambient ghost leaves — outside the exiting container so they linger */}
      <div className="absolute top-10 right-6 w-8 h-8 text-moss/10 pointer-events-none">
        <LeafIcon />
      </div>
      <div
        className="absolute bottom-16 left-5 w-12 h-12 text-moss/10 pointer-events-none"
        style={{ transform: 'rotate(45deg)' }}
      >
        <LeafIcon />
      </div>
      <div
        className="absolute top-1/3 left-3 w-6 h-6 text-moss/[0.08] pointer-events-none"
        style={{ transform: 'rotate(-30deg)' }}
      >
        <LeafIcon />
      </div>
    </div>
  );
}
