import React from 'react';
import { BarChart3, Target, CreditCard } from 'lucide-react';

const Reports = ({ calculations, expenses, debts, savings }) => {
  const { 
    totalMonthlyIncome, 
    totalMonthlyExpenses, 
    totalDebt, 
    totalSavingsTarget,
    totalSavingsCurrent,
    monthlyBalance 
  } = calculations;

  const fixedExpenses = expenses.filter(e => e.type === 'fixed').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const variableExpenses = expenses.filter(e => e.type === 'variable').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Financial Reports</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Income vs Expenses
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Income:</span>
              <span className="font-semibold text-green-600">£{totalMonthlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Expenses:</span>
              <span className="font-semibold text-red-600">£{totalMonthlyExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Net Income:</span>
              <span className={`font-semibold ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                £{monthlyBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-500" />
            Savings Progress
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Target:</span>
              <span className="font-semibold">£{totalSavingsTarget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Saved:</span>
              <span className="font-semibold text-blue-600">£{totalSavingsCurrent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Progress:</span>
              <span className="font-semibold">
                {totalSavingsTarget > 0 ? ((totalSavingsCurrent / totalSavingsTarget) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-red-500" />
            Debt Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Debt:</span>
              <span className="font-semibold text-red-600">£{totalDebt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Min Payments:</span>
              <span className="font-semibold">
                £{debts.reduce((sum, d) => sum + (parseFloat(d.minimumPayment) || 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Debt-to-Income:</span>
              <span className="font-semibold">
                {totalMonthlyIncome > 0 ? ((totalDebt / (totalMonthlyIncome * 12)) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Fixed vs Variable</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Fixed Expenses:</span>
                <span className="font-semibold">£{fixedExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Variable Expenses:</span>
                <span className="font-semibold">£{variableExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">By Category</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {Object.entries(
                expenses.reduce((acc, expense) => {
                  if (expense.category) {
                    acc[expense.category] = (acc[expense.category] || 0) + (parseFloat(expense.amount) || 0);
                  }
                  return acc;
                }, {})
              ).map(([category, amount]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span>{category}:</span>
                  <span>£{amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Financial Recommendations</h3>
        <div className="space-y-3">
          {monthlyBalance < 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">⚠️ Monthly expenses exceed income</p>
              <p className="text-red-600 text-sm">Consider reducing variable expenses or increasing income sources.</p>
            </div>
          )}
          {totalDebt > totalMonthlyIncome * 6 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800 font-medium">💳 High debt-to-income ratio</p>
              <p className="text-orange-600 text-sm">Focus on debt reduction strategies like the debt snowball or avalanche method.</p>
            </div>
          )}
          {totalSavingsCurrent < totalMonthlyIncome * 3 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">💰 Build emergency fund</p>
              <p className="text-blue-600 text-sm">Aim for 3-6 months of expenses in emergency savings.</p>
            </div>
          )}
          {monthlyBalance > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✅ Positive cash flow</p>
              <p className="text-green-600 text-sm">Great! Consider increasing savings or debt payments with your surplus.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports; 