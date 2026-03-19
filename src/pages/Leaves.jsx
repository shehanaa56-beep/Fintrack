import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import './PageStyles.css';

const today = new Date().toISOString().split('T')[0];

const Leaves = () => {
  const { leaves, addLeaf, deleteLeaf } = useFinance();
  const [form, setForm] = useState({ date: today, type: 'Casual', reason: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.date || !form.reason) return;
    addLeaf(form);
    setForm({ date: today, type: 'Casual', reason: '' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leaves</h1>
          <p className="page-subtitle">Track your time off</p>
        </div>
        <div className="page-badge savings-badge">
          <i className="bi bi-calendar2-check-fill"></i>
          {leaves.length} Days
        </div>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Earned">Earned Leave</option>
              <option value="WFH">WFH (Optional)</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Reason</label>
            <input type="text" name="reason" placeholder="Why are you taking leave?" value={form.reason} onChange={handleChange} />
          </div>
        </div>
        <div className="form-footer">
          <button type="submit" className="btn-add savings-btn">+ Add Leave</button>
        </div>
      </form>

      <h2 className="section-title">Leave History</h2>
      {leaves.length === 0 ? <p className="empty-state">No leaves recorded yet</p> : (
        <div className="entries-list">
          {leaves.map(l => (
            <div key={l.id} className="transaction-entry saving">
              <div className="entry-icon-bg"><i className="bi bi-calendar-minus"></i></div>
              <div className="entry-main">
                <div className="entry-row">
                  <span className="entry-category">{l.type} Leave</span>
                  <span className="entry-date">{new Date(l.date).toLocaleDateString()}</span>
                </div>
                <div className="entry-row secondary">
                  <span className="entry-desc">{l.reason}</span>
                </div>
              </div>
              <button className="btn-delete" onClick={() => deleteLeaf(l.id)}><i className="bi bi-trash"></i></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaves;
