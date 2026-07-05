import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function PaymentScreen() {
  const { placeOrder, pickupTime, cartTotal } = useApp();
  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  const pickupLabel = pickupTime?.type === 'asap'
    ? `ASAP (${pickupTime.label})`
    : pickupTime?.label ?? '—';

  return (
    <div className="flex flex-col h-full relative">
      <Header showBack title="Payment" />

      <div className="flex-1 overflow-y-auto phone-scroll pb-32">
        <div className="p-4 space-y-4">
          {/* Order at a glance */}
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
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-155.5-127.7C46 | 430.7 0 | 270.4 0 | 214.1c0-154 99.9-235.6 197.2-235.6 52.4 0 96.2 34.4 129.3 34.4 31.6 0 81.1-36.6 143.9-36.6 22.6 0 108.2 2 160.6 81.3z"/>
            </svg>
            Pay with Apple Pay
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-cream-dark" />
            <span className="text-xs text-gray-400 font-medium">or pay with card</span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>

          {/* Saved card */}
          <div className="bg-white rounded-2xl border-2 border-forest p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-black tracking-wider">VISA</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Visa ···· 4242</div>
                  <div className="text-xs text-gray-400">Expires 08/27</div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <button className="w-full text-center text-sm text-forest font-semibold py-2 active:opacity-70">
            + Add payment method
          </button>

          {/* Order note */}
          <div className="bg-cream-dark/50 rounded-2xl p-4 flex items-start gap-2.5">
            <span className="text-lg">🔒</span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your payment info is stored securely. Tapping "Place Order" confirms your order and charges your card.
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
          <span>Place Order</span>
          <span>${total.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
}
