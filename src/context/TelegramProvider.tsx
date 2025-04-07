
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive: boolean): void;
    hideProgress(): void;
    onClick(callback: Function): void;
    offClick(callback: Function): void;
  };
  onEvent(eventType: string, callback: Function): void;
  offEvent(eventType: string, callback: Function): void;
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    start_param?: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: {
    id: number;
    username?: string;
    first_name: string;
    last_name?: string;
  } | null;
  referralCode: string | null;
  loadingWebApp: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  referralCode: null,
  loadingWebApp: true,
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramContextType['user']>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loadingWebApp, setLoadingWebApp] = useState(true);

  useEffect(() => {
    const initTelegram = () => {
      // @ts-ignore
      if (window.Telegram && window.Telegram.WebApp) {
        // @ts-ignore
        const app = window.Telegram.WebApp;
        setWebApp(app);
        app.ready();
        app.expand();

        if (app.initDataUnsafe && app.initDataUnsafe.user) {
          setUser(app.initDataUnsafe.user);
        }

        // Check for referral code
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        if (ref) {
          setReferralCode(ref);
          console.log('Referral code detected:', ref);
        }
      } else {
        console.log('Telegram WebApp not available, running in browser mode');
        
        // For testing in browser outside of Telegram
        const fakeUser = {
          id: 123456789,
          username: 'test_user',
          first_name: 'Test',
          last_name: 'User'
        };
        setUser(fakeUser);
        
        // Mock referral from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        if (ref) {
          setReferralCode(ref);
          console.log('Referral code detected:', ref);
        }
      }
      
      setLoadingWebApp(false);
    };

    initTelegram();
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, referralCode, loadingWebApp }}>
      {children}
    </TelegramContext.Provider>
  );
};
