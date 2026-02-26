import { createContext, useContext, useState, ReactNode } from 'react';

interface BalanceVisibilityContextType {
  isVisible: boolean;
  toggle: () => void;
}

const BalanceVisibilityContext = createContext<BalanceVisibilityContextType | undefined>(undefined);

export function BalanceVisibilityProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggle = () => setIsVisible(prev => !prev);

  return (
    <BalanceVisibilityContext.Provider value={{ isVisible, toggle }}>
      {children}
    </BalanceVisibilityContext.Provider>
  );
}

export function useBalanceVisibility() {
  const context = useContext(BalanceVisibilityContext);
  if (!context) {
    throw new Error('useBalanceVisibility must be used within BalanceVisibilityProvider');
  }
  return context;
}
