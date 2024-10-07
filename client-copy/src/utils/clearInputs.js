export const clearInputs = () => {
  const borrowAmountField = document.getElementById("borrowAmount");
  const collateralAmountField = document.getElementById("collateralAmount");
  const getCollateralAmountField = document.getElementById(
    "getCollateralAmountField"
  );
  const repayAmountField = document.getElementById("repayAmount");

  if (borrowAmountField) borrowAmountField.value = "";
  if (collateralAmountField) collateralAmountField.value = "";
  if (getCollateralAmountField) getCollateralAmountField.value = "";
  if (repayAmountField) repayAmountField.value = "";
};
