import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const budgetsCollection = collection(db, 'budgets');
      const budgetsSnapshot = await getDocs(budgetsCollection);
      const budgetsList = budgetsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBudgets(budgetsList);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError(`Failed to fetch budgets: ${err.message}`);
      setLoading(false);
    }
  };

  const addBudget = async (budgetData) => {
    try {
      const budgetsCollection = collection(db, 'budgets');
      await addDoc(budgetsCollection, {
        ...budgetData,
        createdAt: new Date().toISOString(),
        spent: 0,
        status: 'active'
      });
      fetchBudgets();
    } catch (err) {
      setError('Failed to add budget');
    }
  };

  const updateBudget = async (id, updates) => {
    try {
      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, updates);
      fetchBudgets();
    } catch (err) {
      setError('Failed to update budget');
    }
  };

  const deleteBudget = async (id) => {
    try {
      const budgetRef = doc(db, 'budgets', id);
      await deleteDoc(budgetRef);
      fetchBudgets();
    } catch (err) {
      setError('Failed to delete budget');
    }
  };

  const updateBudgetSpent = async (id, amount) => {
    try {
      const budgetRef = doc(db, 'budgets', id);
      const budget = budgets.find(b => b.id === id);
      if (budget) {
        const newSpent = budget.spent + amount;
        await updateDoc(budgetRef, { spent: newSpent });
        fetchBudgets();
      }
    } catch (err) {
      setError('Failed to update budget spent amount');
    }
  };

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    updateBudgetSpent
  };
}; 