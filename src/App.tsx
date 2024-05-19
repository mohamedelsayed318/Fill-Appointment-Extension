import { useEffect, useState } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";

type Data = {
  index: number;
  tripDate: string;
  tripDestination: string;
  cirySelect: number;
  cityIndex: number;
  serviceSelect: number;
  serviceIndex: number;
  typeSelect: number;
  typeText: string;
  agreeIndex: number;
};
const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() + 2);

const initialData: Data = {
  index: 0,
  tripDate: `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`,
  tripDestination: "italy",
  cirySelect: 1,
  cityIndex: 1, // alex = 0, cairo = 1
  serviceSelect: 5,
  serviceIndex: 0, // standard = 0 , VIP = 1
  typeSelect: 3,
  typeText: "Employment Visa (C)",
  agreeIndex: 1,
};

function App() {
  const [data, setData] = useState<Data>(initialData);
  const notify = () => toast.success("Data has been saved!");

  useEffect(() => {
    chrome.storage.local.get(["city"], (result) => {
      if (result.city) {
        setData((prevData) => ({
          ...prevData,
          tripDestination: result.city,
        }));
      }
    });

    chrome.storage.local.get(["cityIndex"], (result) => {
      if (result.cityIndex === "Alexandria") {
        setData((prevData) => ({
          ...prevData,
          cityIndex: 0,
        }));
      } else if (result.cityIndex === "Cairo") {
        setData((prevData) => ({
          ...prevData,
          cityIndex: 1,
        }));
      }
    });

    chrome.storage.local.get(["serviceIndex"], (result) => {
      if (typeof result.serviceIndex === "string") {
        if (result.serviceIndex.includes("Standard")) {
          setData((prevData) => ({
            ...prevData,
            serviceIndex: 0,
          }));
        } else if (result.serviceIndex.includes("Vip")) {
          setData((prevData) => ({
            ...prevData,
            serviceIndex: 1,
          }));
        }
      } else if (typeof result.serviceIndex === "number") {
        setData((prevData) => ({
          ...prevData,
          serviceIndex: result.serviceIndex,
        }));
      }
    });

    chrome.storage.local.get(["typeText"], (result) => {
      setData((prevData) => ({
        ...prevData,
        typeText: result.typeText,
      }));
    });

    chrome.storage.local.get(["tripDate"], (result) => {
      setData((prevData) => ({
        ...prevData,
        tripDate: result.tripDate,
      }));
    });
  }, []);

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript<any, void>({
      target: { tabId: tab.id! },
      args: [data],
      func: async (data) => {
        await fillInput("tripDestination", data.tripDestination, data.index);
        await fillInput("tripDate", data.tripDate, data.index);
        await fillSelect(data.cirySelect, data.cityIndex);
        await fillSelectTwo(data.serviceSelect, data.serviceIndex, 500);
        await fillTypeSelect(data.typeSelect, data.typeText, 700);
        await clickInput(data.agreeIndex);

        async function fillInput(
          field: string,
          value: string,
          folderIndex: number
        ) {
          let ele = document.querySelectorAll(
            'input[formcontrolname="' + field + '"]'
          )[folderIndex] as HTMLInputElement;
          if (field === "tripDate") {
            value = formatDate(value);
          }

          ele.value = value;
          ele.dispatchEvent(new Event("input"));
          ele.dispatchEvent(new Event("blur"));
          ele.dispatchEvent(new Event("compositionend"));
          ele.dispatchEvent(new Event("compositionstart"));
        }

        async function fillSelect(id: number, optionIndex: number) {
          let selectBox = document.getElementById(
            `mat-select-value-${id}`
          ) as HTMLElement;
          selectBox.click();
          let elements = document.querySelectorAll("mat-option")[
            optionIndex
          ] as HTMLElement;
          elements.click();
        }

        async function fillSelectTwo(
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

        async function fillTypeSelect(
          id: number,
          text: string,
          timeout: number
        ) {
          let selectBox = document.getElementById(
            `mat-select-value-${id}`
          ) as HTMLElement;
          selectBox.click();
          setTimeout(async () => {
            let elements = document.querySelectorAll(
              "mat-option span"
            ) as NodeListOf<HTMLElement>;
            elements.forEach((element) => {
              if (element.innerText === text) {
                element.click();
              }
            });
          }, timeout);
        }

        function formatDate(dateStr: string) {
          let parts = dateStr.split("/");
          return parts[1] + "/" + parts[0] + "/" + parts[2];
        }

        async function clickInput(id: number) {
          let ele = document.querySelector(
            `#mat-mdc-checkbox-${id}-input`
          ) as HTMLInputElement;
          ele.click();
        }
      },
    });
  };

  const handleGrapData = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript<any, void>({
      target: { tabId: tab.id! },

      func: () => {
        const cityText = document.querySelector(
          'input[formcontrolname="tripDestination"]'
        ) as HTMLInputElement;
        const cityValue = cityText.value;
        let selectBox = document.getElementById(
          `mat-select-value-1`
        ) as HTMLElement;
        const selectValue = selectBox.innerText;
        let serviceSelectBox = document.getElementById(
          `mat-select-value-5`
        ) as HTMLElement;
        const serviceSelectValue = serviceSelectBox.innerText;
        let selectType = document.getElementById(
          "mat-select-value-3"
        ) as HTMLElement;
        const typeValue = selectType.innerText;
        let dateInput = document.querySelector(
          "#pickerInput"
        ) as HTMLInputElement;
        const dateValue = dateInput.value;
        chrome.storage.local.set({ city: cityValue }, () => {
          console.log("City stored in local storage: ", cityValue);
        });
        chrome.storage.local.set({ cityIndex: selectValue }, () => {
          console.log("City select stored in local storage: ", selectValue);
        });
        chrome.storage.local.set({ serviceIndex: serviceSelectValue }, () => {
          console.log(
            "Service select stored in local storage: ",
            serviceSelectValue
          );
        });
        chrome.storage.local.set({ typeText: typeValue }, () => {
          console.log("Type select stored in local storage: ", typeValue);
        });
        chrome.storage.local.set({ tripDate: dateValue }, () => {
          console.log("Date stored in local storage: ", dateValue);
        });
      },
    });
  };

  const handleClear = () => {
    setData(initialData);
    chrome.storage.local.set({ city: initialData.tripDestination });
    chrome.storage.local.set({ cityIndex: initialData.cityIndex });
    chrome.storage.local.set({ serviceIndex: initialData.serviceIndex });
    chrome.storage.local.set({ typeText: initialData.typeText });
    chrome.storage.local.set({ tripDate: initialData.tripDate });
    notify();
  };

  return (
    <>
      <Toaster />
      <h1 className="text-lg mb-3 font-extrabold bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.indigo.400),theme(colors.indigo.100),theme(colors.sky.400),theme(colors.fuchsia.400),theme(colors.sky.400),theme(colors.indigo.100),theme(colors.indigo.400))] bg-[length:200%_auto] animate-gradient">
        Fill Appointment Extension
      </h1>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-4">
          <button className="bg-slate-800" onClick={handleClick}>
            Fill inputs
          </button>
          <button
            className="bg-slate-800"
            onClick={() => {
              handleGrapData();
              notify();
            }}
          >
            Grap data
          </button>
        </div>
        <button className="bg-red-700" onClick={handleClear}>
          Clear storage
        </button>
      </div>
    </>
  );
}

export default App;
