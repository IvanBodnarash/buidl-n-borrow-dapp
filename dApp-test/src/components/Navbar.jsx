const Navbar = () => {
  return (
    <div id="navbar-container">
      <div id="navbar">
        <img src="src/assets/Buidl_n_borrow_round_micro.png" alt="dev mode setup" />
        
      </div>
      <div className="docs-button-container">
      <a
          href="https://docs.google.com/presentation/d/1w-HwvmPlJstPeslL8WXWIGs6wUulcR56/edit?usp=sharing&ouid=103814174963912216601&rtpof=true&sd=true"
          className="btn-radix-blue"
          target="_blank"
          rel="noreferrer">
          Tokenomics
        </a>
        <a
          href="https://github.com/IvanBodnarash/buidl-n-borrow-dapp"
          className="btn-dark"
          target="_blank"
          rel="noreferrer">
          GitHub Repo
        </a>
      </div>

      <div id="connect-btn">
        <radix-connect-button />
      </div>
    </div>
  );
};

export default Navbar;
