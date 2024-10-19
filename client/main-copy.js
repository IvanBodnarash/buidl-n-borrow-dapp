import {
  RadixDappToolkit,
  DataRequestBuilder,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { instantiateManifest } from "../manifests/instantiate_lending_platform";
import { withdrawCollateralTokenManifest } from "../manifests/withdraw_collateral_token";
import { borrowManifest } from "../manifests/borrow";
import { repayManifest } from "../manifests/repay";

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVcqlrSqJC25339hzsx6AWjBkQiq3RiK8",
  authDomain: "buidl-and-borrow-dapp.firebaseapp.com",
  projectId: "buidl-and-borrow-dapp",
  storageBucket: "buidl-and-borrow-dapp.appspot.com",
  messagingSenderId: "977347810732",
  appId: "1:977347810732:web:e4e77d7cd59d6b9240d609",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ************ Connect to the Radix network ************
// You can create a dApp definition in the dev console at https://stokenet-console.radixdlt.com/configure-metadata
// then use that account for your dAppDefinitionAddress
const dAppDefinitionAddress =
  "account_tdx_2_12x902e9ey0mxfezmh4vl46s8a7xmrk0az3v3ly0hc00ul94uerhjnv";

// Instantiate Radix Dapp Toolkit to connect to the Radix wallet
const rdt = RadixDappToolkit({
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Buidl & Borrow dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
});

// Instantiate Gateway API client to query the Radix network
const gatewayApi = GatewayApiClient.initialize(rdt.gatewayApi.clientConfig);

// ********** Global states **********
let account; // Users connected wallet account
let loanResourceAddress =
  "resource_tdx_2_1t43qyhrg32yxnrmml49xqq7m45qc2ncfdrexl8yzdf2xulcr24c48z";
let collateralResourceAddress =
  "resource_tdx_2_1t5rm4xnfpvh9559pc9dmh66l54ennr3suqvej48yujz5hwzpajxnw8";
let componentAddress =
  "component_tdx_2_1czwca395uxjxhc6ukkzgz6xwr9muk6vfr2t7gmk6judclatmyh6hr0";
let interestRate,
  collateralRatio,
  maxLoanTokensAvailable,
  maxCollateralTokensAvailable;

const xrdAddress =
  "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc"; //Stokenet XRD resource address

// ************ Connect to wallet and display details ************
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
// Subscribe to updates to the user's shared wallet data, then display the account name and address.

rdt.walletApi.walletData$.subscribe((walletData) => {
  console.log("connected wallet data: ", walletData);
  // Set the account variable to the first and only connected account from the wallet
  account = walletData.accounts[0];

  // Display the account name and address on the page
  document.getElementById("accountName").innerText =
    account?.label ?? "None connected";
  document.getElementById("accountAddress").innerText =
    account?.address ?? "None connected";

  checkIfAdmin(account.address);

  // Fetch and display loan data from Firebase
  fetchLoanData(account.address);
});

// ************ Fetch Loan Data from Firebase ************
const fetchLoanData = async (accountAddress) => {
  const docRef = doc(db, "loans", accountAddress);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const loanData = docSnap.data();
    document.getElementById(
      "loanBalance"
    ).innerText = `You owe ${loanData.loanAmount} LNT`;
    return loanData;
  } else {
    document.getElementById("loanBalance").innerText = "You owe 0 LNT";
    console.log("No loan data found for account:", accountAddress);
    return null;
  }
};

// ************ Save Loan Data to Firebase (used when loan is issued) ************
const saveLoanData = async (accountAddress, loanAmount) => {
  try {
    await setDoc(doc(db, "loans", accountAddress), {
      loanAmount: loanAmount,
      status: "unpaid",
    });
    console.log("Loan data saved for account:", accountAddress);
  } catch (e) {
    console.error("Error saving loan data: ", e);
  }
};

// ************ Instantiate component and fetch component and resource addresses ************
document.getElementById("instantiateComponent").onclick = async function () {
  const packageAddress = document.getElementById("packageAddress").value;
  const manifest = instantiateManifest(packageAddress);
  console.log("Instantiate Manifest: ", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
  console.log("Instantiate Result: ", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Instantiate transaction status:", transactionStatus);

  // Fetch the details of changes committed to ledger from Gateway API
  const committedDetails = await gatewayApi.transaction.getCommittedDetails(
    result.value.transactionIntentHash
  );
  console.log("Instantiate committed details:", committedDetails);

  // Set addresses from details committed to the ledger in the transaction
  loanResourceAddress =
    committedDetails.transaction.affected_global_entities[1];
  collateralResourceAddress =
    committedDetails.transaction.affected_global_entities[2];
  componentAddress = committedDetails.transaction.affected_global_entities[3];

  console.log("loanResourceAddress: ", loanResourceAddress);
  console.log("collateralResourceAddress: ", collateralResourceAddress);
  console.log("componentAddress: ", componentAddress);

  showAddresses();
  fetchAndShowLendingAppState();
};

function showAddresses() {
  document.getElementById("loanResourceAddress").innerText =
    loanResourceAddress ?? "None";
  document.getElementById("collateralResourceAddress").innerText =
    collateralResourceAddress ?? "None";
  document.getElementById("componentAddress").innerText =
    componentAddress ?? "None";
}

// ************ Fetch and update displayed component state ************
async function fetchAndShowLendingAppState() {
  // Use Gateway API to fetch component details
  if (componentAddress) {
    const componentDetails =
      await gatewayApi.state.getEntityDetailsVaultAggregated(componentAddress);
    console.log("Component Details:", componentDetails);

    const loanTokenResource = componentDetails.fungible_resources.items.find(
      (resource) => resource.resource_address === loanResourceAddress
    );

    const collateralTokenResource =
      componentDetails.fungible_resources.items.find(
        (resource) => resource.resource_address === collateralResourceAddress
      );

    if (loanTokenResource) {
      const loanTokenAmount = loanTokenResource.vaults.items[0].amount;
      console.log("Available LNT:", loanTokenAmount);
      maxLoanTokensAvailable = loanTokenAmount;
      document.getElementById("loanTokenAmountDisplay").innerText =
        loanTokenAmount;
    } else {
      console.error("LNT Token resource not found.");
    }

    if (collateralTokenResource) {
      const collateralTokenAmount =
        collateralTokenResource.vaults.items[0].amount;
      console.log("Available CLT:", collateralTokenAmount);
      maxCollateralTokensAvailable = collateralTokenAmount;
      document.getElementById("collateralAmountDisplay").innerText =
        collateralTokenAmount;
    } else {
      console.error("LNT Token resource not found.");
    }

    interestRate = componentDetails.details.state.fields.find(
      (resource) => resource.field_name === "interest_rate"
    );

    collateralRatio = componentDetails.details.state.fields.find(
      (resource) => resource.field_name === "collateral_ratio"
    );

    console.log("Interest Rate: ", interestRate.value);
    console.log("Collateral Ratio: ", collateralRatio.value);
    console.log("Max Loan Tokens Available: ", maxLoanTokensAvailable);
    console.log(
      "Max Collateral Tokens Available: ",
      maxCollateralTokensAvailable
    );
  }
}

// ************ Get Collateral Token ************
document.getElementById("getCollateralToken").onclick = async function () {
  const getCollateralAmount = parseFloat(
    document.getElementById("getCollateralAmountField").value
  );

  // Check if the input field is empty or not a number
  if (getCollateralAmount === "" || isNaN(getCollateralAmount)) {
    alert("Please enter an amount.");
    clearInputs();
    return;
  }

  console.log("getCollateralAmount: ", getCollateralAmount);
  console.log("maxCollateralTokensAvailable: ", maxCollateralTokensAvailable);

  if (getCollateralAmount > maxCollateralTokensAvailable) {
    alert("Insufficient CLT tokens available.");
    clearInputs();
    return;
  }

  const manifest = withdrawCollateralTokenManifest(
    account.address,
    collateralResourceAddress,
    componentAddress,
    getCollateralAmount
  );
  console.log("get collateral tokens manifest:", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  console.log("Get CLT Token result:", result);
  if (result.isErr()) throw result.error;
  console.log("Get CLT Token result:", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Get CLT Token transaction status:", transactionStatus);

  // Fetch and update the gumball amount and earnings values displayed
  clearInputs();
  fetchAndShowLendingAppState();
};

// Function to clear the input fields
function clearInputs() {
  document.getElementById("borrowAmount").value = "";
  document.getElementById("collateralAmount").value = "";
  document.getElementById("getCollateralAmountField").value = "";
  document.getElementById("repayAmount").value = "";
}

// ************ Borrow LNT Token with Validation ************
document.getElementById("borrow").onclick = async function () {
  const borrowAmount = parseFloat(
    document.getElementById("borrowAmount").value
  );
  const collateralAmount = parseFloat(
    document.getElementById("collateralAmount").value
  );

  console.log("Borrow Amount: ", borrowAmount);
  console.log("Collateral Amount: ", collateralAmount);

  // Check if input values are valid
  if (borrowAmount > maxLoanTokensAvailable) {
    alert(
      `You can only borrow up to ${maxLoanTokensAvailable} LNT. Please enter a lower amount.`
    );
    clearInputs();
    return;
  }

  if (isNaN(borrowAmount) || isNaN(collateralAmount)) {
    alert("Please enter valid numbers");
    clearInputs();
    return;
  }

  if (borrowAmount <= 0 || collateralAmount <= 0) {
    alert("Please enter positive numbers");
    clearInputs();
    return;
  }

  // Minimum collateral calculation
  const minCollateral = borrowAmount * collateralRatio.value;

  // Check if collateral values are valid
  if (collateralAmount < minCollateral) {
    alert(
      `You need at least ${minCollateral} CLT to borrow ${borrowAmount} LNT`
    );
    clearInputs();
    return;
  }

  const manifest = borrowManifest(
    account.address,
    collateralResourceAddress,
    componentAddress,
    collateralAmount,
    borrowAmount
  );
  console.log("borrow manifest:", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  console.log("Borrow Token result:", result);
  if (result.isErr()) throw result.error;
  console.log("Borrow Token result:", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Borrow Token transaction status:", transactionStatus);

  
  // Якщо транзакція успішна, зберігаємо дані
  if (transactionStatus.status === "CommittedSuccess") {
    console.log("Transaction successful, saving loan data...");

    const currentLoanData = await fetchLoanData(account.address);

    let totalLoanAmount = borrowAmount;

    if (currentLoanData && currentLoanData.loanAmount) {
        totalLoanAmount += currentLoanData.loanAmount;
    }

    console.log("Total loan amount:", totalLoanAmount);

    await saveLoanData(account.address, totalLoanAmount);
  } else {
    console.log("Transaction failed or pending");
  }

  fetchLoanData(account.address);

  // Fetch and update the gumball amount and earnings values displayed
  clearInputs();
  fetchAndShowLendingAppState();
};

// ************ Display and autofill minimum collateral in real time ************
document.getElementById("borrowAmount").addEventListener("input", function () {
  const borrowAmount = parseFloat(
    document.getElementById("borrowAmount").value
  );

  if (!isNaN(borrowAmount) && borrowAmount > 0) {
    const minCollateral = borrowAmount * collateralRatio.value;
    document.getElementById(
      "minCollateralDisplay"
    ).innerText = `Minimum Collateral: ${minCollateral.toFixed(2)} CLT`;

    // Autofill the input field with the minimum collateral amount
    const collateralField = document.getElementById("collateralAmount");
    if (!collateralField.dataset.userChanged) {
      collateralField.value = minCollateral.toFixed(1);
    }
  } else {
    document.getElementById("minCollateralDisplay").innerText = "";
  }
});

// If user manually changes the input field, clear the minimum collateral display
document
  .getElementById("collateralAmount")
  .addEventListener("input", function () {
    this.dataset.userChanged = true;
  });

// ************ Repay Loan Token with Validation ************
document.getElementById("repay").onclick = async function () {
  const repayAmount = parseFloat(document.getElementById("repayAmount").value);

  if (isNaN(repayAmount) || repayAmount <= 0) {
    alert("Please enter a valid repay amount.");
    clearInputs();
    return;
  }

  const currentLoanData = await fetchLoanData(account.address);

  if (!currentLoanData || currentLoanData.loanAmount <= 0) {
    alert("You don't have any outstanding loans.");
    return;
  }

  const remainingDebt = currentLoanData.loanAmount - repayAmount;
  console.log("Remaining debt after repayment:", remainingDebt);

  if (remainingDebt < 0) {
    alert("You are trying to repay more than your debt.");
    clearInputs();
    return;
  }

  const manifest = repayManifest(
    account.address,
    componentAddress,
    loanResourceAddress,
    repayAmount
  );
  console.log("repay manifest:", manifest);

  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  console.log("Repay Token result:", result);
  if (result.isErr()) throw result.error;
  console.log("Repay Token result:", result.value);

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Repay Token transaction status:", transactionStatus);

  if (transactionStatus.status === "CommittedSuccess") {
    console.log("Transaction successful, updating loan data...");

    if (remainingDebt === 0) {
        await repayLoan(account.address, 0, "paid");
        document.getElementById("loanBalance").innerText = "You owe 0 LNT";
    } else {
        await repayLoan(account.address, remainingDebt, "unpaid");
        document.getElementById("loanBalance").innerText = `You owe ${remainingDebt} LNT`;
    }
  } else {
    console.log("Transaction failed or pending");
  }

  clearInputs();
  fetchAndShowLendingAppState();
};

// ************ Repay Loan in Firebase ************
const repayLoan = async (accountAddress, remainingAmount, status) => {
  try {
    await setDoc(doc(db, "loans", accountAddress), {
      loanAmount: remainingAmount,
      status: status,
    });
    console.log(`Loan data updated for account ${accountAddress}: ${remainingAmount} LNT, status: ${status}`);
  } catch (e) {
    console.error("Error updating loan data: ", e);
  }
};

// ************ Display Component Addresses ************

function checkIfAdmin(address) {
    if (address === dAppDefinitionAddress) {
        document.getElementById("instantiateComponentDiv").style.display = "block";
    } else {
        document.getElementById("instantiateComponentDiv").style.display = "none";
    }
}


showAddresses();
fetchAndShowLendingAppState();
