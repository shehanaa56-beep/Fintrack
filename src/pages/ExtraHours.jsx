import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentMonth];

  const monthlyExtraHours = extraHours.filter(h => {
    const d = new Date(h.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalMonthlyHours = monthlyExtraHours.reduce((sum, h) => sum + Number(h.hours), 0);

  const archiveData = extraHours.reduce((acc, h) => {
    const d = new Date(h.date);
    const m = d.getMonth();
    const y = d.getFullYear();
    const key = `${y}-${m}`;
    if (!acc[key]) acc[key] = { month: m, year: y, data: [] };
    acc[key].data.push(h);
    return acc;
  }, {});

  const sortedArchiveKeys = Object.keys(archiveData).sort((a, b) => {
    const [yA, mA] = a.split('-');
    const [yB, mB] = b.split('-');
    if (yA !== yB) return Number(yB) - Number(yA);
    return Number(mB) - Number(mA);
  });

  const handleDownloadPDF = (monthIndex, year, monthData) => {
    const doc = new jsPDF();
    const targetMonthName = monthNames[monthIndex];
    
    doc.text(`${targetMonthName} ${year} - Extra Hours Report`, 14, 15);
    
    const sortedData = [...monthData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const totalSelectedHours = sortedData.reduce((sum, h) => sum + Number(h.hours), 0);

    const tableData = sortedData.map(h => [
      new Date(h.date).toLocaleDateString(),
      h.hours,
      h.description || 'Overtime'
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['Date', 'Hours', 'Description']],
      body: tableData,
      foot: [['Total', totalSelectedHours, '']],
      theme: 'grid',
      headStyles: { fillColor: [233, 24, 113] }, // Pink background
    });

    doc.save(`${targetMonthName}_${year}_ExtraHours.pdf`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Extra Hours</h1>
          <p className="page-subtitle">Track your overtime</p>
        </div>
        <div className="page-badge income-badge">
          <i className="bi bi-clock-fill"></i>
          {totalMonthlyHours} Hrs
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

      <h2 className="section-title">{currentMonthName} {currentYear} History</h2>
      {monthlyExtraHours.length === 0 ? <p className="empty-state">No extra hours recorded for {currentMonthName}</p> : (
        <div className="entries-list">
          {monthlyExtraHours.map(h => (
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

      <div className="monthly-archive-section">
        <h2 className="section-title">Monthly Archive</h2>
        {sortedArchiveKeys.length === 0 ? <p className="empty-state">No past records to archive</p> : (
          <div className="archive-list">
            {sortedArchiveKeys.map(key => {
              const { month, year, data } = archiveData[key];
              return (
                <button 
                  key={key} 
                  type="button" 
                  className="archive-btn" 
                  onClick={() => handleDownloadPDF(month, year, data)}
                >
                  <span className="archive-badge">PDF</span>
                  <span className="archive-month">{monthNames[month]} {year}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtraHours;
