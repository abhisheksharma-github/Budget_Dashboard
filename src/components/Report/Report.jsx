import { useState } from "react";
import { iconsImgs } from "../../utils/images";
import "./Report.css";

// Demo data
const demoReport = [
  { id: 1, month: "Jan", value1: 50, value2: 70 },
  { id: 2, month: "Feb", value1: 40, value2: 60 },
  { id: 3, month: "Mar", value1: 30, value2: 50 },
];

const Report = () => {
  const [reports, setReports] = useState(demoReport);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ month: "", value1: "", value2: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      month: form.month,
      value1: Math.min(100, parseInt(form.value1)),
      value2: Math.min(100, parseInt(form.value2)),
    };
    setReports([...reports, newEntry]);
    setForm({ month: "", value1: "", value2: "" });
    setShowForm(false);
  };

  const handleRemove = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  return (
    <div className="grid-one-item grid-common grid-c3">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Report</h3>
        <button className="grid-c-title-icon" onClick={() => setShowForm(!showForm)}>
          <img src={iconsImgs.plus} alt="Add" />
        </button>
      </div>

      {showForm && (
        <form className="budget-form" onSubmit={handleAdd} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Value 1"
            value={form.value1}
            onChange={(e) => setForm({ ...form, value1: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Value 2"
            value={form.value2}
            onChange={(e) => setForm({ ...form, value2: e.target.value })}
            required
          />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="bar-graph-container">
        <div className="bar-graph-axis">
          {[100, 75, 50, 25, 0].map((val) => (
            <span key={val}>{val}</span>
          ))}
        </div>

        <div className="bar-graph-bars">
          {reports.map((r) => (
            <div className="bar-group" key={r.id}>
              <div className="bar-wrap">
                <div className="bar bar-1" style={{ height: `${r.value1}%` }}></div>
                <div className="bar bar-2" style={{ height: `${r.value2}%` }}></div>
              </div>
              <div className="bar-label">
                {r.month}
                <button onClick={() => handleRemove(r.id)} className="remove-btn">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;
