import { useState } from 'react';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([
    { id: '1', date: '2024-01-01', amount: -45.50, description: 'Grocery Store', category: 'Groceries' },
    { id: '2', date: '2024-01-02', amount: 3500, description: 'Salary Deposit', category: 'Income' }
  ]);
  
  return {
    transactions,
    loading: false,
    addTransaction: async (data) => {
      const newTransaction = { ...data, id: Date.now().toString() };
      setTransactions(prev => [...prev, newTransaction]);
    },
    updateTransaction: async (id, data) => {
      setTransactions(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    },
    deleteTransaction: async (id) => {
      setTransactions(prev => prev.filter(item => item.id !== id));
    }
  };
}; 