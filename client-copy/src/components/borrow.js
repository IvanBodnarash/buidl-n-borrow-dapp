import { borrowManifest } from "../manifests/borrow";
import { fetchLoanData, saveLoanData } from "../firebase/firebaseService";
import { gatewayApi, rdt } from "../radix/radixService";
import { clearInputs } from "../utils/clearInputs";
import { showAlert, closeAlert } from "../utils/customAlert";

// ************ Borrow LNT Token with Validation ************
export const borrowTokens = async (
  account,
  collateralResourceAddress,
  componentAddress,
  maxLoanTokensAvailable
) => {
  const borrowAmount = parseFloat(
    document.getElementById("borrowAmount").value
  );
  const collateralAmount = parseFloat(
    document.getElementById("collateralAmount").value
  );

  console.log("Borrow Amount: ", borrowAmount);
  console.log("Collateral Amount: ", collateralAmount);

  if (
    isNaN(borrowAmount) ||
    isNaN(collateralAmount) ||
    borrowAmount <= 0 ||
    collateralAmount <= 0
  ) {
    showAlert("Please enter valid numbers");
    return;
  }

  if (borrowAmount > maxLoanTokensAvailable) {
    showAlert(`You can only borrow up to ${maxLoanTokensAvailable} LNT.`);
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
  // Send manifest to wallet for signing
  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;

  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  console.log("Borrow Token transaction status:", transactionStatus);

  if (transactionStatus.status === "CommittedSuccess") {
    console.log("Transaction successful, saving loan data...");

    const currentLoanData = await fetchLoanData(account.address);
    const totalLoanAmount = (currentLoanData?.loanAmount ?? 0) + borrowAmount;
    await saveLoanData(account.address, totalLoanAmount);
  }

  clearInputs();
};
