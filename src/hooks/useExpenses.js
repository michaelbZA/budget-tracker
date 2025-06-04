// src/hooks/useExpenses.js
import { useState } from 'react';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([
    { id: '1', category: 'Mortgage', name: 'Monthly Mortgage', amount: 1200, type: 'fixed' },
    { id: '2', category: 'Groceries', name: 'Weekly Shopping', amount: 300, type: 'variable' }
  ]);
  
  return {
    expenses,
    loading: false,
    addExpense: async (data) => {
      const newExpense = { ...data, id: Date.now().toString() };
      setExpenses(prev => [...prev, newExpense]);
    },
    updateExpense: async (id, data) => {
      setExpenses(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    },
    deleteExpense: async (id) => {
      setExpenses(prev => prev.filter(item => item.id !== id));
    }
  };
};