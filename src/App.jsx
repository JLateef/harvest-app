import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import SplashScreen from './screens/SplashScreen';
import MenuScreen from './screens/MenuScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import CartScreen from './screens/CartScreen';
import PickupScreen from './screens/PickupScreen';
import PaymentScreen from './screens/PaymentScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import RewardsScreen from './screens/RewardsScreen';

function useClockTime() {
  const fmt = () => new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(/\s?[AP]M/i, '');
  const [time, setTime] = useState(() => fmt());

  useEffect(() => {
    const tick = () => setTime(fmt());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function PhoneApp() {
  const { screen, resetDemo } = useApp();
  const time = useClockTime();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'R' && e.shiftKey) resetDemo();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [resetDemo]);

  const screens = {
    splash: <SplashScreen />,
    menu: <MenuScreen />,
    item: <ItemDetailScreen />,
    cart: <CartScreen />,
    pickup: <PickupScreen />,
    payment: <PaymentScreen />,
    confirmation: <ConfirmationScreen />,
    rewards: <RewardsScreen />,
  };

  return (
    <div className="min-h-screen bg-gray-500 flex flex-col items-center justify-center p-0 md:p-8">
      {/* iPhone-style frame on desktop */}
      <div className="
        relative flex flex-col
        w-full h-svh
        md:w-[390px] md:h-[844px] md:max-h-[95vh]
        md:rounded-[44px]
        md:shadow-[0_0_0_2px_#111827,0_0_0_8px_#374151,0_30px_80px_rgba(0,0,0,0.6)]
        overflow-hidden
        bg-cream
      ">
        {/* Simulated status bar */}
        <div className="flex-shrink-0 h-10 bg-forest flex items-center justify-between px-6 pt-1">
          <span className="text-white text-xs font-semibold">{time}</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-white fill-white" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.243 4.243 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-2 bg-white rounded-sm opacity-40" />
              <div className="w-1 h-3 bg-white rounded-sm opacity-60" />
              <div className="w-1 h-3.5 bg-white rounded-sm opacity-80" />
              <div className="w-1 h-4 bg-white rounded-sm" />
            </div>
            <div className="flex items-center gap-0.5 ml-0.5">
              <div className="w-6 h-3 rounded border border-white/70 p-0.5 flex items-center">
                <div className="h-full bg-white rounded-sm" style={{ width: '75%' }} />
              </div>
              <div className="w-0.5 h-1.5 bg-white/50 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden relative bg-cream flex flex-col">
          {screens[screen]}
        </div>
      </div>

      {/* Reset hint (desktop only) */}
      <p className="hidden md:block mt-4 text-xs text-gray-400 opacity-60 select-none">
        Press <kbd className="bg-gray-600 text-gray-200 px-1 rounded text-[10px]">Shift+R</kbd> to reset demo
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <PhoneApp />
    </AppProvider>
  );
}
