import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import './PageStyles.css';

const today = new Date().toISOString().split('T')[0];

const ExtraHours = () => {
  const { extraHours, addExtraHour, deleteExtraHour } = useFinance();
  const [form, setForm] = useState({ date: today, hours: '', description: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.date || !form.hours) return;
    addExtraHour(form);
    setForm({ date: today, hours: '', description: '' });
  };

  const totalHours = extraHours.reduce((sum, h) => sum + Number(h.hours), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Extra Hours</h1>
          <p className="page-subtitle">Track your overtime</p>
        </div>
        <div className="page-badge income-badge">
          <i className="bi bi-clock-fill"></i>
          {totalHours} Hrs
        </div>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Hours</label>
            <input type="number" name="hours" placeholder="0" min="0" step="0.5" value={form.hours} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Description (Task/Project)</label>
            <input type="text" name="description" placeholder="What were you working on?" value={form.description} onChange={handleChange} />
          </div>
        </div>
        <div className="form-footer">
          <button type="submit" className="btn-add income-btn">+ Add Hours</button>
        </div>
      </form>

      <h2 className="section-title">Extra Hours History</h2>
      {extraHours.length === 0 ? <p className="empty-state">No extra hours recorded yet</p> : (
        <div className="entries-list">
          {extraHours.map(h => (
            <div key={h.id} className="transaction-entry income">
              <div className="entry-icon-bg"><i className="bi bi-alarm-fill"></i></div>
              <div className="entry-main">
                <div className="entry-row">
                  <span className="entry-category">{h.hours} Hours</span>
                  <span className="entry-date">{new Date(h.date).toLocaleDateString()}</span>
                </div>
                <div className="entry-row secondary">
                  <span className="entry-desc">{h.description || 'Overtime'}</span>
                </div>
              </div>
              <button className="btn-delete" onClick={() => deleteExtraHour(h.id)}><i className="bi bi-trash"></i></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExtraHours;
