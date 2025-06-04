import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Target,
  FileText,
  BarChart3,
  DollarSign,
  Loader
} from 'lucide-react';
import './App.css';
import { useIncome } from "./hooks/useIncome";
import { useExpenses } from "./hooks/useExpenses";
import { useDebts } from "./hooks/useDebts";
import { useSavings } from "./hooks/useSavings";
import { useTransactions } from "./hooks/useTransactions";
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/Income/Income';
import Expenses from './components/Expenses/Expenses';
import Debts from './components/Debts/Debts';
import Savings from './components/Savings/Savings';
import Transactions from './components/Transactions/Transactions';
import Reports from './components/Reports/Reports';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Firebase hooks
  const { 
    income, 
    loading: incomeLoading, 
    addIncome, 
    updateIncome, 
    deleteIncome 
  } = useIncome();
  
  const { 
    expenses, 
    loading: expensesLoading, 
    addExpense, 
    updateExpense, 
    deleteExpense 
  } = useExpenses();
  
  const { 
    debts, 
    loading: debtsLoading, 
    addDebt, 
    updateDebt, 
    deleteDebt 
  } = useDebts();
  
  const { 
    savings, 
    loading: savingsLoading, 
    addSavingsGoal, 
    updateSavingsGoal, 
    deleteSavingsGoal 
  } = useSavings();
  
  const { 
    transactions, 
    loading: transactionsLoading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();

  // Memoized calculations for performance
  const calculations = useMemo(() => {
    const totalMonthlyIncome = income.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0), 0
    );
    const totalMonthlyExpenses = expenses.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0), 0
    );
    const totalDebt = debts.reduce(
      (sum, item) => sum + (parseFloat(item.balance) || 0), 0
    );
    const totalSavingsTarget = savings.reduce(
      (sum, item) => sum + (parseFloat(item.target) || 0), 0
    );
    const totalSavingsCurrent = savings.reduce(
      (sum, item) => sum + (parseFloat(item.current) || 0), 0
    );
    const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses;

    return {
      totalMonthlyIncome,
      totalMonthlyExpenses,
      totalDebt,
      totalSavingsTarget,
      totalSavingsCurrent,
      monthlyBalance
    };
  }, [income, expenses, debts, savings]);

  // Loading state
  const isLoading = incomeLoading || expensesLoading || debtsLoading || savingsLoading || transactionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading your budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Budget Tracker</h1>
            </div>
            <div className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'income', label: 'Income', icon: TrendingUp },
                { id: 'expenses', label: 'Expenses', icon: TrendingDown },
                { id: 'debts', label: 'Debts', icon: CreditCard },
                { id: 'savings', label: 'Savings', icon: Target },
                { id: 'transactions', label: 'Transactions', icon: FileText },
                { id: 'reports', label: 'Reports', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <Dashboard 
            calculations={calculations}
            expenses={expenses}
            savings={savings}
          />
        )}
        {activeTab === 'income' && (
          <Income
            income={income}
            addIncome={addIncome}
            updateIncome={updateIncome}
            deleteIncome={deleteIncome}
          />
        )}
        {activeTab === 'expenses' && (
          <Expenses
            expenses={expenses}
            addExpense={addExpense}
            updateExpense={updateExpense}
            deleteExpense={deleteExpense}
          />
        )}
        {activeTab === 'debts' && (
          <Debts
            debts={debts}
            addDebt={addDebt}
            updateDebt={updateDebt}
            deleteDebt={deleteDebt}
          />
        )}
        {activeTab === 'savings' && (
          <Savings
            savings={savings}
            addSavingsGoal={addSavingsGoal}
            updateSavingsGoal={updateSavingsGoal}
            deleteSavingsGoal={deleteSavingsGoal}
          />
        )}
        {activeTab === 'transactions' && (
          <Transactions
            transactions={transactions}
            addTransaction={addTransaction}
            updateTransaction={updateTransaction}
            deleteTransaction={deleteTransaction}
          />
        )}
        {activeTab === 'reports' && (
          <Reports
            calculations={calculations}
            expenses={expenses}
            debts={debts}
            savings={savings}
          />
        )}
      </main>
    </div>
  );
}

export default App;
