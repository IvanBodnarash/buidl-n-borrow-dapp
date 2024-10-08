import {
  RadixDappToolkit,
  DataRequestBuilder,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";

// ************ Connect to the Radix network ************
const dAppDefinitionAddress =
  "account_tdx_2_12x902e9ey0mxfezmh4vl46s8a7xmrk0az3v3ly0hc00ul94uerhjnv";
export const rdt = RadixDappToolkit({
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Buidl & Borrow dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
});

// Instantiate Gateway API client to query the Radix network
export const gatewayApi = GatewayApiClient.initialize(
  rdt.gatewayApi.clientConfig
);

rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));

export const checkIfAdmin = (address) => {
  if (address === dAppDefinitionAddress) {
    document.getElementById("instantiateComponentDiv").style.display = "block";
  } else {
    document.getElementById("instantiateComponentDiv").style.display = "none";
  }
};
