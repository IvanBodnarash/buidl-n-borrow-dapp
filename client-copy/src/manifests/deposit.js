export const buyGumballManifest = (
  xrdAmount,
  xrdAddress,
  accountAddress,
  componentAddress
) => `
  CALL_METHOD
      Address("${accountAddress}")
      "withdraw"
      Address("${xrdAddress}")
      Decimal("${xrdAmount}")
  ;
  TAKE_FROM_WORKTOP
      Address("${xrdAddress}")
      Decimal("${xrdAmount}")
      Bucket("bucket_of_xrd")
  ;
  CALL_METHOD
      Address("${componentAddress}")
      "buy_gumball"
      Bucket("bucket_of_xrd")
  ;
  CALL_METHOD
      Address("${accountAddress}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP")
  ;`;

export const depositManifest = (
  xrdAmount,
  xrdAddress,
  accountAddress,
  componentAddress
) => `
    CALL_METHOD
        Address("component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh")
        "lock_fee"
        Decimal("5000")
    ;
    CALL_METHOD
        Address("account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma")
        "withdraw"
        Address("resource_sim1thcrjys3fae93ske3zdt4gp4528qx97y469pdnzdq98rp0y9q5cwpk")
        Decimal("15")
    ;
    TAKE_FROM_WORKTOP
        Address("resource_sim1thcrjys3fae93ske3zdt4gp4528qx97y469pdnzdq98rp0y9q5cwpk")
        Decimal("15")
        Bucket("bucket1")
    ;
    CALL_METHOD
        Address("component_sim1cqvff6g8fqtcd3h6t3lmwrnzt4anfcld9tdh0fmxs948j9tjkfe2mx")
        "deposit"
        Bucket("bucket1")
    ;
    CALL_METHOD
        Address("account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma")
        "try_deposit_batch_or_refund"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;
`;