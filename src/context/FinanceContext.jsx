import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const FinanceProvider = ({ children }) => {
  const [income, setIncome] = useState(() => loadFromStorage('fintrack_income', []));
  const [expenses, setExpenses] = useState(() => loadFromStorage('fintrack_expenses', []));
  const [savings, setSavings] = useState(() => loadFromStorage('fintrack_savings', []));
  const [leaves, setLeaves] = useState(() => loadFromStorage('fintrack_leaves', []));
  const [extraHours, setExtraHours] = useState(() => loadFromStorage('fintrack_extraHours', []));
  const [salaries, setSalaries] = useState(() => loadFromStorage('fintrack_salaries', []));

  useEffect(() => { localStorage.setItem('fintrack_income', JSON.stringify(income)); }, [income]);
  useEffect(() => { localStorage.setItem('fintrack_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('fintrack_savings', JSON.stringify(savings)); }, [savings]);
  useEffect(() => { localStorage.setItem('fintrack_leaves', JSON.stringify(leaves)); }, [leaves]);
  useEffect(() => { localStorage.setItem('fintrack_extraHours', JSON.stringify(extraHours)); }, [extraHours]);
  useEffect(() => { localStorage.setItem('fintrack_salaries', JSON.stringify(salaries)); }, [salaries]);

  const addIncome = (entry) => setIncome(prev => [{ ...entry, id: Date.now() }, ...prev]);
  const deleteIncome = (id) => setIncome(prev => prev.filter(e => e.id !== id));

  const addExpense = (entry) => setExpenses(prev => [{ ...entry, id: Date.now() }, ...prev]);
  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  const addSaving = (entry) => setSavings(prev => [{ ...entry, id: Date.now() }, ...prev]);
  const deleteSaving = (id) => setSavings(prev => prev.filter(e => e.id !== id));

  const addLeaf = (entry) => setLeaves(prev => [{ ...entry, id: Date.now() }, ...prev]);
  const deleteLeaf = (id) => setLeaves(prev => prev.filter(e => e.id !== id));

  const addExtraHour = (entry) => setExtraHours(prev => [{ ...entry, id: Date.now() }, ...prev]);
  const deleteExtraHour = (id) => setExtraHours(prev => prev.filter(e => e.id !== id));

  const addSalary = (entry) => setSalaries(prev => [{ ...entry, id: Date.now() }, ...prev]);
  const deleteSalary = (id) => setSalaries(prev => prev.filter(e => e.id !== id));

  const totalIncome = income.reduce((s, e) => s + Number(e.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalSavings = savings.reduce((s, e) => s + Number(e.amount), 0);
  const netBalance = totalIncome - totalExpenses - totalSavings;

  // Build monthly trends data
  const getMonthlyTrends = () => {
    const map = {};
    const process = (entries, key) => {
      entries.forEach(e => {
        const d = new Date(e.date);
        const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!map[label]) map[label] = { month: label, income: 0, expenses: 0, savings: 0 };
        map[label][key] += Number(e.amount);
      });
    };
    process(income, 'income');
    process(expenses, 'expenses');
    process(savings, 'savings');
    return Object.values(map).sort((a, b) => new Date('01 ' + a.month) - new Date('01 ' + b.month));
  };

  const allTransactions = [
    ...income.map(e => ({ ...e, type: 'income' })),
    ...expenses.map(e => ({ ...e, type: 'expense' })),
    ...savings.map(e => ({ ...e, type: 'saving' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <FinanceContext.Provider value={{
      income, expenses, savings, leaves, extraHours, salaries,
      addIncome, deleteIncome,
      addExpense, deleteExpense,
      addSaving, deleteSaving,
      addLeaf, deleteLeaf,
      addExtraHour, deleteExtraHour,
      addSalary, deleteSalary,
      totalIncome, totalExpenses, totalSavings, netBalance,
      getMonthlyTrends, allTransactions,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
