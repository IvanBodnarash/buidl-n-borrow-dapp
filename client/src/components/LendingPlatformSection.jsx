import { useState, useEffect } from "react";
import { useAccount } from "../AccountContext";
import { ClaimHello } from "./ClaimHello";
import { CustomSelect } from "./CustomSelect";

const LendingPlatformSection = () => {
  const { accounts, selectedAccount } = useAccount();
  const [enableButtons, setEnableButtons] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [accounts]);

  return (
    <>
      <div className="heading-section">
        <h2>Get Your Hello Token</h2>
        <p className="head-text">
          Claim your <span className="hello-token-pink">Hello Token</span>
        </p>
      </div>

      <div className="hello-token-container">
        <form>
          <div>
            <h3>Borrow</h3>
            <input type="number" placeholder="Type your ammount to borrow" />
          </div>
          <div>
            <h3>Collateral</h3>
            <input type="number" placeholder="Type your ammount to borrow" />
          </div>
          <div>
            <button
              type="submit"
              className="btn-dark"
              disabled={!enableButtons}
            >
              Borrow
            </button>
          </div>
        </form>
      </div>

      <div className="hello-token-container">
        <form>
          <div>
            <h3>Repay loan amount</h3>
            <input type="number" placeholder="Type your ammount to borrow" />
          </div>
          <div>
            <h3>Collateral</h3>
            <input type="number" placeholder="Type your ammount to borrow" />
          </div>
          <div>
            <button
              type="submit"
              className="btn-dark"
              disabled={!enableButtons}
            >
              Repay
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LendingPlatformSection;
