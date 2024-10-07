import { repayManifest } from "../manifests/repay";
import { fetchLoanData, saveLoanData } from "../firebase/firebaseService";
import { gatewayApi, rdt } from "../radix/radixService";
import { clearInputs } from "../utils/clearInputs";

// ************ Repay Loan Token with Validation ************
export const repayTokens = async (account, componentAddress, loanResourceAddress) => {
  const repayAmount = parseFloat(document.getElementById("repayAmount").value);
  const currentLoanData = await fetchLoanData(account.address);

  if (
    !currentLoanData ||
    currentLoanData.loanAmount <= 0 ||
    isNaN(repayAmount) ||
    repayAmount <= 0
  ) {
    alert("Invalid repay amount or no outstanding loan.");
    return;
  }

  const remainingDebt = currentLoanData.loanAmount - repayAmount;
  console.log("Remaining debt after repayment:", remainingDebt);

  if (remainingDebt < 0) {
    alert("You are trying to repay more than your debt.");
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
    await saveLoanData(
      account.address,
      remainingDebt,
      remainingDebt === 0 ? "paid" : "unpaid"
    );
    console.log("Transaction successful, updating loan data...");
  }

  clearInputs();
};
