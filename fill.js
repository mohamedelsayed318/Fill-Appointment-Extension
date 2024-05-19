const check = true;

const data = {
  index: 0,
  birthDate: "28/08/2001",
  gender: "F", // Capital Only M راجل  F انثى
  residenceAddress: "sharqia",
  number: "A34107603",
  issueDate: "03/06/2023", // تاريخ بداية الباسبور
  expirationDate: "02/06/2030", //تاريخ انتهاء الباسور
  firstName: "yssehia",
  surName: "elsessify",
};

await fillInput("birthDate", data.birthDate, data.index);
await fillInput("residenceAddress", data.residenceAddress, data.index);
await fillInput("number", data.number, data.index);
await fillInput("issueDate", data.issueDate, data.index);
await fillInput("expirationDate", data.expirationDate, data.index);
await fillSelect("gender", data.gender);
const name = getName("name");
const surName = getName("surname");
if (check) {
  name !== data.firstName || surName !== data.surName
    ? alert("Carefull! Check the data")
    : null;
}

async function fillInput(field, value, folderIndex) {
  let ele = document.querySelectorAll(
    'app-user-data form input[formcontrolname="' + field + '"]'
  )[folderIndex];
  if (
    field === "birthDate" ||
    field === "issueDate" ||
    field === "expirationDate"
  ) {
    value = formatDate(value);
  }
  ele.value = value;
  ele.dispatchEvent(new Event("input"));
  ele.dispatchEvent(new Event("blur"));
  ele.dispatchEvent(new Event("compositionend"));
  ele.dispatchEvent(new Event("compositionstart"));
}

async function fillSelect(field, value) {
  let selectBox = document.querySelectorAll(
    "app-user-data form .mat-mdc-select-trigger"
  )[0];

  selectBox.click();
  let eleIndex;
  if (value === "M") {
    eleIndex = 0;
  } else if (value === "F") {
    eleIndex = 1;
  }
  let elements = document.querySelectorAll("mat-option")[eleIndex];
  elements.click();
}
function formatDate(dateStr) {
  let parts = dateStr.split("/");
  return parts[1] + "/" + parts[0] + "/" + parts[2];
}

function getName(formcontrolname) {
  return document.querySelector(
    'input[formcontrolname="' + formcontrolname + '"]'
  ).value;
}
