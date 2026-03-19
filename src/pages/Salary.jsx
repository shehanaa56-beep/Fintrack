import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import './PageStyles.css';

const today = new Date().toISOString().split('T')[0];

const Salary = () => {
  const { salaries, addSalary, deleteSalary } = useFinance();
  const [form, setForm] = useState({ date: today, amount: '', month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.date || !form.amount) return;
    addSalary(form);
    setForm({ date: today, amount: '', month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Monthly Salary</h1>
          <p className="page-subtitle">Manage your earnings history</p>
        </div>
        <div className="page-badge expense-badge">
          <i className="bi bi-wallet-fill"></i>
          ₹{salaries.length > 0 ? Number(salaries[0].amount).toLocaleString() : 0}
        </div>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Salary Amount (₹)</label>
            <input type="number" name="amount" placeholder="0.00" min="0" value={form.amount} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Received Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Salary Month (Label)</label>
            <input type="text" name="month" placeholder="March 2026" value={form.month} onChange={handleChange} />
          </div>
        </div>
        <div className="form-footer">
          <button type="submit" className="btn-add expense-btn">+ Add Salary Record</button>
        </div>
      </form>

      <h2 className="section-title">Salary History</h2>
      {salaries.length === 0 ? <p className="empty-state">No salary records yet</p> : (
        <div className="entries-list">
          {salaries.map(s => (
            <div key={s.id} className="transaction-entry expense">
              <div className="entry-icon-bg"><i className="bi bi-bank2"></i></div>
              <div className="entry-main">
                <div className="entry-row">
                  <span className="entry-category">{s.month}</span>
                  <span className="entry-amount">₹{Number(s.amount).toLocaleString()}</span>
                </div>
                <div className="entry-row secondary">
                  <span className="entry-desc">Created Date: {new Date(s.date).toLocaleDateString()}</span>
                </div>
              </div>
              <button className="btn-delete" onClick={() => deleteSalary(s.id)}><i className="bi bi-trash"></i></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Salary;
