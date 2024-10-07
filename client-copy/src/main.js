import { borrowTokens } from "./components/borrow";
import { repayTokens } from "./components/repay";
import { getCollateralToken } from "./components/collateral";
import { displayAndAutofillCollateral } from "./components/collateralAutofill";
import { instantiateComponent } from "./components/admin";
import { rdt, checkIfAdmin } from "./radix/radixService";
import { fetchLoanData } from "./firebase/firebaseService";
import { fetchAndShowLendingAppState } from "./components/stateDisplay";

let loanResourceAddress =
  "resource_tdx_2_1t43qyhrg32yxnrmml49xqq7m45qc2ncfdrexl8yzdf2xulcr24c48z";
let collateralResourceAddress =
  "resource_tdx_2_1t5rm4xnfpvh9559pc9dmh66l54ennr3suqvej48yujz5hwzpajxnw8";
let componentAddress =
  "component_tdx_2_1czwca395uxjxhc6ukkzgz6xwr9muk6vfr2t7gmk6judclatmyh6hr0";

let account;
let maxLoanTokensAvailable;

const updateLoanBalance = async (accountAddress) => {
  const loanData = await fetchLoanData(accountAddress);

  if (loanData && loanData.loanAmount) {
    document.getElementById(
      "loanBalance"
    ).innerText = `You owe ${loanData.loanAmount} LNT`;
  } else {
    document.getElementById("loanBalance").innerText = "You owe 0 LNT";
  }
};

rdt.walletApi.walletData$.subscribe(async (walletData) => {
  account = walletData.accounts[0];
  document.getElementById("accountName").innerText =
    account?.label ?? "None connected";
  document.getElementById("accountAddress").innerText =
    account?.address ?? "None connected";

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
    componentAddress = result.componentAddress;
    document.getElementById("componentAddress").innerText = componentAddress;
  } else {
    console.error("Failed to instantiate component:", result.error);
  }

  if (packageAddress) {
    await instantiateComponent(account, packageAddress);
    await fetchAndShowLendingAppState(
      componentAddress,
      loanResourceAddress,
      collateralResourceAddress
    );
  } else {
    console.error("Package address is required for instantiation.");
  }
};
