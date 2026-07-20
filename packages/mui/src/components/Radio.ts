import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const radioContainerSva = sva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

const radioInputSva = sva({
  base: {
    width: "20px",
    height: "20px",
    accentColor: "var(--md-primary)",
  },
});

const radioLabelSva = sva({
  base: {
    color: "var(--md-on-surface)",
  },
});

export class RadioEl extends BaseElement {
  private input: HTMLInputElement;
  private labelEl: HTMLSpanElement;

  constructor(name: string, value: string, label: string = "") {
    super("label");
    this.element.className = "m3-radio " + radioContainerSva();

    this.input = document.createElement("input");
    this.input.type = "radio";
    this.input.name = name;
    this.input.value = value;
    this.input.className = radioInputSva();

    this.labelEl = document.createElement("span");
    this.labelEl.textContent = label;
    this.labelEl.className = radioLabelSva();

    this.element.appendChild(this.input);
    this.element.appendChild(this.labelEl);
  }

  SetChecked(checked: boolean): this {
    this.input.checked = checked;
    return this;
  }

  IsChecked(): boolean {
    return this.input.checked;
  }

  GetValue(): string {
    return this.input.value;
  }

  SetOnChange(callback: (checked: boolean, value: string) => void): this {
    this.input.addEventListener("change", () =>
      callback(this.input.checked, this.input.value),
    );
    return this;
  }

  override GetType(): string {
    return "Radio";
  }
}

function CreateRadio(
  name: string,
  value: string,
  label: string = "",
): RadioEl {
  return new RadioEl(name, value, label);
}

/**
 * AddRadio function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} name - The name parameter
 * @param {string} value - The value parameter
 * @param {string} label - The label parameter
 * @returns {RadioEl}
 *
 */
export function Radio(
  name: string,
  value: string,
  label: string = "", bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }
): RadioEl {
  const radio = CreateRadio(name, value, label);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(radio);
      else document.body.appendChild(radio.element);
  return radio;
}
