import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const containerSva = sva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "8px",
    padding: "8px",
    userSelect: "none",
  },
  variants: {
    disabled: {
      true: {
        opacity: "0.38",
        cursor: "not-allowed",
        pointerEvents: "none",
      },
      false: {
        opacity: "1",
        cursor: "pointer",
        pointerEvents: "auto",
      },
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

const inputSva = sva({
  base: {
    position: "absolute",
    opacity: "0",
    width: "0",
    height: "0",
  },
});

const boxSva = sva({
  base: {
    width: "18px",
    height: "18px",
    borderRadius: "2px",
    border: "2px solid var(--md-outline)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.1s ease, border-color 0.1s ease",
    boxSizing: "border-box",
  },
  variants: {
    checked: {
      true: {
        backgroundColor: "var(--md-primary)",
        borderColor: "var(--md-primary)",
      },
      false: {
        backgroundColor: "transparent",
        borderColor: "var(--md-outline)",
      },
    },
    focused: {
      true: {
        outline: "2px solid var(--md-primary)",
        outlineOffset: "2px",
      },
      false: {
        outline: "none",
      },
    },
  },
  defaultVariants: {
    checked: false,
    focused: false,
  },
});

const checkmarkSva = sva({
  base: {
    color: "var(--md-on-primary)",
    fontSize: "13px",
    lineHeight: "1",
    transition: "opacity 0.1s ease",
  },
  variants: {
    visible: {
      true: { opacity: "1" },
      false: { opacity: "0" },
    },
  },
  defaultVariants: {
    visible: false,
  },
});

const labelSva = sva({
  base: {
    color: "var(--md-on-surface)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    fontSize: "14px",
  },
});

export class CheckboxEl extends BaseElement {
  private input: HTMLInputElement;
  private box: HTMLDivElement;
  private checkmark: HTMLSpanElement;
  private labelSpan: HTMLSpanElement;
  private _focused = false;

  constructor(label = "") {
    super("label");
    this.element.className = "m3-checkbox " + containerSva();

    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.className = inputSva();

    this.box = document.createElement("div");

    this.checkmark = document.createElement("span");
    this.checkmark.textContent = "✓";
    this.box.appendChild(this.checkmark);

    this.labelSpan = document.createElement("span");
    this.labelSpan.className = labelSva();
    this.labelSpan.textContent = label;

    this.element.appendChild(this.input);
    this.element.appendChild(this.box);
    if (label) this.element.appendChild(this.labelSpan);

    this.input.addEventListener("focus", () => {
      this._focused = true;
      this.updateState();
    });
    this.input.addEventListener("blur", () => {
      this._focused = false;
      this.updateState();
    });

    this.input.addEventListener("change", () => this.updateState());
    this.updateState();
  }

  private updateState() {
    const isIndeterminate = this.input.indeterminate;
    const isChecked = this.input.checked;
    const activeChecked = isIndeterminate || isChecked;

    this.box.className = boxSva({ checked: activeChecked, focused: this._focused });
    this.checkmark.className = checkmarkSva({ visible: activeChecked });
    this.checkmark.textContent = isIndeterminate ? "—" : "✓";
  }

  SetChecked(checked: boolean): this {
    this.input.checked = checked;
    this.input.indeterminate = false;
    this.updateState();
    return this;
  }

  SetIndeterminate(indeterminate: boolean): this {
    this.input.indeterminate = indeterminate;
    this.updateState();
    return this;
  }

  IsChecked(): boolean {
    return this.input.checked;
  }

  override SetEnabled(enabled: boolean): this {
    this.input.disabled = !enabled;
    this.element.className = "m3-checkbox " + containerSva({ disabled: !enabled });
    return this;
  }

  SetOnChange(callback: (checked: boolean) => void): this {
    this.input.addEventListener("change", () => callback(this.input.checked));
    return this;
  }

  override GetType(): string {
    return "Checkbox";
  }
}

function CreateCheckbox(label = ""): CheckboxEl {
  return new CheckboxEl(label);
}

/**
 * AddCheckbox function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {any} label - The label parameter
 * @returns {CheckboxEl}
 *
 */
export function Checkbox(label = "", bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }): CheckboxEl {
  const box = CreateCheckbox(label);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(box);
      else document.body.appendChild(box.element);
  return box;
}
