import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

const INITIAL_CARDS = [
  { id: 'visa-4242', brand: 'Visa', last4: '4242', expiry: '08/27', bgColor: 'bg-blue-600', label: 'VISA' },
];

function detectBrand(digits) {
  if (digits.startsWith('4')) return { brand: 'Visa', bgColor: 'bg-blue-600', label: 'VISA' };
  if (digits.startsWith('5')) return { brand: 'Mastercard', bgColor: 'bg-red-500', label: 'MC' };
  if (digits.startsWith('3')) return { brand: 'Amex', bgColor: 'bg-green-600', label: 'AMEX' };
  return { brand: 'Card', bgColor: 'bg-gray-600', label: 'CARD' };
}

function CardTile({ card, selected, onSelect }) {
  const isSelected = selected === card.id;
  return (
    <button
      onClick={() => onSelect(card.id)}
      className={`w-full bg-white rounded-2xl border-2 p-4 text-left transition-all ${
        isSelected ? 'border-forest' : 'border-cream-dark'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-7 ${card.bgColor} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-xs font-black tracking-wider">{card.label}</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{card.brand} ···· {card.last4}</div>
            <div className="text-xs text-gray-400">Expires {card.expiry}</div>
          </div>
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

function AddCardSheet({ onSave, onClose }) {
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState([]);

  const handleCardNum = (e) => {
    setError([]);
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNum(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  const handleExpiry = (e) => {
    setError([]);
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  };

  const rawDigits = cardNum.replace(/\s/g, '');
  const canSave = rawDigits.length === 16 && expiry.length === 5 && cvv.length >= 3 && name.trim().length > 0;

  const handleSave = () => {
    const errs = [];
    if (!/^[A-Za-z\s]+$/.test(name.trim()))
      errs.push('Name must contain letters only (A–Z).');
    const [mmStr, yyStr] = expiry.split('/');
    const mm = parseInt(mmStr, 10);
    const yy = parseInt(yyStr, 10);
    if (isNaN(mm) || mm < 1 || mm > 12)
      errs.push('Expiration month must be between 01 and 12.');
    if (isNaN(yy) || yy < 26)
      errs.push('Expiration year must be 2026 or later.');
    if (errs.length) {
      setError(errs);
      return;
    }
    setError([]);
    const { brand, bgColor, label } = detectBrand(rawDigits);
    onSave({ brand, bgColor, label, last4: rawDigits.slice(-4), expiry });
  };

  const inputClass = "mt-1 w-full border border-cream-dark rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-forest bg-white";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide";

  return (
    <div
      className="absolute inset-0 bg-black/40 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-cream rounded-t-3xl w-full p-6 space-y-4 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">Add Card</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center text-gray-500 text-lg font-bold">
            ×
          </button>
        </div>

        <div>
          <label className={labelClass}>Card Number</label>
          <input
            value={cardNum}
            onChange={handleCardNum}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Expiry</label>
            <input
              value={expiry}
              onChange={handleExpiry}
              placeholder="MM/YY"
              inputMode="numeric"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>CVV</label>
            <input
              value={cvv}
              onChange={e => { setError([]); setCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); }}
              placeholder="123"
              inputMode="numeric"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Name on Card</label>
          <input
            value={name}
            onChange={e => { setError([]); setName(e.target.value); }}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full rounded-2xl py-4 font-bold text-base transition-all ${
            canSave ? 'bg-forest text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Save Card
        </button>

        {error.length > 0 && (
          <div className="text-red-500 text-xs font-medium leading-snug -mt-1 space-y-0.5">
            {error.map((msg, i) => (
              <p key={i} className="text-center">{msg}</p>
            ))}
            {error.length > 1 && (
              <p className="text-center font-semibold">Please verify info and resubmit.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentScreen() {
  const { placeOrder, pickupTime, cartTotal } = useApp();
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [selected, setSelected] = useState('visa-4242');
  const [showAddCard, setShowAddCard] = useState(false);

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  const pickupLabel = pickupTime?.type === 'asap'
    ? `ASAP (${pickupTime.label})`
    : pickupTime?.label ?? '—';

  const handleSaveCard = (cardData) => {
    const newCard = { id: `card-${Date.now()}`, ...cardData };
    setCards(prev => [...prev, newCard]);
    setSelected(newCard.id);
    setShowAddCard(false);
  };

  const isStoreSelected = selected === 'store';

  return (
    <div className="flex flex-col h-full relative">
      <Header showBack title="Payment" />

      <div className="flex-1 overflow-y-auto phone-scroll pb-32">
        <div className="p-4 space-y-4">
          {/* Total at a glance */}
          <div className="bg-white rounded-2xl border border-cream-dark p-4">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Total Due</div>
            <div className="text-3xl font-bold text-forest">${total.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1.5 flex items-center gap-1.5">
              <span>🕐</span>
              <span>Pickup: <span className="font-medium text-gray-700">{pickupLabel}</span></span>
            </div>
          </div>

          {/* Apple Pay */}
          <button className="w-full bg-black text-white rounded-2xl py-4 flex items-center justify-center gap-2.5 font-semibold text-base active:opacity-80">
            <svg className="w-5 h-5" viewBox="0 0 814 1000" fill="white">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-155.5-127.7C46 430.7 0 270.4 0 214.1c0-154 99.9-235.6 197.2-235.6 52.4 0 96.2 34.4 129.3 34.4 31.6 0 81.1-36.6 143.9-36.6 22.6 0 108.2 2 160.6 81.3z"/>
            </svg>
            Pay with Apple Pay
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-cream-dark" />
            <span className="text-xs text-gray-400 font-medium">or choose a payment method</span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>

          {/* Saved cards */}
          {cards.map(card => (
            <CardTile key={card.id} card={card} selected={selected} onSelect={setSelected} />
          ))}

          {/* Pay at store */}
          <button
            onClick={() => setSelected('store')}
            className={`w-full bg-white rounded-2xl border-2 p-4 text-left transition-all ${
              isStoreSelected ? 'border-forest' : 'border-cream-dark'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-moss/15 rounded-xl flex items-center justify-center text-2xl">
                  🏪
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Pay at store</div>
                  <div className="text-xs text-gray-400">Cash or card when you pick up</div>
                </div>
              </div>
              {isStoreSelected && (
                <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* Add payment method */}
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full text-center text-sm text-forest font-semibold py-2 active:opacity-70"
          >
            + Add payment method
          </button>

          {/* Security note */}
          <div className="bg-cream-dark/50 rounded-2xl p-4 flex items-start gap-2.5">
            <span className="text-lg">🔒</span>
            <p className="text-xs text-gray-500 leading-relaxed">
              {isStoreSelected
                ? 'You\'ll pay with cash or card at the counter when your order is ready.'
                : 'Your payment info is stored securely. Tapping "Place Order" confirms your order and charges your card.'}
            </p>
          </div>
        </div>
      </div>

      {/* Place Order CTA */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10 bg-gradient-to-t from-cream via-cream/95 to-transparent pointer-events-none">
        <button
          onClick={placeOrder}
          className="pointer-events-auto w-full bg-forest text-white rounded-2xl py-4 font-bold text-base shadow-xl active:scale-[0.98] transition-transform duration-100 flex items-center justify-between px-6"
        >
          <span>{isStoreSelected ? 'Confirm Order' : 'Place Order'}</span>
          <span>${total.toFixed(2)}</span>
        </button>
      </div>

      {/* Add card bottom sheet */}
      {showAddCard && (
        <AddCardSheet onSave={handleSaveCard} onClose={() => setShowAddCard(false)} />
      )}
    </div>
  );
}
