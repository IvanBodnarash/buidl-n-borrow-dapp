import { gatewayApi } from "../radix/radixService";

// ************ Fetch and update displayed component state ************
export const fetchAndShowLendingAppState = async (
  componentAddress,
  loanResourceAddress,
  collateralResourceAddress
) => {
  if (!componentAddress || !loanResourceAddress || !collateralResourceAddress) {
    console.error("Missing required addresses:", {
      componentAddress,
      loanResourceAddress,
      collateralResourceAddress,
    });
    return;
  }

  try {
    console.log("Fetching component state for:");
    console.log("Component Address:", componentAddress);
    console.log("Loan Resource Address:", loanResourceAddress);
    console.log("Collateral Resource Address:", collateralResourceAddress);

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
      document.getElementById("loanTokenAmountDisplay").innerText =
        `${loanTokenAmount} LNT`;
    }

    if (collateralTokenResource) {
      const collateralTokenAmount =
        collateralTokenResource.vaults.items[0].amount;
      document.getElementById("collateralAmountDisplay").innerText =
        collateralTokenAmount;
    }

    const interestRate = componentDetails.details.state.fields.find(
      (field) => field.field_name === "interest_rate"
    );
    const collateralRatio = componentDetails.details.state.fields.find(
      (field) => field.field_name === "collateral_ratio"
    );

    return {
      collateralRatio: collateralRatio?.value,
      interestRate: interestRate?.value,
    };
  } catch (error) {
    console.error("Error fetching component state:", error);
  }
};
