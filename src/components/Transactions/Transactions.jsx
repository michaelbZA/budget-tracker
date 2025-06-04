import React from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { defaultCategories } from '../../constants/categories';

const Transactions = ({ transactions, addTransaction, updateTransaction, deleteTransaction }) => {
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target.result;
        const lines = csv.split('\n').filter(l => l.trim() !== '');
        
        if (lines.length < 2) {
          alert('CSV appears to have no data rows.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const promises = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.length === 0 || values.every(v => v === '')) continue;

          const transactionObj = {};
          headers.forEach((header, idx) => {
            transactionObj[header] = values[idx] || '';
          });

          const dateField = headers.find(h => h.toLowerCase().includes('date')) || headers[0];
          const amountField = headers.find(h => 
            h.toLowerCase().includes('amount') || h.toLowerCase().includes('value')
          ) || headers[1];
          const descField = headers.find(h => 
            h.toLowerCase().includes('description') || h.toLowerCase().includes('reference')
          ) || headers[2];

          const transaction = {
            date: transactionObj[dateField] || '',
            amount: parseFloat(transactionObj[amountField]) || 0,
            description: transactionObj[descField] || '',
            category: 'Uncategorized',
            raw: transactionObj
          };

          promises.push(addTransaction(transaction));
        }

        await Promise.all(promises);
        alert(`Imported ${promises.length} transactions`);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('CSV import failed:', error);
      alert('Failed to import CSV. Please try again.');
    }
  };

  const handleUpdateTransaction = async (id, field, value) => {
    try {
      const item = transactions.find(t => t.id === id);
      await updateTransaction(id, { ...item, [field]: value });
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex space-x-4">
          <label className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <Upload className="h-5 w-5 mr-2" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      value={transaction.date}
                      onChange={(e) => handleUpdateTransaction(transaction.id, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={transaction.description}
                      onChange={(e) => handleUpdateTransaction(transaction.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={transaction.category}
                      onChange={(e) => handleUpdateTransaction(transaction.id, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {defaultCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={transaction.amount}
                      onChange={(e) => handleUpdateTransaction(transaction.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions; 