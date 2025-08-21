import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 👇 usa TU hoja de estilos
import './App.css'

// ❌ comentá o borrá esta si existe, porque pisa tus estilos
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
