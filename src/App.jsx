import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseCard from './components/ExpenseCard';
import ExpenseChart from './components/ExpenseChart';
import Calculator from './components/Calculator';

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleDeleteExpense = (indexToDelete) => {
    const updated = expenses.filter((_, index) => index !== indexToDelete);
    setExpenses(updated);
  };

  return (
    <div className="app-container">
      <Header />
      <AddExpenseForm onAddExpense={handleAddExpense} />
      <ExpenseChart data={expenses} />

      {expenses.length > 0 ? (
        <main className="dashboard">
          <AnimatePresence>
            {expenses.map((expense, index) => (
              <ExpenseCard
                key={index}
                {...expense}
                onDelete={() => handleDeleteExpense(index)}
              />
            ))}
          </AnimatePresence>
        </main>
      ) : (
        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#aaa' }}>
          No hay gastos cargados aún.
        </p>
      )}

      <Calculator />
    </div>
  );
}

export default App;
