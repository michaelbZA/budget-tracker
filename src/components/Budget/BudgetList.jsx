import React from 'react';
import { Trash2 } from 'lucide-react';

const BudgetList = ({ budgets, onUpdate, onDelete }) => {
  const handleStatusChange = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    onUpdate(id, { status: newStatus });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (spent, amount) => {
    return Math.min((spent / amount) * 100, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold p-4 border-b">Your Budgets</h2>
      <div className="divide-y">
        {budgets.map(budget => (
          <div key={budget.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{budget.category}</h3>
                <p className="text-sm text-gray-600">{budget.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusChange(budget.id, budget.status)}
                  className={`px-3 py-1 rounded text-sm ${
                    budget.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {budget.status === 'active' ? 'Active' : 'Paused'}
                </button>
                <button
                  onClick={() => onDelete(budget.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Delete Budget"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Spent: {formatCurrency(budget.spent)}</span>
                <span>Budget: {formatCurrency(budget.amount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    calculateProgress(budget.spent, budget.amount) > 90
                      ? 'bg-red-500'
                      : calculateProgress(budget.spent, budget.amount) > 75
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${calculateProgress(budget.spent, budget.amount)}%`
                  }}
                />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Period: {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetList; 