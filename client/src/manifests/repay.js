export const repayManifest = (
    accountAddress,
    componentAddress,
    loanResourceAddress,
    repayAmount
  ) => `
    CALL_METHOD
        Address("${accountAddress}")
        "withdraw"
        Address("${loanResourceAddress}")
        Decimal("${repayAmount}")
    ;
    TAKE_FROM_WORKTOP
        Address("${loanResourceAddress}")
        Decimal("${repayAmount}")
        Bucket("bucket1")
    ;
    CALL_METHOD
        Address("${componentAddress}")
        "repay"
        Bucket("bucket1")
        Decimal("${repayAmount}")
    ;
    CALL_METHOD
        Address("${accountAddress}")
        "try_deposit_batch_or_refund"
        Expression("ENTIRE_WORKTOP")
        Enum<0u8>()
    ;
  `;
  