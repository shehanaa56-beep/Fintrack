import React from 'react';
import { useFinance } from '../context/FinanceContext';
import './PageStyles.css';
import './Monthly.css';

const Monthly = () => {
  const { getMonthlyTrends } = useFinance();
  
  // Get trends and reverse to show most recent first
  const monthlyData = [...getMonthlyTrends()].reverse();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Monthly Summary</h1>
          <p className="page-subtitle">Track your month-over-month performance</p>
        </div>
      </div>

      <div className="monthly-grid">
        {monthlyData.length > 0 ? (
          monthlyData.map((data, index) => {
            const balance = data.income - data.expenses - data.savings;
            const isPositive = balance >= 0;

            return (
              <div key={index} className="monthly-card">
                <div className="month-header">
                  <h3 className="month-title">{data.month}</h3>
                  <div className={`month-status ${isPositive ? 'positive' : 'negative'}`}>
                    <i className={`bi bi-graph-${isPositive ? 'up-arrow' : 'down-arrow'}`}></i>
                  </div>
                </div>
                
                <div className="month-stats">
                  <div className="stat-row">
                    <span className="stat-label">
                      <i className="bi bi-arrow-up-right income-icon"></i> Income
                    </span>
                    <span className="stat-value income">
                      ₹{Number(data.income).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <div className="stat-row">
                    <span className="stat-label">
                      <i className="bi bi-arrow-down-left expense-icon"></i> Expenses
                    </span>
                    <span className="stat-value expense">
                      ₹{Number(data.expenses).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="stat-row">
                    <span className="stat-label">
                      <i className="bi bi-safe2 savings-icon"></i> Savings
                    </span>
                    <span className="stat-value savings">
                      ₹{Number(data.savings).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className={`month-footer ${isPositive ? 'positive' : 'negative'}`}>
                  <span className="balance-label">Net Balance</span>
                  <span className="balance-value">
                    ₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--text-muted)' }}>
              <i className="bi bi-calendar-x"></i>
            </div>
            <h3>No Data Available</h3>
            <p>Add some income or expenses to see your monthly summary here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Monthly;
