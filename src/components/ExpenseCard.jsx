import { motion } from 'framer-motion';
import './ExpenseCard.scss';

function ExpenseCard({ title, amount, category, date, onDelete }) {
  return (
    <motion.div
      className="expense-card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <h3>{title}</h3>
      <p>💲 {amount}</p>
      <span>{category}</span>
      <small>{date}</small>
      <button className="delete-btn" onClick={onDelete}>Eliminar</button>
    </motion.div>
  );
}

export default ExpenseCard;
