import { useState } from "react";
import "./Transactions.css";
import { iconsImgs } from "../../utils/images";
import { transactions as demoTransactions } from "../../data/data";

const Transactions = () => {
  const [transactionList, setTransactionList] = useState(demoTransactions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    date: "",
    amount: "",
    image: iconsImgs.wallet // default icon
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      name: form.name,
      date: form.date,
      amount: parseFloat(form.amount),
      image: form.image
    };
    setTransactionList([...transactionList, newTransaction]);
    setForm({ name: "", date: "", amount: "", image: iconsImgs.wallet });
    setShowForm(false);
  };

  const handleRemove = (id) => {
    setTransactionList(transactionList.filter(tx => tx.id !== id));
  };

  return (
    <div className="grid-one-item grid-common grid-c2">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">All Transactions</h3>
        <button className="grid-c-title-icon" onClick={() => setShowForm(!showForm)}>
          <img src={iconsImgs.plus} alt="Add" />
        </button>
      </div>

      {showForm && (
        <form className="budget-form" onSubmit={handleAdd} style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
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

      <div className="grid-content">
        <div className="grid-items">
          {transactionList.map((transaction) => (
            <div className="grid-item" key={transaction.id}>
              <div className="grid-item-l">
                <div className="avatar img-fit-cover">
                  <img src={transaction.image} alt="avatar" />
                </div>
                <p className="text text-silver-v1">
                  {transaction.name} <span>{transaction.date}</span>
                </p>
              </div>
              <div className="grid-item-r">
                <span className="text-scarlet">$ {transaction.amount}</span>
                <button
                  className="remove-btn"
                  title="Remove"
                  onClick={() => handleRemove(transaction.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4d4f",
                    fontSize: "1.2rem",
                    marginLeft: "8px",
                    cursor: "pointer"
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
