import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionEntry from '../components/TransactionEntry';
import './PageStyles.css';

const today = new Date().toISOString().split('T')[0];

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Other'];

const Income = () => {
  const { income, addIncome, deleteIncome, totalIncome } = useFinance();
  const [form, setForm] = useState({ amount: '', category: '', description: '', date: today });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    addIncome(form);
    setForm({ amount: '', category: '', description: '', date: today });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Income</h1>
          <p className="page-subtitle">Track all your earnings</p>
        </div>
        <div className="page-badge income-badge">
          <i className="bi bi-graph-up-arrow"></i>
          ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
              {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
          <button type="submit" className="btn-add income-btn">+ Add Income</button>
        </div>
      </form>

      <h2 className="section-title">All Income Entries</h2>
      {income.length === 0
        ? <p className="empty-state">No transactions yet</p>
        : income.map(e => (
          <TransactionEntry key={e.id} entry={e} type="income" onDelete={() => deleteIncome(e.id)} />
        ))
      }
    </div>
  );
};

export default Income;
