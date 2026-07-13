import { OverlayElement } from "../../../core/src/elements/Overlay.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { Signal, CreateSignal, Bind } from "../../../core/src/state/signals.ts";

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

const titleSva = sva({
  base: {
    fontSize: "12px",
    fontWeight: "500",
    alignSelf: "flex-start",
    color: "var(--md-on-surface-variant)",
  },
});

const dialContainerSva = sva({
  base: {
    width: "256px",
    height: "256px",
    borderRadius: "50%",
    backgroundColor: "var(--md-surface-variant)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});

const dialPlaceholderTextSva = sva({
  base: {
    color: "var(--md-on-surface-variant)",
    fontSize: "14px",
    textAlign: "center",
  }
});

export class TimePicker extends OverlayElement {
  private hourField: HTMLInputElement;
  private minuteField: HTMLInputElement;
  private amPmSignal: Signal<"AM" | "PM">;
  public timeSignal: Signal<string>;

  constructor() {
    super("div", { scrim: true, dismissOnScrimClick: true, dismissOnEscape: true });
    this.SetScrimColor("rgba(0, 0, 0, 0.32)");
    this.element.className = "m3-timepicker " + timePickerSva();

    const title = document.createElement("div");
    title.textContent = "Enter time";
    title.className = titleSva();
    this.element.appendChild(title);

    const inputRow = document.createElement("div");
    inputRow.className = inputContainerSva();
    
    const dialContainer = document.createElement("div");
    dialContainer.className = dialContainerSva();
    dialContainer.innerHTML = `<span class="${dialPlaceholderTextSva()}">Dial UI (Placeholder)</span>`;
    dialContainer.style.display = "none";
    
    // mode toggle icon
    const modeBtn = document.createElement("button");
    modeBtn.style.cssText = "background: none; border: none; cursor: pointer; align-self: flex-start; padding: 12px; margin-left: -12px; margin-top: auto;";
    modeBtn.innerHTML = `<span class="material-icons" style="color: var(--md-on-surface-variant)">schedule</span>`;
    let isDialMode = false;
    modeBtn.addEventListener("click", () => {
      isDialMode = !isDialMode;
      if (isDialMode) {
        inputRow.style.display = "none";
        dialContainer.style.display = "flex";
        title.textContent = "Select time";
        modeBtn.innerHTML = `<span class="material-icons" style="color: var(--md-on-surface-variant)">keyboard</span>`;
      } else {
        inputRow.style.display = "flex";
        dialContainer.style.display = "none";
        title.textContent = "Enter time";
        modeBtn.innerHTML = `<span class="material-icons" style="color: var(--md-on-surface-variant)">schedule</span>`;
      }
    });

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

    this.amPmSignal = CreateSignal<"AM" | "PM">("AM");
    this.timeSignal = CreateSignal("09:30 AM");

    Bind(this.amPmSignal, (amPm) => {
      amBtn.className = toggleBtnSva({ active: amPm === "AM" });
      pmBtn.className = toggleBtnSva({ active: amPm === "PM" });
      this.notifyChange();
    });

    amBtn.addEventListener("click", () => this.amPmSignal.Set("AM"));
    pmBtn.addEventListener("click", () => this.amPmSignal.Set("PM"));

    toggle.appendChild(amBtn);
    toggle.appendChild(pmBtn);
    inputRow.appendChild(toggle);
    this.element.appendChild(inputRow);
    this.element.appendChild(dialContainer);
    this.element.appendChild(modeBtn);

    this.hourField.addEventListener("input", () => this.validateHour());
    this.minuteField.addEventListener("input", () => this.validateMinute());

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.Close();
      }
    };
    this.hourField.addEventListener("keydown", handleEnter);
    this.minuteField.addEventListener("keydown", handleEnter);
  }

  private validateHour() {
    let val = this.hourField.value.replace(/\D/g, "");
    if (val !== "") {
      let num = parseInt(val);
      if (num > 12) val = "12";
      if (num === 0) val = "1";
    }
    this.hourField.value = val;
    this.notifyChange();
  }

  private validateMinute() {
    let val = this.minuteField.value.replace(/\D/g, "");
    if (val !== "") {
      let num = parseInt(val);
      if (num > 59) val = "59";
    }
    this.minuteField.value = val;
    this.notifyChange();
  }

  private notifyChange() {
    const val = `${this.hourField.value}:${this.minuteField.value} ${this.amPmSignal.Get()}`;
    this.timeSignal.Set(val);
  }

  SetOnChange(callback: (time: string) => void): this {
    this.timeSignal.Subscribe(callback);
    return this;
  }

  GetTime(): string {
    return this.timeSignal.Get();
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
