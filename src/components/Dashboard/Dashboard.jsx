import React from 'react';
import { TrendingUp, TrendingDown, CreditCard, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie
} from 'recharts';
import { chartColors } from '../../constants/categories';

const Dashboard = ({ calculations, expenses, savings }) => {
  const { 
    totalMonthlyIncome, 
    totalMonthlyExpenses, 
    totalDebt, 
    monthlyBalance 
  } = calculations;

  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (expense.category) {
      acc[expense.category] = (acc[expense.category] || 0) + (parseFloat(expense.amount) || 0);
    }
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const monthlyTrendData = [
    { month: 'Jan', income: totalMonthlyIncome, expenses: totalMonthlyExpenses, balance: monthlyBalance },
    { month: 'Feb', income: totalMonthlyIncome, expenses: totalMonthlyExpenses, balance: monthlyBalance },
    { month: 'Mar', income: totalMonthlyIncome, expenses: totalMonthlyExpenses, balance: monthlyBalance },
    { month: 'Apr', income: totalMonthlyIncome, expenses: totalMonthlyExpenses, balance: monthlyBalance },
    { month: 'May', income: totalMonthlyIncome, expenses: totalMonthlyExpenses, balance: monthlyBalance },
    { month: 'Jun', income: totalMonthlyIncome, expenses: totalMonthlyExpenses, balance: monthlyBalance }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Monthly Income</p>
              <p className="text-2xl font-bold">£{totalMonthlyIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Monthly Expenses</p>
              <p className="text-2xl font-bold">£{totalMonthlyExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className={`bg-gradient-to-r ${
          monthlyBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
        } rounded-lg p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Monthly Balance</p>
              <p className="text-2xl font-bold">£{monthlyBalance.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Debt</p>
              <p className="text-2xl font-bold">£{totalDebt.toLocaleString()}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`£${value.toLocaleString()}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} />
              <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: £${value.toLocaleString()}`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`£${value.toLocaleString()}`, 'Amount']} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Progress */}
      {savings.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Savings Goals Progress</h3>
          <div className="space-y-4">
            {savings.map((goal) => {
              const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
              return (
                <div key={goal.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-gray-600">
                      £{goal.current.toLocaleString()} / £{goal.target.toLocaleString()} ({progress.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 