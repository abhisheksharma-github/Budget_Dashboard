import { useState } from "react";
import { iconsImgs, personsImgs } from "../../utils/images";
import "./Savings.css";

const demoData = [
  {
    id: 1,
    title: "Emergency Fund",
    saving_amount: 10000,
    amount_left: 3000,
    date_taken: "2025-06-01"
  },
  
];

const Savings = () => {
  const [savings, setSavings] = useState(demoData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    saving_amount: "",
    amount_left: "",
    date_taken: ""
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newSaving = {
      id: Date.now(),
      title: form.title,
      saving_amount: Number(form.saving_amount),
      amount_left: Number(form.amount_left),
      date_taken: form.date_taken
    };
    setSavings([...savings, newSaving]);
    setForm({ title: "", saving_amount: "", amount_left: "", date_taken: "" });
    setShowForm(false);
  };

  const handleRemove = (id) => {
    setSavings(savings.filter((item) => item.id !== id));
  };

  return (
    <div className="subgrid-two-item grid-common grid-c6">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Savings</h3>
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
            type="number"
            placeholder="Saving Amount"
            value={form.saving_amount}
            onChange={(e) => setForm({ ...form, saving_amount: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Amount Left"
            value={form.amount_left}
            onChange={(e) => setForm({ ...form, amount_left: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Date Taken"
            value={form.date_taken}
            onChange={(e) => setForm({ ...form, date_taken: e.target.value })}
            required
          />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="grid-c6-content">
        <div className="grid-items">
          {savings.map((saving) => {
            const percent = Math.min(
              100,
              Math.round(
                ((saving.saving_amount - saving.amount_left) / saving.saving_amount) * 100
              )
            );
            return (
              <div className="grid-item" key={saving.id}>
                <div className="grid-item-top">
                  <div className="grid-item-top-l">
                    <div className="avatar img-fit-cover">
                      <img src={personsImgs.person_one} alt="avatar" />
                    </div>
                    <p className="text text-silver-v1">{saving.title}</p>
                  </div>
                  <div className="grid-item-top-r">
                    <span className="text-silver-v1">$ {saving.saving_amount}</span>
                    <button className="remove-btn" onClick={() => handleRemove(saving.id)} title="Remove">
                      &times;
                    </button>
                  </div>
                </div>
                <div className="grid-item-bottom">
                  <div className="grid-item-badges">
                    <span className="grid-item-badge">Date taken: {saving.date_taken}</span>
                    <span className="grid-item-badge">Amount left: $ {saving.amount_left}</span>
                  </div>
                  <div className="grid-item-progress">
                    <div
                      className="grid-item-fill"
                      style={{ width: `${percent}%`, background: "#8FFF00" }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Savings;
