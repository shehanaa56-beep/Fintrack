import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionEntry from '../components/TransactionEntry';
import './PageStyles.css';

const today = new Date().toISOString().split('T')[0];

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'EMI', 'Housing', 'Utilities', 'Healthcare', 'Education', 'Entertainment', 'Shopping', 'Other'];

const Expenses = () => {
  const { expenses, addExpense, deleteExpense, totalExpenses } = useFinance();
  const [form, setForm] = useState({ amount: '', category: '', description: '', date: today });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    addExpense(form);
    setForm({ amount: '', category: '', description: '', date: today });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track your spending</p>
        </div>
        <div className="page-badge expense-badge">
          <i className="bi bi-graph-down-arrow"></i>
          ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" name="amount" placeholder="0.00" value={form.amount}
              onChange={handleChange} min="0" step="0.01" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" name="description" placeholder="Add a note..." value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
        </div>
        <div className="form-footer">
          <button type="submit" className="btn-add expense-btn">+ Add Expense</button>
        </div>
      </form>

      <h2 className="section-title">All Expense Entries</h2>
      {expenses.length === 0
        ? <p className="empty-state">No transactions yet</p>
        : expenses.map(e => (
          <TransactionEntry key={e.id} entry={e} type="expense" onDelete={() => deleteExpense(e.id)} />
        ))
      }
    </div>
  );
};

export default Expenses;
