import { useState } from "react";
import { iconsImgs } from "../../utils/images";
import "./Loans.css";

const Loans = () => {
    const [target, setTarget] = useState(500000);
    const [reached, setReached] = useState(250000);
    const [showModal, setShowModal] = useState(false);
    const percent = Math.min(Math.round((reached / target) * 100), 100);

    // SVG circle properties
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTarget = parseInt(e.target.target.value, 10);
        const newReached = parseInt(e.target.reached.value, 10);
        if (!isNaN(newTarget) && !isNaN(newReached)) {
            setTarget(newTarget);
            setReached(newReached);
        }
        setShowModal(false);
    };

    return (
        <div className="subgrid-two-item grid-common grid-c7">
            <div className="grid-c-title">
                <h3 className="grid-c-title-text">Loans</h3>
                <button className="grid-c-title-icon" onClick={() => setShowModal(true)}>
                    <img src={iconsImgs.plus} alt="Add" />
                </button>
            </div>

            <div className="grid-c7-content">
                <div className="progress-bar">
                    <div className="percent">
                        <svg width="120" height="120">
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#444"
                                strokeWidth="10"
                                fill="none"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#8FFF00"
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                style={{ transition: "stroke-dashoffset 0.5s" }}
                            />
                        </svg>
                        <div className="number">
                            <h3>
                                {percent}
                                <span>%</span>
                            </h3>
                        </div>
                    </div>
                </div>

                <ul className="data-list">
                    <li className="data-item text-silver-v1">
                        <span className="data-item-text">Savings Target</span>
                        <span className="data-item-value">$ {target.toLocaleString()}</span>
                    </li>
                    <li className="data-item text-silver-v1">
                        <span className="data-item-text">Target Reached</span>
                        <span className="data-item-value">$ {reached.toLocaleString()}</span>
                    </li>
                </ul>
            </div>

            {showModal && (
                <div className="modal">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <label>
                            Savings Target:
                            <input type="number" name="target" defaultValue={target} min="1" required />
                        </label>
                        <label>
                            Target Reached:
                            <input type="number" name="reached" defaultValue={reached} min="0" required />
                        </label>
                        <div className="modal-actions">
                            <button type="submit" className="btn-glow">Update</button>
                            <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Loans;
