import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const timePickerSva = sva({
  base: {
    backgroundColor: "var(--md-surface-container-high, var(--md-surface))",
    borderRadius: "28px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    color: "var(--md-on-surface)",
    width: "328px",
    boxSizing: "border-box",
    alignItems: "center",
  },
});

const inputContainerSva = sva({
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "12px",
  },
});

const fieldSva = sva({
  base: {
    width: "96px",
    height: "80px",
    backgroundColor: "var(--md-surface-container-highest, var(--md-surface-variant))",
    borderRadius: "8px",
    border: "none",
    fontSize: "44px",
    textAlign: "center",
    color: "var(--md-on-surface)",
    fontFamily: "inherit",
    outline: "none",
  },
});

const colonSva = sva({
  base: {
    fontSize: "44px",
    color: "var(--md-on-surface)",
  },
});

const toggleContainerSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid var(--md-outline)",
    borderRadius: "8px",
    overflow: "hidden",
  },
});

const toggleBtnSva = sva({
  base: {
    padding: "8px 12px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    background: "transparent",
    color: "var(--md-on-surface-variant)",
    outline: "none",
  },
  variants: {
    active: {
      true: {
        backgroundColor: "var(--md-tertiary-container)",
        color: "var(--md-on-tertiary-container)",
      },
    },
  },
});

export class TimePicker extends BaseElement {
  private hourField: HTMLInputElement;
  private minuteField: HTMLInputElement;
  private amPm: "AM" | "PM" = "AM";
  private onChangeCallback: ((time: string) => void) | null = null;

  constructor() {
    super("div");
    this.element.className = timePickerSva();

    const title = document.createElement("div");
    title.textContent = "Enter time";
    title.style.fontSize = "12px";
    title.style.fontWeight = "500";
    title.style.alignSelf = "flex-start";
    title.style.color = "var(--md-on-surface-variant)";
    this.element.appendChild(title);

    const inputRow = document.createElement("div");
    inputRow.className = inputContainerSva();

    this.hourField = document.createElement("input");
    this.hourField.className = fieldSva();
    this.hourField.type = "text";
    this.hourField.value = "09";
    this.hourField.maxLength = 2;

    const colon = document.createElement("div");
    colon.className = colonSva();
    colon.textContent = ":";

    this.minuteField = document.createElement("input");
    this.minuteField.className = fieldSva();
    this.minuteField.type = "text";
    this.minuteField.value = "30";
    this.minuteField.maxLength = 2;

    inputRow.appendChild(this.hourField);
    inputRow.appendChild(colon);
    inputRow.appendChild(this.minuteField);

    const toggle = document.createElement("div");
    toggle.className = toggleContainerSva();

    const amBtn = document.createElement("button");
    amBtn.className = toggleBtnSva({ active: true });
    amBtn.textContent = "AM";

    const pmBtn = document.createElement("button");
    pmBtn.className = toggleBtnSva({ active: false });
    pmBtn.textContent = "PM";

    amBtn.addEventListener("click", () => {
      this.amPm = "AM";
      amBtn.className = toggleBtnSva({ active: true });
      pmBtn.className = toggleBtnSva({ active: false });
      this.notifyChange();
    });

    pmBtn.addEventListener("click", () => {
      this.amPm = "PM";
      amBtn.className = toggleBtnSva({ active: false });
      pmBtn.className = toggleBtnSva({ active: true });
      this.notifyChange();
    });

    toggle.appendChild(amBtn);
    toggle.appendChild(pmBtn);
    inputRow.appendChild(toggle);
    this.element.appendChild(inputRow);

    this.hourField.addEventListener("input", () => this.validateHour());
    this.minuteField.addEventListener("input", () => this.validateMinute());
  }

  private validateHour() {
    let val = this.hourField.value.replace(/\D/g, "");
    if (val) {
      let num = parseInt(val);
      if (num > 12) num = 12;
      if (num < 1) num = 1;
      this.hourField.value = String(num).padStart(2, "0");
    }
    this.notifyChange();
  }

  private validateMinute() {
    let val = this.minuteField.value.replace(/\D/g, "");
    if (val) {
      let num = parseInt(val);
      if (num > 59) num = 59;
      this.minuteField.value = String(num).padStart(2, "0");
    }
    this.notifyChange();
  }

  private notifyChange() {
    if (this.onChangeCallback) {
      this.onChangeCallback(`${this.hourField.value}:${this.minuteField.value} ${this.amPm}`);
    }
  }

  SetOnChange(callback: (time: string) => void): this {
    this.onChangeCallback = callback;
    return this;
  }

  GetTime(): string {
    return `${this.hourField.value}:${this.minuteField.value} ${this.amPm}`;
  }

  override GetType(): string {
    return "TimePicker";
  }
}

function CreateTimePicker(): TimePicker {
  return new TimePicker();
}

/**
 * AddTimePicker function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {TimePicker}
 *
 */
export function AddTimePicker(parent: LayoutElement): TimePicker {
  const picker = CreateTimePicker();
  parent.AddChild(picker);
  return picker;
}
