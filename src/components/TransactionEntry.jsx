import React from 'react';
import './TransactionEntry.css';

const TransactionEntry = ({ entry, type, onDelete }) => {
  const { amount, category, description, date } = entry;
  
  const getIcon = () => {
    switch(type) {
      case 'income': return <i className="bi bi-plus-circle-fill"></i>;
      case 'expense': return <i className="bi bi-dash-circle-fill"></i>;
      case 'saving': return <i className="bi bi-piggy-bank"></i>;
      default: return <i className="bi bi-record-fill"></i>;
    }
  };

  return (
    <div className={`transaction-entry ${type}`}>
      <div className="entry-icon-bg">
        <span className="entry-icon">{getIcon()}</span>
      </div>
      <div className="entry-main">
        <div className="entry-row">
          <span className="entry-category">{category}</span>
          <span className="entry-amount">
            {type === 'expense' ? '-' : type === 'income' ? '+' : ''}
            ₹{Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="entry-row secondary">
          <span className="entry-desc">{description || 'No description'}</span>
          <span className="entry-date">{new Date(date).toLocaleDateString()}</span>
        </div>
      </div>
      <button className="btn-delete" onClick={onDelete} title="Delete entry">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  );
};

export default TransactionEntry;
