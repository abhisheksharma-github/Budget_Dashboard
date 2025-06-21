import { useState } from "react";
import { iconsImgs } from "../../utils/images";
import "./Cards.css";

const initialCards = [
    {
        id: 1,
        balance: 1200.5,
        last4: "4567",
        expiry: "09/26"
    },
   
];

function getCardType(last4) {
    if (!last4) return "Unknown";
    const firstDigit = last4[0];
    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5") return "Mastercard";
    return "Card";
}

const Cards = () => {
    const [cards, setCards] = useState(initialCards);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        balance: "",
        last4: "",
        expiry: ""
    });
    const [error, setError] = useState("");

    const handleAddCardClick = () => {
        setShowForm(true);
        setForm({ balance: "", last4: "", expiry: "" });
        setError("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (
            form.balance === "" ||
            isNaN(Number(form.balance)) ||
            form.last4.length !== 4 ||
            !/^\d{4}$/.test(form.last4) ||
            !/^\d{2}\/\d{2}$/.test(form.expiry)
        ) {
            setError("Please fill all fields correctly.");
            return;
        }
        const newCard = {
            id: Date.now(),
            balance: Number(form.balance),
            last4: form.last4,
            expiry: form.expiry
        };
        setCards([...cards, newCard]);
        setShowForm(false);
    };

    const handleRemoveCard = (id) => {
        setCards(cards.filter(card => card.id !== id));
    };

    return (
        <div className="grid-one-item grid-common grid-c1">
            <div className="grid-c-title">
                <h3 className="grid-c-title-text">💳 Cards</h3>
                <button className="grid-c-title-icon" onClick={handleAddCardClick} title="Add Card">
                    <img src={iconsImgs.plus} alt="Add Card" />
                </button>
            </div>

            {showForm && (
                <form className="add-card-form animated" onSubmit={handleFormSubmit}>
                    <input
                        type="number"
                        name="balance"
                        placeholder="Balance"
                        value={form.balance}
                        min={0}
                        step="0.01"
                        onChange={handleFormChange}
                        required
                    />
                    <input
                        type="text"
                        name="last4"
                        placeholder="Last 4 digits"
                        value={form.last4}
                        maxLength={4}
                        pattern="\d{4}"
                        onChange={handleFormChange}
                        required
                    />
                    <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={form.expiry}
                        pattern="\d{2}/\d{2}"
                        onChange={handleFormChange}
                        required
                    />
                    {error && <div className="form-error">{error}</div>}
                    <div className="form-btns">
                        <button type="submit" className="btn-primary">Add Card</button>
                        <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            )}

            {cards.length === 0 && !showForm && (
                <div className="no-cards-placeholder">
                    <img src={iconsImgs.card} alt="No Cards" style={{ width: 60, opacity: 0.5 }} />
                    <p>No cards yet. Click <b>+</b> to add your first card!</p>
                </div>
            )}

            <div className="cards-list">
                {cards.map((card) => (
                    <div className="grid-c1-content card-animated" key={card.id}>
                        <div className="card-header">
                            <span className="card-type">{getCardType(card.last4)}</span>
                            <button className="remove-card-btn" title="Remove Card" onClick={() => handleRemoveCard(card.id)}>
                                ✕
                            </button>
                        </div>
                        <p>Balance</p>
                        <div className="lg-value">$ {card.balance.toLocaleString()}</div>
                        <div className="card-wrapper">
                            <span className="card-pin-hidden">**** **** **** </span>
                            <span>{card.last4}</span>
                        </div>
                        <div className="card-logo-wrapper">
                            <div>
                                <p className="text text-silver-v1 expiry-text">Expires</p>
                                <p className="text text-sm text-white">{card.expiry}</p>
                            </div>
                            <div className="card-logo">
                                <div className="logo-shape1"></div>
                                <div className="logo-shape2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cards;
