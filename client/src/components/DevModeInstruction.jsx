const DevModeInstruction = () => {
  return (
    <>
      <section className="heading-section">
        <h1>
          Buidl & Borrow <br />
          Lending & Borrowing Crypto
        </h1>
        <p className="head-text">
        EBC10 x Radix Hackathon
        </p>
      </section>

      <div className="dev-mode-instruction-container">
        <div className="dev-mode-content-container">
          <div className="dev-mode-steps-col">
            <div className="dev-mode-step-container">
              <h2 className="step-nums">Step 1</h2>
              <h3 className="step-heading">
                Lorem Ipsum Wallet
              </h3>
              <p className="step-text">
                Open the Radix Wallet, then go to Lorem Ipsum -{">"} App
                settings -{">"} Dev Mode.
              </p>
            </div>
            <div className="dev-mode-step-container">
              <h2 className="step-nums">Step 2</h2>
              <h3 className="step-heading">Lorem Ipsum</h3>
              <p className="step-text">
                Go to Lorem Ipsum -{">"} Lorem Ipsum gate -{">"} Lorem Ipsum Lorem Ipsum 
                Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum.
              </p>
            </div>

          </div>

          <div className="dev-mode-gif-container">
            <div className="dev-mode-gif">
              <img src="src/assets/Buidl_n_borrow_logo.png" alt="mvp process" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DevModeInstruction;
