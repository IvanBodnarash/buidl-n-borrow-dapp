import { withdrawCollateralTokenManifest } from "../manifests/withdraw_collateral_token";
import { gatewayApi, rdt } from "../radix/radixService";
import { clearInputs } from "../utils/clearInputs";

// ************ Get Collateral Token ************
export const getCollateralToken = async (
  account,
  collateralResourceAddress,
  componentAddress,
  maxCollateralTokensAvailable
) => {
  const getCollateralAmount = parseFloat(
    document.getElementById("getCollateralAmountField").value
  );

  // Check if the input field is empty or not a number
  if (isNaN(getCollateralAmount) || getCollateralAmount <= 0) {
    alert("Please enter a valid collateral amount.");
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

  if (transactionStatus.status === "CommittedSuccess") {
    console.log("Collateral tokens withdrawn successfully.");
  } else {
    console.log("Transaction failed or pending.");
  }

  clearInputs();
};
