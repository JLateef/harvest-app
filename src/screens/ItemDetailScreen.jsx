import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function ItemDetailScreen() {
  const { selectedItem: item, addToCart, editingCartId, cart } = useApp();

  const existing = editingCartId ? cart.find(c => c.id === editingCartId) : null;

  const [size, setSize] = useState(existing?.size ?? item?.sizes?.[0] ?? '');
  const [removedIngredients, setRemovedIngredients] = useState(existing?.removedIngredients ?? []);
  const [selectedAddOns, setSelectedAddOns] = useState(existing?.addOns ?? []);
  const [dietaryFlags, setDietaryFlags] = useState(existing?.dietaryFlags ?? []);
  const [specialInstructions, setSpecialInstructions] = useState(existing?.specialInstructions ?? '');

  if (!item) return null;

  const sizePrice = item.sizePrices?.[size] ?? 0;
  const addOnsTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
  const totalPrice = item.price + sizePrice + addOnsTotal;

  const toggleIngredient = (ing) =>
    setRemovedIngredients(prev =>
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );

  const toggleAddOn = (addOn) =>
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a.id === addOn.id);
      return exists ? prev.filter(a => a.id !== addOn.id) : [...prev, addOn];
    });

  const toggleDietary = (flag) =>
    setDietaryFlags(prev =>
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    );

  const handleAdd = () => {
    addToCart(item, { size, sizePrice, removedIngredients, addOns: selectedAddOns, dietaryFlags, specialInstructions });
  };

  return (
    <div className="flex flex-col h-full relative">
      <Header showBack title={item.name} />

      <div className="flex-1 overflow-y-auto phone-scroll pb-28">
        {/* Hero block */}
        <div
          className="h-36 flex items-center justify-center text-7xl flex-shrink-0"
          style={{ backgroundColor: item.bgColor }}
        >
          {item.emoji}
        </div>

        <div className="p-5 space-y-6">
          {/* Item info */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
              <span className="text-forest font-bold text-xl flex-shrink-0">${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.description}</p>
            {item.seasonal && (
              <span className="inline-flex items-center gap-1 mt-2 bg-accent/10 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                🌱 Spring Menu
              </span>
            )}
          </div>

          {/* Size */}
          {item.sizes?.length > 0 && (
            <section>
              <SectionLabel>Size</SectionLabel>
              <div className="flex gap-2">
                {item.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      size === s
                        ? 'border-forest bg-forest/5 text-forest'
                        : 'border-cream-dark text-gray-600 bg-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Remove ingredients */}
          {item.ingredients?.length > 0 && (
            <section>
              <SectionLabel>Remove Ingredients</SectionLabel>
              <div className="space-y-2">
                {item.ingredients.map(ing => {
                  const removed = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      onClick={() => toggleIngredient(ing)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        removed ? 'border-red-200 bg-red-50' : 'border-cream-dark bg-white'
                      }`}
                    >
                      <span className={`text-sm capitalize ${removed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {ing}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        removed ? 'border-red-400 bg-red-400' : 'border-gray-300'
                      }`}>
                        {removed && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Add-ons */}
          {item.addOns?.length > 0 && (
            <section>
              <SectionLabel>Add-ons</SectionLabel>
              <div className="space-y-2">
                {item.addOns.map(addOn => {
                  const selected = !!selectedAddOns.find(a => a.id === addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        selected ? 'border-forest bg-forest/5' : 'border-cream-dark bg-white'
                      }`}
                    >
                      <span className={`text-sm ${selected ? 'text-forest font-medium' : 'text-gray-700'}`}>
                        {addOn.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-forest font-semibold">+${addOn.price.toFixed(2)}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selected ? 'border-forest bg-forest' : 'border-gray-300'
                        }`}>
                          {selected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Dietary flags */}
          <section>
            <SectionLabel>Dietary Preferences</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {['Vegan', 'Gluten-free', 'No nuts'].map(flag => {
                const active = dietaryFlags.includes(flag);
                return (
                  <button
                    key={flag}
                    onClick={() => toggleDietary(flag)}
                    className={`px-3.5 py-1.5 rounded-full text-sm border-2 transition-all font-medium ${
                      active
                        ? 'bg-moss border-moss text-white'
                        : 'border-cream-dark text-gray-600 bg-white'
                    }`}
                  >
                    {flag}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Special instructions */}
          <section>
            <SectionLabel>Special Instructions</SectionLabel>
            <textarea
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="Allergies, extra spice, sauce on the side…"
              className="w-full bg-white border border-cream-dark rounded-xl p-3.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-forest resize-none"
              rows={3}
            />
          </section>
        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10 bg-gradient-to-t from-cream via-cream/95 to-transparent pointer-events-none">
        <button
          onClick={handleAdd}
          className="pointer-events-auto w-full bg-forest text-white rounded-2xl py-4 font-bold text-base shadow-xl active:scale-[0.98] transition-transform duration-100 flex items-center justify-between px-6"
        >
          <span>{editingCartId ? 'Update Item' : 'Add to Order'}</span>
          <span>${totalPrice.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
      {children}
    </h3>
  );
}
