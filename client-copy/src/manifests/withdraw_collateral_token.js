export const withdrawCollateralTokenManifest = (
  accountAddress,
  collateralResourceAddress,
  componentAddress,
  getCollateralAmount
) => `
    CALL_METHOD
        Address("${componentAddress}")
        "withdraw_collateral_token"
        Decimal("${getCollateralAmount}")
        Address("${collateralResourceAddress}")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP")
    ;
`;
