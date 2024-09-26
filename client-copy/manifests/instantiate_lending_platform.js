export const instantiateManifest = (
    packageAddress
  ) => `
    CALL_FUNCTION
        Address("${packageAddress}")
        "LendingPlatform"
        "instantiate_lending_platform"
        Decimal("0.05")
        Decimal("1.5")
    ;`
;
