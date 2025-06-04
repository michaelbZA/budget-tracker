import { useState } from 'react';

export const useSavings = () => {
  const [savings, setSavings] = useState([
    { id: '1', name: 'Emergency Fund', target: 5000, current: 2000 },
    { id: '2', name: 'Vacation', target: 3000, current: 800 }
  ]);
  
  return {
    savings,
    loading: false,
    addSavingsGoal: async (data) => {
      const newGoal = { ...data, id: Date.now().toString() };
      setSavings(prev => [...prev, newGoal]);
    },
    updateSavingsGoal: async (id, data) => {
      setSavings(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    },
    deleteSavingsGoal: async (id) => {
      setSavings(prev => prev.filter(item => item.id !== id));
    }
  };
}; 