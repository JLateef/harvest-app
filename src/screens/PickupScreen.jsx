import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

// Fixed demo slots — 11:45 am through 5:00 pm; 12:15 pm always available for demo
const DEMO_SLOTS = [
  { label: '11:45 am', busy: true },
  { label: '12:00 pm', busy: true },
  { label: '12:15 pm', busy: false },
  { label: '12:30 pm', busy: false },
  { label: '12:45 pm', busy: false },
  { label: '1:00 pm', busy: false },
  { label: '1:15 pm', busy: false },
  { label: '1:30 pm', busy: false },
  { label: '1:45 pm', busy: false },
  { label: '2:00 pm', busy: false },
  { label: '2:15 pm', busy: false },
  { label: '2:30 pm', busy: false },
  { label: '2:45 pm', busy: false },
  { label: '3:00 pm', busy: false },
  { label: '3:15 pm', busy: false },
  { label: '3:30 pm', busy: false },
  { label: '3:45 pm', busy: false },
  { label: '4:00 pm', busy: false },
  { label: '4:15 pm', busy: false },
  { label: '4:30 pm', busy: false },
  { label: '4:45 pm', busy: false },
  { label: '5:00 pm', busy: false },
];

function isLunchRush() {
  const h = new Date().getHours();
  const m = new Date().getMinutes();
  const mins = h * 60 + m;
  return mins >= 11 * 60 + 30 && mins < 13 * 60 + 30;
}

export default function PickupScreen() {
  const { navigate, setPickupTime } = useApp();
  const [selected, setSelected] = useState(null);
  const lunchRush = isLunchRush();

  const handleASAP = () => {
    const label = lunchRush ? '~15 min' : '~5 min';
    setSelected({ type: 'asap' });
    setPickupTime({ type: 'asap', label });
  };

  const handleSlot = (slot) => {
    if (slot.busy) return;
    setSelected({ type: 'scheduled', label: slot.label });
    setPickupTime({ type: 'scheduled', label: slot.label });
  };

  return (
    <div className="flex flex-col h-full relative">
      <Header showBack title="Pickup Time" />

      <div className="flex-1 overflow-y-auto phone-scroll pb-32">
        <div className="p-4 space-y-3">
          {/* ASAP option */}
          <button
            onClick={handleASAP}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
              selected?.type === 'asap'
                ? 'border-forest bg-forest/5'
                : 'border-cream-dark bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900">ASAP</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  Ready in{' '}
                  <span className={`font-semibold ${lunchRush ? 'text-accent' : 'text-forest'}`}>
                    {lunchRush ? '~15 min ⚡ lunch rush' : '~5 min'}
                  </span>
                </div>
              </div>
              <RadioCircle checked={selected?.type === 'asap'} />
            </div>
          </button>

          {/* Scheduled slots */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1 mb-2.5">
              Schedule a slot
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_SLOTS.map(slot => {
                const isSelected = selected?.type === 'scheduled' && selected?.label === slot.label;
                return (
                  <button
                    key={slot.label}
                    onClick={() => handleSlot(slot)}
                    disabled={slot.busy}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      slot.busy
                        ? 'border-cream-dark bg-gray-50 cursor-not-allowed'
                        : isSelected
                        ? 'border-forest bg-forest/5'
                        : 'border-cream-dark bg-white active:border-moss'
                    }`}
                  >
                    <div className={`font-semibold text-sm ${
                      slot.busy ? 'text-gray-300' : isSelected ? 'text-forest' : 'text-gray-800'
                    }`}>
                      {slot.label}
                    </div>
                    {slot.busy && (
                      <div className="text-[10px] text-accent font-semibold mt-0.5 uppercase tracking-wide">
                        Busy · limited
                      </div>
                    )}
                    {!slot.busy && isSelected && (
                      <div className="text-[10px] text-moss font-semibold mt-0.5">
                        Selected ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reassurance message */}
          {selected?.type === 'scheduled' && (
            <div className="bg-moss/10 border border-moss/30 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-moss text-lg mt-0.5">🗓</span>
              <p className="text-forest text-sm font-medium leading-relaxed">
                Skip the line — your order will be ready at{' '}
                <span className="font-bold">{selected.label}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10 bg-gradient-to-t from-cream via-cream/95 to-transparent pointer-events-none">
        <button
          onClick={() => navigate('payment', 'pickup')}
          disabled={!selected}
          className={`pointer-events-auto w-full rounded-2xl py-4 font-bold text-base shadow-xl transition-all duration-150 ${
            selected
              ? 'bg-forest text-white active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

function RadioCircle({ checked }) {
  return (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
      checked ? 'border-forest bg-forest' : 'border-gray-300'
    }`}>
      {checked && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  );
}
