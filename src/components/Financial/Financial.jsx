import { useState } from "react";
import { iconsImgs } from "../../utils/images";

const Financial = () => {
    const [showAdvice, setShowAdvice] = useState(true);

    const tips = [
        "Track your daily expenses to avoid overspending.",
        "Set monthly savings goals.",
        "Avoid taking high-interest loans.",
        "Invest a portion of your income regularly."
    ];

    return (
        <div className="subgrid-two-item grid-common grid-c8">
            <div className="grid-c-title">
                <h3 className="grid-c-title-text">Financial Advice</h3>
                <button
                    className="grid-c-title-icon"
                    onClick={() => setShowAdvice((prev) => !prev)}
                    title={showAdvice ? "Hide Advice" : "Show Advice"}
                >
                    <img src={iconsImgs.plus} alt="Toggle Advice" />
                </button>
            </div>

            {showAdvice && (
                <div className="grid-c8-content">
                    <ul className="text text-silver-v1">
                        {tips.map((tip, index) => (
                            <li key={index} style={{ marginBottom: "10px" }}>
                                • {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Financial;
