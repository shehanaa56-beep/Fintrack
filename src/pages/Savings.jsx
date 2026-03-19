import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionEntry from '../components/TransactionEntry';
import './PageStyles.css';

const today = new Date().toISOString().split('T')[0];

const SAVINGS_CATEGORIES = ['Emergency Fund', 'Retirement', 'Investment', 'Travel', 'Education', 'Home', 'Vehicle', 'Business', 'Other'];

const Savings = () => {
  const { savings, addSaving, deleteSaving, totalSavings } = useFinance();
  const [form, setForm] = useState({ amount: '', category: '', description: '', date: today });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    addSaving(form);
    setForm({ amount: '', category: '', description: '', date: today });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Savings</h1>
          <p className="page-subtitle">Grow your wealth</p>
        </div>
        <div className="page-badge savings-badge">
          <i className="bi bi-piggy-bank"></i>
          ₹{totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
              {SAVINGS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
          <button type="submit" className="btn-add savings-btn">+ Add Savings</button>
        </div>
      </form>

      <h2 className="section-title">All Savings Entries</h2>
      {savings.length === 0
        ? <p className="empty-state">No transactions yet</p>
        : savings.map(e => (
          <TransactionEntry key={e.id} entry={e} type="saving" onDelete={() => deleteSaving(e.id)} />
        ))
      }
    </div>
  );
};

export default Savings;
