import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ExpenseChart.scss';

const COLORS = ['#00a8ff', '#9c88ff', '#fbc531', '#e84118', '#4cd137', '#8c7ae6'];

function ExpenseChart({ data }) {
  const chartData = Object.values(
    data.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = {
          name: expense.category,
          value: 0,
        };
      }
      acc[expense.category].value += expense.amount;
      return acc;
    }, {})
  );

  return (
    <div className="chart-container">
      <h2>Gastos por Categoría</h2>
      {chartData.length === 0 ? (
        <p>No hay datos suficientes para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ExpenseChart;
