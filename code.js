const data = {
  index: 0,
  tripDate: "28/08/2025",
  tripDestination: "italy",
  cirySelect: 1,
  cityIndex: 1, // alex = 0, cairo = 1
  serviceSelect: 5,
  serviceIndex: 1, // standard = 0 , VIP = 1
  typeSelect: 3,
  typeIndex: 6,
  agreeIndex: 1,
};

await fillInput("tripDestination", data.tripDestination, data.index);
await fillInput("tripDate", data.tripDate, data.index);
await fillSelect(data.cirySelect, data.cityIndex);
await fillSelectTwo(data.serviceSelect, data.serviceIndex, 500);
await fillSelectTwo(data.typeSelect, data.typeIndex, 700);
await clickInput(data.agreeIndex);
async function fillInput(field, value, folderIndex) {
  let ele = document.querySelectorAll('input[formcontrolname="' + field + '"]')[
    folderIndex
  ];
  if (
    field === "tripDate" ||
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

async function fillSelect(id, optionIndex) {
  let selectBox = document.getElementById(`mat-select-value-${id}`);
  selectBox.click();
  let elements = document.querySelectorAll("mat-option")[optionIndex];
  elements.click();
}
async function fillSelectTwo(id, optionIndex, timeout) {
  let selectBox = document.getElementById(`mat-select-value-${id}`);
  selectBox.click();
  setTimeout(async () => {
    let elements = document.querySelectorAll("mat-option")[optionIndex];
    elements.click();
  }, timeout);
}

function formatDate(dateStr) {
  let parts = dateStr.split("/");
  return parts[1] + "/" + parts[0] + "/" + parts[2];
}

async function clickInput(id) {
  let ele = document.querySelector(`#mat-mdc-checkbox-${id}-input`);
  ele.click();
}
