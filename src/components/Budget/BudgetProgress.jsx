import React from 'react';

const BudgetProgress = ({ budgets }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalBudget = () => {
    return budgets.reduce((total, budget) => total + budget.amount, 0);
  };

  const calculateTotalSpent = () => {
    return budgets.reduce((total, budget) => total + budget.spent, 0);
  };

  const calculateRemaining = () => {
    return calculateTotalBudget() - calculateTotalSpent();
  };

  const getBudgetStatus = () => {
    const totalBudget = calculateTotalBudget();
    const totalSpent = calculateTotalSpent();
    const percentage = (totalSpent / totalBudget) * 100;

    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'critical':
        return 'You are close to exceeding your budget!';
      case 'warning':
        return 'You are approaching your budget limit.';
      default:
        return 'Your budget is in good standing.';
    }
  };

  const status = getBudgetStatus();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
          <p className="text-2xl font-bold">{formatCurrency(calculateTotalBudget())}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
          <p className="text-2xl font-bold">{formatCurrency(calculateTotalSpent())}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Remaining</h3>
          <p className="text-2xl font-bold">{formatCurrency(calculateRemaining())}</p>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${status === 'critical' ? 'bg-red-50' : status === 'warning' ? 'bg-yellow-50' : 'bg-green-50'}`}>
        <h3 className={`font-medium ${getStatusColor(status)}`}>Budget Status</h3>
        <p className={`mt-1 ${getStatusColor(status)}`}>{getStatusMessage(status)}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Budget Distribution</h3>
        <div className="space-y-2">
          {budgets.map(budget => {
            const percentage = (budget.amount / calculateTotalBudget()) * 100;
            return (
              <div key={budget.id} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{budget.category}</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress; 