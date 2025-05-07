import { useState } from 'react';
import './AddExpenseForm.scss';

function AddExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;

    const newExpense = {
      title,
      amount: parseFloat(amount),
      category,
      date,
    };

    onAddExpense(newExpense);
    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Título del gasto</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Monto</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Categoría</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Seleccioná una categoría</option>
          <option value="Vivienda">Vivienda</option>
          <option value="Comida">Comida</option>
          <option value="Transporte">Transporte</option>
          <option value="Servicios">Servicios</option>
          <option value="Entretenimiento">Entretenimiento</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <div className="form-group">
        <label>Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <button type="submit">Agregar Gasto</button>
    </form>
  );
}

export default AddExpenseForm;
