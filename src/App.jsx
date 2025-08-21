import React, { useEffect, useMemo, useRef, useState } from "react";

/** ==== Utilidades ==== */
const CURRENCY = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const fmtMoney = (n) => CURRENCY.format(Number(n || 0));
const fmtDate = (iso) => new Date(iso).toLocaleDateString("es-AR");
const todayISO = () => new Date().toISOString().slice(0, 10);

const CATEGORIES = [
  "Alquiler","Comida","Transporte","Servicios","Salud","Ocio","Educación","Otros",
];

/** ==== Storage ==== */
const STORAGE_KEY = "gastosSmart:v2";
const loadTx = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};
const saveTx = (tx) => localStorage.setItem(STORAGE_KEY, JSON.stringify(tx));

/** ==== Componentes ==== */
function Summary({ transactions }) {
  const { ingresos, egresos, saldo } = useMemo(() => {
    const ingresos = transactions.filter(t => t.type === "Ingreso")
      .reduce((a,b) => a + Number(b.amount), 0);
    const egresos = transactions.filter(t => t.type === "Egreso")
      .reduce((a,b) => a + Number(b.amount), 0);
    return { ingresos, egresos, saldo: ingresos - egresos };
  }, [transactions]);

  return (
    <div className="summary">
      <div className="sum-card">
        <span>Ingresos</span>
        <strong className="pos">{fmtMoney(ingresos)}</strong>
      </div>
      <div className="sum-card">
        <span>Egresos</span>
        <strong className="neg">{fmtMoney(egresos)}</strong>
      </div>
      <div className="sum-card">
        <span>Saldo</span>
        <strong className={saldo >= 0 ? "pos" : "neg"}>{fmtMoney(saldo)}</strong>
      </div>
    </div>
  );
}

function AddTransaction({ onAdd }) {
  const [form, setForm] = useState({
    date: todayISO(),
    description: "",
    category: "Otros",
    type: "Egreso",
    amount: "",
  });
  const descRef = useRef(null);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim()) return descRef.current?.focus();
    if (!amount || amount <= 0) return;
    onAdd({
      id: crypto.randomUUID(),
      ...form,
      amount,
    });
    setForm({ date: todayISO(), description: "", category: "Otros", type: "Egreso", amount: "" });
    descRef.current?.focus();
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h3>Agregar movimiento</h3>
      <div className="row">
        <label>Fecha
          <input type="date" value={form.date} onChange={e=>update("date", e.target.value)} required />
        </label>
        <label>Tipo
          <select value={form.type} onChange={e=>update("type", e.target.value)}>
            <option>Ingreso</option>
            <option>Egreso</option>
          </select>
        </label>
        <label>Categoría
          <select value={form.category} onChange={e=>update("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Monto
          <input type="number" min="0" step="0.01" value={form.amount}
                 onChange={e=>update("amount", e.target.value)} placeholder="0.00" required />
        </label>
      </div>
      <label>Descripción
        <input ref={descRef} value={form.description} onChange={e=>update("description", e.target.value)}
               placeholder="Ej: Supermercado" required />
      </label>
      <div className="actions">
        <button type="submit" className="btn">Agregar</button>
      </div>
    </form>
  );
}

function Filters({ filters, onChange }) {
  const update = (k, v) => onChange({ ...filters, [k]: v });

  return (
    <div className="card filters">
      <h3>Filtros</h3>
      <div className="row">
        <label>Buscar
          <input value={filters.q} onChange={e=>update("q", e.target.value)} placeholder="Descripción..." />
        </label>
        <label>Tipo
          <select value={filters.type} onChange={e=>update("type", e.target.value)}>
            <option value="">Todos</option>
            <option>Ingreso</option>
            <option>Egreso</option>
          </select>
        </label>
        <label>Categoría
          <select value={filters.category} onChange={e=>update("category", e.target.value)}>
            <option value="">Todas</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Desde
          <input type="date" value={filters.from} onChange={e=>update("from", e.target.value)} />
        </label>
        <label>Hasta
          <input type="date" value={filters.to} onChange={e=>update("to", e.target.value)} />
        </label>
      </div>
    </div>
  );
}

function TransactionList({ data, onDelete }) {
  if (!data.length) {
    return <div className="card empty">No hay movimientos con esos filtros.</div>;
  }
  return (
    <div className="card table">
      <table>
        <thead>
          <tr>
            <th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Tipo</th><th>Monto</th><th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(tx => (
            <tr key={tx.id}>
              <td>{fmtDate(tx.date)}</td>
              <td>{tx.description}</td>
              <td>{tx.category}</td>
              <td>
                <span className={`pill ${tx.type === "Ingreso" ? "pill-pos" : "pill-neg"}`}>{tx.type}</span>
              </td>
              <td className={tx.type === "Ingreso" ? "pos" : "neg"}>{fmtMoney(tx.amount)}</td>
              <td>
                <button className="link danger" onClick={()=>onDelete(tx.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImportExport({ onImport, data }) {
  const fileRef = useRef(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "gastos-smart.json"; a.click();
    URL.revokeObjectURL(url);
  };
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (Array.isArray(parsed)) onImport(parsed);
      } catch { /* ignore */ }
    };
    reader.readAsText(f);
  };

  return (
    <div className="import-export">
      <button className="btn ghost" onClick={()=>fileRef.current?.click()}>Importar JSON</button>
      <input ref={fileRef} type="file" accept="application/json" onChange={handleFile} hidden />
      <button className="btn outline" onClick={exportJSON}>Exportar JSON</button>
    </div>
  );
}

/** ==== App ==== */
export default function App() {
  const [transactions, setTransactions] = useState(() => loadTx());
  const [filters, setFilters] = useState({ q:"", type:"", category:"", from:"", to:"" });

  useEffect(() => { saveTx(transactions); }, [transactions]);

  const addTx = (t) => setTransactions(prev => [t, ...prev]);
  const delTx = (id) => setTransactions(prev => prev.filter(t => t.id !== id));
  const importAll = (arr) => {
    // Normaliza datos importados
    const parsed = arr
      .filter(x => x && x.id && x.date && x.description && x.category && x.type && x.amount)
      .map(x => ({...x, amount: Number(x.amount)}));
    setTransactions(parsed);
  };

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    const from = filters.from ? new Date(filters.from) : null;
    const to = filters.to ? new Date(filters.to) : null;

    return transactions.filter(t => {
      if (q && !t.description.toLowerCase().includes(q)) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      const d = new Date(t.date);
      if (from && d < from) return false;
      if (to) {
        const toEnd = new Date(filters.to); toEnd.setHours(23,59,59,999);
        if (d > toEnd) return false;
      }
      return true;
    }).sort((a,b) => b.date.localeCompare(a.date));
  }, [transactions, filters]);

  return (
    <div className="wrap">
      <header className="hero">
        <h1>Gasto Smart</h1>
        <p className="muted">Control simple de ingresos y egresos. Filtros, resumen y persistencia local.</p>
      </header>

      <Summary transactions={filtered.length ? filtered : transactions} />
      <AddTransaction onAdd={addTx} />
      <Filters filters={filters} onChange={setFilters} />
      <TransactionList data={filtered} onDelete={delTx} />
      <ImportExport onImport={importAll} data={transactions} />

      <footer className="foot">© {new Date().getFullYear()} Jose Aguilar</footer>
    </div>
  );
}
