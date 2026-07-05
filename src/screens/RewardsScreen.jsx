import { useApp } from '../context/AppContext';
import Header from '../components/Header';

const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s7-2 5 10c-2-4-5-5-5-5s5 2 3 9c-2-6-6-7-6-7 4 2 4 6 4 6-4-4-9-3-9-3z"/>
  </svg>
);

export default function RewardsScreen() {
  const { punches, navigate } = useApp();
  const remaining = 9 - punches;

  return (
    <div className="flex flex-col h-full">
      <Header showBack title="Rewards" />

      {/* Hero */}
      <div className="bg-forest px-6 pt-6 pb-8 text-center flex-shrink-0">
        <div className="text-5xl mb-3">🌿</div>
        <h2 className="text-white text-xl font-bold">Harvest Rewards</h2>
        <p className="text-moss/80 text-sm mt-1">Buy 9 items, earn a free smoothie</p>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll">
        <div className="p-4 space-y-4">
          {/* Punch card */}
          <div className="bg-white rounded-2xl border border-cream-dark p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-bold text-gray-900">{punches} of 9 punches</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {remaining > 0 ? `${remaining} more to go` : 'Reward earned!'}
                </div>
              </div>
              <span className="text-2xl">
                {remaining > 0 ? '☕' : '🎉'}
              </span>
            </div>

            {/* Punch grid — 3 rows of 3 */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {Array.from({ length: 9 }).map((_, i) => {
                const filled = i < punches;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                      filled
                        ? 'bg-forest shadow-sm'
                        : 'bg-cream-dark border-2 border-dashed border-gray-200'
                    }`}
                  >
                    {filled ? (
                      <>
                        <LeafIcon className="w-7 h-7 text-moss" />
                        <div className="w-1 h-1 rounded-full bg-moss/50" />
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-200">{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-forest to-moss rounded-full transition-all duration-700"
                style={{ width: `${(punches / 9) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>0</span>
              <span>9 items</span>
            </div>
          </div>

          {/* Locked reward */}
          <div className={`bg-white rounded-2xl border border-cream-dark p-4 flex items-center gap-3 ${punches < 9 ? 'opacity-50' : ''}`}>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              🫐
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-sm">
                {punches >= 9 ? '🎉 Free Smoothie Unlocked!' : 'Free Smoothie (locked)'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {punches >= 9
                  ? 'Redeem when picking up your order, or on your next purchase.'
                  : 'Your choice of any smoothie on us'}
              </div>
              <div className="text-sm font-bold text-forest mt-1">$0.00</div>
            </div>
            {punches < 9 && (
              <div className="text-2xl opacity-40">🔒</div>
            )}
          </div>

          {/* How it works */}
          <div className="bg-cream-dark/40 rounded-2xl p-4">
            <h3 className="font-bold text-gray-800 text-sm mb-3">How it works</h3>
            <div className="space-y-2.5">
              {[
                { icon: '🛒', text: 'Every order you place earns one punch' },
                { icon: '🎯', text: 'Collect 9 punches for a free smoothie' },
                { icon: '♻️', text: 'Card resets automatically after redemption' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="text-lg leading-tight">{step.icon}</span>
                  <span className="leading-relaxed">{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('menu')}
            className="w-full bg-forest text-white rounded-2xl py-3.5 font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            Order & earn punches →
          </button>
        </div>
      </div>
    </div>
  );
}
