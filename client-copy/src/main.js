import { borrowTokens } from "./components/borrow";
import { repayTokens } from "./components/repay";
import { getCollateralToken } from "./components/collateral";
import { displayAndAutofillCollateral } from "./components/collateralAutofill";
import { instantiateComponent } from "./components/admin";
import { rdt, checkIfAdmin } from "./radix/radixService";
import { fetchLoanData } from "./firebase/firebaseService";
import { fetchAndShowLendingAppState } from "./components/stateDisplay";

let loanResourceAddress = "resource_tdx_2_1t43guqq9jgg5rruvhvjhjutl3eg3e7q20ynw638a97ywwhujqts0f5";
let collateralResourceAddress = "resource_tdx_2_1thltukdcvfp583mhrcrd2qzvq3gzrt82vapucza5e087d8v0wtn3kw";
let componentAddress = "component_tdx_2_1cqvvv0900d59k0ehhgde7mzwc6jlx46z2l7g6nh932jvfnwfdpn73u";

// let loanResourceAddress =
//   "resource_tdx_2_1t43qyhrg32yxnrmml49xqq7m45qc2ncfdrexl8yzdf2xulcr24c48z";
// let collateralResourceAddress =
//   "resource_tdx_2_1t5rm4xnfpvh9559pc9dmh66l54ennr3suqvej48yujz5hwzpajxnw8";
// let componentAddress =
//   "component_tdx_2_1czwca395uxjxhc6ukkzgz6xwr9muk6vfr2t7gmk6judclatmyh6hr0";

let account;
let maxLoanTokensAvailable;
let maxCollateralTokensAvailable;

const updateLoanBalance = async (accountAddress) => {
  const loanData = await fetchLoanData(accountAddress);

  const loanBalanceElements = document.querySelectorAll("#loanBalance");

  if (loanData && loanData.loanAmount) {
    loanBalanceElements.forEach((element) => {
      element.innerText = `You owe ${loanData.loanAmount} LNT`;
    });
  } else {
    loanBalanceElements.forEach((element) => {
      element.innerText = "You owe 0 LNT";
    });
  }
};

rdt.walletApi.walletData$.subscribe(async (walletData) => {
  if (!walletData || !walletData.accounts || walletData.accounts.length === 0) {
    document.querySelectorAll("#accountInfo").forEach((accountInfo) => {
      accountInfo.style.display = "none";
    });
    document
      .querySelectorAll("#connectYourAccount")
      .forEach((connectYourAccount) => {
        connectYourAccount.innerText = "Connect your account to use this app";
      });
    return;
  }

  document
    .querySelectorAll("#connectYourAccount")
    .forEach((connectYourAccount) => {
      connectYourAccount.innerText = "";
    });

  account = walletData.accounts[0];

  // const shortAccountAddress = `${account?.address.slice(
  //   0,
  //   18
  // )} .... ${account?.address.slice(-8)}`;

  document.querySelectorAll("#accountInfo").forEach((accountInfo) => {
    accountInfo.style.display = "block";

    const accountNameElement = accountInfo.querySelector("#accountName");
    const accountAddressElement = accountInfo.querySelector("#accountAddress");

    accountNameElement.innerText = account?.label ?? "None connected";
    accountAddressElement.innerText =
      shortenAddress(account?.address) ?? "None connected";
  });

  checkIfAdmin(account.address);

  await updateLoanBalance(account.address);

  if (
    componentAddress === "None" ||
    loanResourceAddress === "None" ||
    collateralResourceAddress === "None"
  ) {
    console.error("Missing required addresses:", {
      componentAddress,
      loanResourceAddress,
      collateralResourceAddress,
    });
    return;
  } else {
    document.getElementById("loanResourceAddress").innerText =
      shortenAddress(loanResourceAddress);
    document.getElementById("collateralResourceAddress").innerText =
      shortenAddress(collateralResourceAddress);
    document.getElementById("componentAddress").innerText =
      shortenAddress(componentAddress);
  }

  const platformState = await fetchAndShowLendingAppState(
    componentAddress,
    loanResourceAddress,
    collateralResourceAddress
  );

  const collateralRatio = platformState?.collateralRatio;
  if (collateralRatio) {
    displayAndAutofillCollateral(collateralRatio);
  }

  maxLoanTokensAvailable = platformState?.maxLoanTokensAvailable;
});

function shortenAddress(address) {
  return `${address.slice(0, 18)} .... ${address.slice(-8)}`;
}

document.getElementById("borrow").onclick = async () => {
  if (componentAddress && loanResourceAddress && collateralResourceAddress) {
    await borrowTokens(
      account,
      collateralResourceAddress,
      componentAddress,
      maxLoanTokensAvailable
    );

    await fetchAndShowLendingAppState(
      componentAddress,
      loanResourceAddress,
      collateralResourceAddress
    );

    await updateLoanBalance(account.address);
  } else {
    console.error("Missing required addresses for borrow operation.");
  }
};

document.getElementById("repay").onclick = async () => {
  if (componentAddress && loanResourceAddress) {
    await repayTokens(account, componentAddress, loanResourceAddress);

    await fetchAndShowLendingAppState(
      componentAddress,
      loanResourceAddress,
      collateralResourceAddress
    );

    await updateLoanBalance(account.address);
  } else {
    console.error("Missing required addresses for repay operation.");
  }
};

document.getElementById("getCollateralToken").onclick = async () => {
  if (componentAddress && collateralResourceAddress) {
    await getCollateralToken(
      account,
      collateralResourceAddress,
      componentAddress,
      maxCollateralTokensAvailable
    );

    await fetchAndShowLendingAppState(
      componentAddress,
      loanResourceAddress,
      collateralResourceAddress
    );
  } else {
    console.error("Missing required addresses for get collateral operation.");
  }
};

document.getElementById("instantiateComponent").onclick = async () => {
  const packageAddress = document.getElementById("packageAddress").value;

  const result = await instantiateComponent(account, packageAddress);

  if (result.success) {
    console.log("Component instantiated successfully.");
    loanResourceAddress = result.loanResourceAddress;
    collateralResourceAddress = result.collateralResourceAddress;
    componentAddress = result.componentAddress;
    document.getElementById("loanResourceAddress").innerText =
      loanResourceAddress;
    document.getElementById("collateralResourceAddress").innerText =
      collateralResourceAddress;
    document.getElementById("componentAddress").innerText = componentAddress;
  } else {
    console.error("Failed to instantiate component:", result.error);
  }

  if (packageAddress) {
    await instantiateComponent(account, packageAddress);
    await fetchAndShowLendingAppState(
      loanResourceAddress,
      collateralResourceAddress,
      componentAddress
    );
  } else {
    console.error("Package address is required for instantiation.");
  }
};

document.getElementById("accountButton").onclick = () => {
  document.getElementById("sidebar").classList.toggle("translate-x-full");
};

document.getElementById("closeSidebar").onclick = () => {
  document.getElementById("sidebar").classList.toggle("translate-x-full");
};
