// src/hooks/useIncome.js
import { useState } from 'react';

export const useIncome = () => {
  const [income, setIncome] = useState([
    { id: '1', source: 'Salary', amount: 3500, frequency: 'monthly' },
    { id: '2', source: 'Freelance', amount: 500, frequency: 'monthly' }
  ]);
  
  return {
    income,
    loading: false,
    addIncome: async (data) => {
      const newIncome = { ...data, id: Date.now().toString() };
      setIncome(prev => [...prev, newIncome]);
    },
    updateIncome: async (id, data) => {
      setIncome(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    },
    deleteIncome: async (id) => {
      setIncome(prev => prev.filter(item => item.id !== id));
    }
  };
};