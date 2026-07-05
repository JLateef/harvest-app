import { useApp } from '../context/AppContext';
import Header from '../components/Header';

function buildCustomizationSummary(item) {
  const parts = [
    ...item.removedIngredients.map(i => `no ${i}`),
    ...item.addOns.map(a => `+ ${a.name}`),
    ...item.dietaryFlags,
    item.size && item.menuItem.sizes?.[0] !== item.size ? item.size : null,
  ].filter(Boolean);
  return parts;
}

function CartItemCard({ item, onEdit, onRemove }) {
  const customizations = buildCustomizationSummary(item);

  return (
    <div className="bg-white rounded-2xl p-4 border border-cream-dark">
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: item.menuItem.bgColor }}
        >
          {item.menuItem.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{item.menuItem.name}</div>
          {customizations.length > 0 && (
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              {customizations.join(' · ')}
            </p>
          )}
          <div className="text-sm font-bold text-forest mt-1">${item.unitPrice.toFixed(2)}</div>
        </div>

        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button
            onClick={() => onEdit(item.id)}
            className="text-xs text-forest font-semibold py-1 px-2.5 border border-forest/30 rounded-lg bg-forest/5 active:bg-forest/10"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-red-400 font-semibold py-1 px-2.5 border border-red-200 rounded-lg active:bg-red-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartScreen() {
  const { cart, cartTotal, removeFromCart, editCartItem, navigate } = useApp();
  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <Header showBack title="Your Order" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="text-6xl">🛒</div>
          <p className="text-gray-500 text-center text-sm">Your cart is empty. Add something delicious!</p>
          <button
            onClick={() => navigate('menu')}
            className="bg-forest text-white px-6 py-3 rounded-2xl font-semibold text-sm"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <Header showBack title="Your Order" />

      <div className="flex-1 overflow-y-auto phone-scroll pb-36">
        <div className="p-4 space-y-3">
          {cart.map(item => (
            <CartItemCard
              key={item.id}
              item={item}
              onEdit={editCartItem}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Pricing summary */}
        <div className="mx-4 bg-white rounded-2xl border border-cream-dark p-4 space-y-2.5">
          <PriceLine label="Subtotal" value={`$${cartTotal.toFixed(2)}`} />
          <PriceLine label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
          <div className="h-px bg-cream-dark" />
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span className="text-forest text-lg">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Add more items nudge */}
        <button
          onClick={() => navigate('menu', 'cart')}
          className="mx-4 mt-3 w-[calc(100%-2rem)] flex items-center justify-center gap-1.5 py-3 border-2 border-dashed border-cream-dark rounded-2xl text-sm text-gray-400 font-medium"
        >
          <span>+</span> Add more items
        </button>
      </div>

      {/* CTA */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10 bg-gradient-to-t from-cream via-cream/95 to-transparent pointer-events-none">
        <button
          onClick={() => navigate('pickup', 'cart')}
          className="pointer-events-auto w-full bg-forest text-white rounded-2xl py-4 font-bold text-base shadow-xl active:scale-[0.98] transition-transform duration-100"
        >
          Choose Pickup Time
        </button>
      </div>
    </div>
  );
}

function PriceLine({ label, value }) {
  return (
    <div className="flex justify-between text-sm text-gray-500">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
