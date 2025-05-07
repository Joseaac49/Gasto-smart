import { useState } from 'react';
import './Calculator.scss';

function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    setExpression((prev) => prev + value);
  };

  const clear = () => {
    setExpression('');
    setResult('');
  };

  const calculate = () => {
    try {
      // ⚠️ eval solo se usa aquí porque el input es controlado
      const evaluated = eval(expression);
      setResult(evaluated);
    } catch (err) {
      setResult('Error');
    }
  };

  return (
    <div className="calculator">
      <h2>🧮 Calculadora</h2>
      <input type="text" value={expression} readOnly />
      <div className="buttons">
        {[7, 8, 9, '+', 4, 5, 6, '-', 1, 2, 3, '*', 0, '.', '=', '/'].map((btn, i) => (
          <button
            key={i}
            onClick={() => {
              if (btn === '=') {
                calculate();
              } else {
                handleClick(btn.toString());
              }
            }}
          >
            {btn}
          </button>
        ))}
        <button onClick={clear} className="clear-btn">
          C
        </button>
      </div>
      {result !== '' && <p className="result">Resultado: {result}</p>}
    </div>
  );
}

export default Calculator;
