import { instantiateManifest } from "../manifests/instantiate_lending_platform";
import { gatewayApi, rdt } from "../radix/radixService";

// ************ Instantiate Component ************
export const instantiateComponent = async (account, packageAddress) => {
  if (!packageAddress) {
    console.error("Package address is required for instantiation.");
    return { success: false, error: "Package address is missing" };
  }

  try {
    const manifest = instantiateManifest(packageAddress);
    console.log("Generated instantiate manifest:", manifest);

    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });

    if (result.isErr()) throw result.error;
    console.log("Instantiate component result:", result.value);

    const transactionStatus = await gatewayApi.transaction.getStatus(
      result.value.transactionIntentHash
    );
    console.log("Instantiate component transaction status:", transactionStatus);

    const committedDetails = await gatewayApi.transaction.getCommittedDetails(
      result.value.transactionIntentHash
    );

    const componentAddress =
      committedDetails.transaction.affected_global_entities[3];

    return { success: true, componentAddress };
  } catch (error) {
    console.error("Failed to instantiate component:", error);
    return { success: false, error };
  }
};
