import { useState } from "react";
import { iconsImgs } from "../../utils/images";
import "./Subscriptions.css";

// 🧪 Demo data shown initially
const demoData = [
  {
    id: 1,
    title: "Netflix",
    due_date: "2025-06-30",
    amount: 499,
  },
  {
    id: 2,
    title: "Spotify",
    due_date: "2025-07-01",
    amount: 199,
  },
];

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState(demoData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", due_date: "", amount: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    const newSub = {
      id: Date.now(),
      title: form.title,
      due_date: form.due_date,
      amount: Number(form.amount),
    };
    setSubscriptions([...subscriptions, newSub]);
    setForm({ title: "", due_date: "", amount: "" });
    setShowForm(false);
  };

  const handleRemove = (id) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  return (
    <div className="subgrid-two-item grid-common grid-c5">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Subscriptions</h3>
        <button className="grid-c-title-icon" onClick={() => setShowForm(!showForm)}>
          <img src={iconsImgs.plus} alt="Add" />
        </button>
      </div>

      {showForm && (
        <form className="budget-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
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

      <div className="grid-c5-content">
        <div className="grid-items">
          {subscriptions.map((sub) => (
            <div className="grid-item" key={sub.id}>
              <div className="grid-item-l">
                <div className="icon">
                  <img src={iconsImgs.alert} alt="alert" />
                </div>
                <p className="text text-silver-v1">
                  {sub.title} <span>due {sub.due_date}</span>
                </p>
              </div>
              <div className="grid-item-r">
                <span className="text-silver-v1">$ {sub.amount}</span>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(sub.id)}
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

export default Subscriptions;
