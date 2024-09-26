// export const buyGumballManifest = (
//   xrdAmount,
//   xrdAddress,
//   accountAddress,
//   componentAddress
// ) => `
//   CALL_METHOD
//       Address("${accountAddress}")
//       "withdraw"
//       Address("${xrdAddress}")
//       Decimal("${xrdAmount}")
//   ;
//   TAKE_FROM_WORKTOP
//       Address("${xrdAddress}")
//       Decimal("${xrdAmount}")
//       Bucket("bucket_of_xrd")
//   ;
//   CALL_METHOD
//       Address("${componentAddress}")
//       "buy_gumball"
//       Bucket("bucket_of_xrd")
//   ;
//   CALL_METHOD
//       Address("${accountAddress}")
//       "deposit_batch"
//       Expression("ENTIRE_WORKTOP")
//   ;`;

export const borrowManifest = (
//   xrdAmount,
//   xrdAddress,
  accountAddress,
  componentAddress,
  loanResourceAddress,
//   borrowAmount
) => `
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${loanResourceAddress}")
        Decimal("50")
    ;
    TAKE_FROM_WORKTOP
        Address("${loanResourceAddress}")
        Decimal("50")
        Bucket("bucket1")
    ;
    CALL_METHOD
        Address("${componentAddress}")
        "borrow"
        Decimal("20")
        Bucket("bucket1")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "try_deposit_batch_or_refund"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;
`;
