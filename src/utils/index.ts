// const data = {
//   index: 0,
//   tripDate: "28/08/2025",
//   tripDestination: "italy",
//   cirySelect: 1,
//   cityIndex: 1, // alex = 0, cairo = 1
//   serviceSelect: 5,
//   serviceIndex: 1, // standard = 0 , VIP = 1
//   typeSelect: 3,
//   typeIndex: 6,
//   agreeIndex: 1,
// };

// await fillInput("tripDestination", data.tripDestination, data.index);
// await fillInput("tripDate", data.tripDate, data.index);
// await fillSelect(data.cirySelect, data.cityIndex);
// await fillSelectTwo(data.serviceSelect, data.serviceIndex, 500);
// await fillSelectTwo(data.typeSelect, data.typeIndex, 700);
// await clickInput(data.agreeIndex);
export async function fillInput(
  field: string,
  value: string,
  folderIndex: number
) {
  let ele = document.querySelectorAll('input[formcontrolname="' + field + '"]')[
    folderIndex
  ] as HTMLInputElement;
  if (field === "tripDate") {
    value = formatDate(value);
  }

  ele.value = value;
  ele.dispatchEvent(new Event("input"));
  ele.dispatchEvent(new Event("blur"));
  ele.dispatchEvent(new Event("compositionend"));
  ele.dispatchEvent(new Event("compositionstart"));
}

export async function fillSelect(id: number, optionIndex: number) {
  let selectBox = document.getElementById(
    `mat-select-value-${id}`
  ) as HTMLElement;
  selectBox.click();
  let elements = document.querySelectorAll("mat-option")[
    optionIndex
  ] as HTMLElement;
  elements.click();
}
export async function fillSelectTwo(
  id: number,
  optionIndex: number,
  timeout: number
) {
  let selectBox = document.getElementById(
    `mat-select-value-${id}`
  ) as HTMLElement;
  selectBox.click();
  setTimeout(async () => {
    let elements = document.querySelectorAll("mat-option")[
      optionIndex
    ] as HTMLElement;
    elements.click();
  }, timeout);
}

export function formatDate(dateStr: string) {
  let parts = dateStr.split("/");
  return parts[1] + "/" + parts[0] + "/" + parts[2];
}

export async function clickInput(id: number) {
  let ele = document.querySelector(
    `#mat-mdc-checkbox-${id}-input`
  ) as HTMLInputElement;
  ele.click();
}
