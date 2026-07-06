import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { menuItems } from '../data/menu';
import Header from '../components/Header';

const CATEGORIES = ['Sandwiches', 'Smoothies', 'Snacks'];
const CAT_KEY = { Sandwiches: 'sandwiches', Smoothies: 'smoothies', Snacks: 'snacks' };

// Base animation config shared across all reveal elements
const REVEAL = {
  animationName: 'menu-reveal',
  animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
  animationFillMode: 'both',
};

function revealStyle(delaySec, durationSec = 0.7) {
  return {
    ...REVEAL,
    animationDuration: `${durationSec}s`,
    animationDelay: `${delaySec}s`,
  };
}

function ItemCard({ item, onPress, style }) {
  return (
    <button
      onClick={() => onPress(item)}
      style={style}
      className="w-full bg-white rounded-2xl shadow-sm border border-cream-dark p-3.5 flex items-center gap-3 text-left active:scale-[0.97] transition-transform duration-100"
    >
      <div
        className="w-[60px] h-[60px] flex-shrink-0 rounded-xl flex items-center justify-center text-3xl"
        style={{ backgroundColor: item.bgColor }}
      >
        {item.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
              <span className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</span>
              {item.seasonal && (
                <span className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0">
                  {item.seasonEmoji ?? '🌱'} {item.seasonLabel ?? 'Spring Menu'}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs leading-snug line-clamp-2 pr-1">{item.description}</p>
            {item.dietaryTags?.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {item.dietaryTags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] text-forest bg-moss/10 px-1.5 py-0.5 rounded-full font-medium capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="text-forest font-bold text-sm flex-shrink-0">${item.price.toFixed(2)}</span>
        </div>
      </div>
    </button>
  );
}

export default function MenuScreen() {
  const { openItem, cartCount, cartTotal, navigate, prevScreen } = useApp();
  const [activeCategory, setActiveCategory] = useState('Sandwiches');

  // Only animate in on the very first visit (from splash).
  // Once animations complete, clear the flag so tab-switching is instant.
  const [animating, setAnimating] = useState(prevScreen === 'splash');
  useEffect(() => {
    if (!animating) return;
    // Last item finishes at ~1.9 s; clear flag with a small buffer
    const t = setTimeout(() => setAnimating(false), 2200);
    return () => clearTimeout(t);
  }, []); // intentionally run once on mount

  const items = menuItems[CAT_KEY[activeCategory]] || [];

  // Stagger timing (seconds)
  const tabsDelay      = 0.15;
  const firstItemDelay = 0.38;
  const itemStep       = 0.18;

  return (
    <div className="flex flex-col h-full relative">
      {/* Header is always instant — same green as splash, feels continuous */}
      <Header />

      {/* Category tabs */}
      <div
        className="bg-white border-b border-cream-dark flex-shrink-0"
        style={animating ? revealStyle(tabsDelay, 0.65) : undefined}
      >
        <div className="flex">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeCategory === cat ? 'text-forest' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-forest rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Items — each card slides up individually */}
      <div className="flex-1 overflow-y-auto phone-scroll pb-28">
        <div className="p-4 space-y-3">
          {items.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              onPress={openItem}
              style={animating ? revealStyle(firstItemDelay + index * itemStep) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Sticky cart bar */}
      {cartCount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10 bg-gradient-to-t from-cream via-cream/90 to-transparent pointer-events-none">
          <button
            onClick={() => navigate('cart', 'menu')}
            className="pointer-events-auto w-full bg-forest text-white rounded-2xl py-4 font-semibold flex items-center justify-between px-5 shadow-xl active:scale-[0.98] transition-transform duration-100"
          >
            <span className="bg-moss text-forest text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
            <span className="text-base font-bold">View Cart</span>
            <span className="font-bold">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
