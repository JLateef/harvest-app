import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s7-2 5 10c-2-4-5-5-5-5s5 2 3 9c-2-6-6-7-6-7 4 2 4 6 4 6-4-4-9-3-9-3z"/>
  </svg>
);

function PunchCard({ displayPunches, totalPunches, animateNew }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {Array.from({ length: 9 }).map((_, i) => {
        const filled = i < displayPunches;
        const isNew = animateNew && i === totalPunches - 1 && filled;
        return (
          <div
            key={i}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              filled ? 'bg-forest' : 'bg-cream-dark border-2 border-gray-200'
            } ${isNew ? 'punch-new ring-2 ring-moss ring-offset-2' : ''}`}
          >
            {filled
              ? <LeafIcon className="w-5 h-5 text-moss" />
              : <LeafIcon className="w-4 h-4 text-gray-300" />
            }
          </div>
        );
      })}
    </div>
  );
}

export default function ConfirmationScreen() {
  const { cart, orderNumber, pickupTime, punches, clearCart, navigate } = useApp();
  const [showCheck, setShowCheck] = useState(false);
  const [displayPunches, setDisplayPunches] = useState(punches - 1);
  const [animateNew, setAnimateNew] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCheck(true), 150);
    const t2 = setTimeout(() => {
      setDisplayPunches(punches);
      setAnimateNew(true);
    }, 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [punches]);

  const subtotal = cart.reduce((s, i) => s + i.unitPrice, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const pickupLabel = pickupTime?.type === 'asap'
    ? `In ${pickupTime.label}`
    : `At ${pickupTime?.label}`;

  const handleBackToMenu = () => {
    clearCart();
    navigate('menu');
  };

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Status bar area — forest colored */}
      <div className="flex-shrink-0 bg-forest">
        {/* Confirmation hero */}
        <div className="py-8 px-6 text-center">
          {/* Animated checkmark */}
          <div
            className={`mx-auto w-20 h-20 rounded-full border-4 border-moss bg-moss/20 flex items-center justify-center mb-4 transition-none ${
              showCheck ? 'check-appear' : 'opacity-0 scale-50'
            }`}
          >
            <svg className="w-10 h-10 text-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-moss font-semibold mt-1 text-lg">{orderNumber}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll pb-6">
        <div className="p-4 space-y-4">
          {/* Pickup time */}
          <div className="bg-white rounded-2xl border border-cream-dark p-5 text-center">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Your order is ready</div>
            <div className="text-2xl font-bold text-forest">{pickupLabel}</div>
            {pickupTime?.type === 'scheduled' && (
              <p className="text-sm text-moss font-medium mt-1">Skip the line — we'll have it ready!</p>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-cream-dark p-4">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Order Summary</h3>
            <div className="space-y-3">
              {cart.map(item => {
                const parts = [
                  ...item.removedIngredients.map(i => `no ${i}`),
                  ...item.addOns.map(a => `+ ${a.name}`),
                  ...item.dietaryFlags,
                ].filter(Boolean);
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: item.menuItem.bgColor }}
                    >
                      {item.menuItem.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{item.menuItem.name}</div>
                      {parts.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">{parts.join(' · ')}</p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-forest flex-shrink-0">${item.unitPrice.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-cream-dark space-y-1.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-forest">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Punch card */}
          <div className="bg-white rounded-2xl border border-cream-dark p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Harvest Rewards</h3>
              <span className="text-forest font-bold text-sm">{punches}/9 punches</span>
            </div>
            <PunchCard displayPunches={displayPunches} totalPunches={punches} animateNew={animateNew} />
            {punches < 9 ? (
              <p className="text-center text-xs text-gray-500 mt-4">
                Just <span className="font-semibold text-forest">{9 - punches}</span> more {9 - punches === 1 ? 'item' : 'items'} for a free smoothie! 🎉
              </p>
            ) : (
              <div className="mt-4 bg-moss/10 border border-moss/30 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-forest">🎉 Free smoothie unlocked!</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Redeem when picking up your order, or on your next purchase.
                </p>
              </div>
            )}
          </div>

          {/* Back to menu */}
          <button
            onClick={handleBackToMenu}
            className="w-full bg-forest text-white rounded-2xl py-4 font-bold text-base active:scale-[0.98] transition-transform duration-100"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
