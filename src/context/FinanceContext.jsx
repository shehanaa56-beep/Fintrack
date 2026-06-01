import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { ref, onValue, push, set, remove } from 'firebase/database';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [extraHours, setExtraHours] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIncome([]);
      setExpenses([]);
      setSavings([]);
      setLeaves([]);
      setExtraHours([]);
      setSalaries([]);
      return;
    }

    const financeRef = ref(db, `users/${user.uid}/finance`);
    
    const unsubscribe = onValue(financeRef, (snapshot) => {
      const data = snapshot.val() || {};
      
      const process = (obj) => obj ? Object.entries(obj).map(([id, val]) => ({ ...val, id })) : [];
      
      setIncome(process(data.income));
      setExpenses(process(data.expenses));
      setSavings(process(data.savings));
      setLeaves(process(data.leaves));
      setExtraHours(process(data.extraHours));
      setSalaries(process(data.salaries));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addIncome = (entry) => {
    if (!user) return;
    const itemRef = push(ref(db, `users/${user.uid}/finance/income`));
    set(itemRef, { ...entry, createdAt: Date.now() });
  };
  const deleteIncome = (id) => {
    if (!user) return;
    remove(ref(db, `users/${user.uid}/finance/income/${id}`));
  };

  const addExpense = (entry) => {
    if (!user) return;
    const itemRef = push(ref(db, `users/${user.uid}/finance/expenses`));
    set(itemRef, { ...entry, createdAt: Date.now() });
  };
  const deleteExpense = (id) => {
    if (!user) return;
    remove(ref(db, `users/${user.uid}/finance/expenses/${id}`));
  };

  const addSaving = (entry) => {
    if (!user) return;
    const itemRef = push(ref(db, `users/${user.uid}/finance/savings`));
    set(itemRef, { ...entry, createdAt: Date.now() });
  };
  const deleteSaving = (id) => {
    if (!user) return;
    remove(ref(db, `users/${user.uid}/finance/savings/${id}`));
  };

  const addLeaf = (entry) => {
    if (!user) return;
    const itemRef = push(ref(db, `users/${user.uid}/finance/leaves`));
    set(itemRef, { ...entry, createdAt: Date.now() });
  };
  const deleteLeaf = (id) => {
    if (!user) return;
    remove(ref(db, `users/${user.uid}/finance/leaves/${id}`));
  };

  const addExtraHour = (entry) => {
    if (!user) return;
    const itemRef = push(ref(db, `users/${user.uid}/finance/extraHours`));
    set(itemRef, { ...entry, createdAt: Date.now() });
  };
  const deleteExtraHour = (id) => {
    if (!user) return;
    remove(ref(db, `users/${user.uid}/finance/extraHours/${id}`));
  };

  const addSalary = (entry) => {
    if (!user) return;
    const itemRef = push(ref(db, `users/${user.uid}/finance/salaries`));
    set(itemRef, { ...entry, createdAt: Date.now() });
  };
  const deleteSalary = (id) => {
    if (!user) return;
    remove(ref(db, `users/${user.uid}/finance/salaries/${id}`));
  };

  const totalIncome = income.reduce((s, e) => s + Number(e.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalSavings = savings.reduce((s, e) => s + Number(e.amount), 0);
  const netBalance = totalIncome - totalExpenses - totalSavings;

  const getMonthlyTrends = () => {
    const map = {};
    const process = (entries, key) => {
      entries.forEach(e => {
        const d = new Date(e.date);
        const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
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
      loading
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
