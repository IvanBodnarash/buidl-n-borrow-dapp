export const displayAndAutofillCollateral = (collateralRatio) => {
  document
    .getElementById("borrowAmount")
    .addEventListener("input", function () {
      const borrowAmount = parseFloat(
        document.getElementById("borrowAmount").value
      );

      if (!isNaN(borrowAmount) && borrowAmount > 0) {
        const minCollateral = borrowAmount * collateralRatio;
        document.getElementById(
          "minCollateralDisplay"
        ).innerText = `${minCollateral.toFixed(2)} CLT`;

        const collateralField = document.getElementById("collateralAmount");
        if (!collateralField.dataset.userChanged) {
          collateralField.value = minCollateral.toFixed(1);
        }
      } else {
        document.getElementById("minCollateralDisplay").innerText = "";
      }
    });

  document
    .getElementById("collateralAmount")
    .addEventListener("input", function () {
      this.dataset.userChanged = true;
    });
};
