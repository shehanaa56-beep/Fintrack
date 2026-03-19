import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const StatCard = ({ title, value, icon, className, prefix = '' }) => (
  <div className={`stat-card ${className}`}>
    <div className="stat-info">
      <span className="stat-label">{title}</span>
      <h3 className="stat-value">
        {prefix}₹{Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
      </h3>
    </div>
    <div className="stat-icon-wrapper">{icon}</div>
  </div>
);

const Dashboard = () => {
  const {
    totalIncome, totalExpenses, totalSavings, netBalance,
    getMonthlyTrends, allTransactions
  } = useFinance();

  const monthlyData = getMonthlyTrends();

  // Premium colors for charts
  const CHART_COLORS = ['#00ba7c', '#e91871', '#7b2cbf', '#f59e0b', '#00f5d4'];

  const distributionData = [
    { name: 'Income', value: totalIncome, color: CHART_COLORS[0] },
    { name: 'Expenses', value: totalExpenses, color: CHART_COLORS[1] },
    { name: 'Savings', value: totalSavings, color: CHART_COLORS[2] },
  ].filter(d => d.value > 0);

  const stats = [
    { label: 'Total Income', value: totalIncome, icon: <i className="bi bi-arrow-up-right"></i>, color: 'income', prefix: '+' },
    { label: 'Total Expenses', value: totalExpenses, icon: <i className="bi bi-arrow-down-left"></i>, color: 'expense', prefix: '-' },
    { label: 'Total Savings', value: totalSavings, icon: <i className="bi bi-safe2"></i>, color: 'savings', prefix: '' },
    { label: 'Net Balance', value: netBalance, icon: <i className="bi bi-wallet2"></i>, color: 'balance', prefix: '' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your financial overview at a glance</p>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <StatCard 
            key={s.label}
            title={s.label}
            value={s.value}
            icon={s.icon}
            className={s.color}
            prefix={s.prefix}
          />
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card trends-chart">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Trends</h3>
          </div>
          <div className="chart-container">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                  />
                  <Line type="monotone" dataKey="income" stroke="#00ba7c" strokeWidth={3} dot={{ r: 4, fill: '#00ba7c', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#e91871" strokeWidth={3} dot={{ r: 4, fill: '#e91871', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">Add transactions to see trends</div>
            )}
          </div>
        </div>

        <div className="chart-card distribution-chart">
          <div className="chart-header">
            <h3 className="chart-title">Distribution</h3>
          </div>
          <div className="chart-container">
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">No data yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="recent-transactions">
        <div className="section-header">
          <h3>Recent Transactions</h3>
        </div>
        <div className="transactions-list">
          {allTransactions.length > 0 ? (
            allTransactions.slice(0, 5).map(t => (
              <div key={t.id} className="mini-transaction">
                <div className={`entry-dot ${t.type}`}></div>
                <div className="entry-details">
                  <span className="entry-cat">{t.category}</span>
                  <span className="entry-date">{new Date(t.date).toLocaleDateString()}</span>
                </div>
                <span className={`entry-amt ${t.type}`}>
                  {t.type === 'expense' ? '-' : t.type === 'income' ? '+' : ''}
                  ₹{Number(t.amount).toLocaleString('en-IN')}
                </span>
              </div>
            ))
          ) : (
            <p className="empty-state">No transactions yet. Start adding your income and expenses!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
