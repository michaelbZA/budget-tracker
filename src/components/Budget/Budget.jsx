import React from 'react';
import { useBudgets } from '../../hooks/useBudgets';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import BudgetProgress from './BudgetProgress';

const Budget = () => {
  const {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget
  } = useBudgets();

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Budget Planning</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BudgetForm onSubmit={addBudget} />
          <BudgetList 
            budgets={budgets} 
            onUpdate={updateBudget}
            onDelete={deleteBudget}
          />
        </div>
        <div>
          <BudgetProgress budgets={budgets} />
        </div>
      </div>
    </div>
  );
};

export default Budget; 