import React, { createContext, useContext, useState, useEffect } from 'react';

interface BalanceContextType {
  balance: number;
  setBalance: (balance: number) => void;
  addToBalance: (amount: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);

  const addToBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance, addToBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}