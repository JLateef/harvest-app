import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('splash');
  const [prevScreen, setPrevScreen] = useState('menu');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingCartId, setEditingCartId] = useState(null);
  const [cart, setCart] = useState([]);
  const [punches, setPunches] = useState(7);
  const [pickupTime, setPickupTime] = useState(null);
  const [orderNumber, setOrderNumber] = useState('#H-1047');

  const navigate = useCallback((newScreen, from) => {
    setPrevScreen(prev => from ?? prev);
    setScreen(newScreen);
  }, []);

  const openItem = useCallback((item, fromScreen) => {
    setSelectedItem(item);
    setEditingCartId(null);
    navigate('item', fromScreen || 'menu');
  }, [navigate]);

  const editCartItem = useCallback((cartId) => {
    const cartItem = cart.find(i => i.id === cartId);
    if (!cartItem) return;
    setSelectedItem(cartItem.menuItem);
    setEditingCartId(cartId);
    navigate('item', 'cart');
  }, [cart, navigate]);

  const addToCart = useCallback((menuItem, config) => {
    const unitPrice =
      menuItem.price +
      (config.sizePrice || 0) +
      config.addOns.reduce((sum, a) => sum + a.price, 0);

    if (editingCartId) {
      setCart(prev =>
        prev.map(item =>
          item.id === editingCartId ? { ...item, ...config, unitPrice } : item
        )
      );
      setEditingCartId(null);
    } else {
      setCart(prev => [
        ...prev,
        { id: `${Date.now()}`, menuItem, ...config, unitPrice },
      ]);
    }
    navigate('cart', 'item');
  }, [editingCartId, navigate]);

  const removeFromCart = useCallback((cartId) => {
    setCart(prev => prev.filter(i => i.id !== cartId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setPickupTime(null);
  }, []);

  const placeOrder = useCallback(() => {
    const num = 1000 + Math.floor(Math.random() * 9000);
    setOrderNumber(`#H-${num}`);
    setPunches(p => Math.min(p + 1, 9));
    navigate('confirmation', 'payment');
  }, [navigate]);

  const resetDemo = useCallback(() => {
    setCart([]);
    setPunches(7);
    setPickupTime(null);
    setSelectedItem(null);
    setEditingCartId(null);
    setScreen('menu');
    setPrevScreen('menu');
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice, 0);
  const cartCount = cart.length;

  return (
    <AppContext.Provider value={{
      screen, navigate, prevScreen,
      selectedItem, openItem,
      editingCartId, editCartItem,
      cart, cartCount, cartTotal, addToCart, removeFromCart, clearCart,
      punches,
      pickupTime, setPickupTime,
      orderNumber,
      placeOrder,
      resetDemo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
