import React, { useState } from "react";
import "./Budget.css";
import { iconsImgs } from "../../utils/images";

const demoBudget = [
  { id: 1, title: "Groceries", type: "Food", amount: 250 },
  { id: 2, title: "Internet Bill", type: "Utilities", amount: 120 },
  { id: 3, title: "Gym Membership", type: "Health", amount: 60 }
];

const Budget = () => {
  const [budgets, setBudgets] = useState(demoBudget);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", amount: "" });

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.amount) return;
    setBudgets([
      ...budgets,
      {
        id: Date.now(),
        title: form.title,
        type: form.type,
        amount: form.amount
      }
    ]);
    setForm({ title: "", type: "", amount: "" });
    setShowForm(false);
  };

  const handleRemoveBudget = (id) => {
    setBudgets(budgets.filter((budget) => budget.id !== id));
  };

  return (
    <div className="grid-two-item grid-common grid-c4">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Budget</h3>
        <button className="grid-c-title-icon" onClick={() => setShowForm(!showForm)}>
          <img src={iconsImgs.plus} alt="Add" />
        </button>
      </div>

      <div className="grid-c-top text-silver-v1">
        <h2 className="lg-value">Cash</h2>
        <span className="lg-value">
          $ {budgets.reduce((sum, b) => sum + Number(b.amount), 0)}
        </span>
      </div>

      <div className="grid-c4-content bg-jet">
        {showForm && (
          <form className="budget-form" onSubmit={handleAddBudget}>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <button type="submit">Add</button>
          </form>
        )}

        <div className="grid-items">
          {budgets.map((budget) => (
            <div className="grid-item" key={budget.id}>
              <div className="grid-item-l">
                <div className="icon">
                  <img src={iconsImgs.check} alt="Check" />
                </div>
                <p className="text text-silver-v1">
                  {budget.title} <span>{budget.type}</span>
                </p>
              </div>
              <div className="grid-item-r">
                <span className="text-silver-v1">$ {budget.amount}</span>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveBudget(budget.id)}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budget;
