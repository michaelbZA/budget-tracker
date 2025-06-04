import { useState } from 'react';

export const useDebts = () => {
  const [debts, setDebts] = useState([
    { id: '1', name: 'Credit Card', balance: 2500, interestRate: 18.9, minimumPayment: 50 }
  ]);
  
  return {
    debts,
    loading: false,
    addDebt: async (data) => {
      const newDebt = { ...data, id: Date.now().toString() };
      setDebts(prev => [...prev, newDebt]);
    },
    updateDebt: async (id, data) => {
      setDebts(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    },
    deleteDebt: async (id) => {
      setDebts(prev => prev.filter(item => item.id !== id));
    }
  };
}; 