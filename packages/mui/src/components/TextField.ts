import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme, TextFieldVariant } from "../theme.ts";

const FIELD_HEIGHT = 56;

export class TextField extends BaseElement {
  private input: HTMLInputElement;
  private labelEl: HTMLSpanElement;
  private variant: TextFieldVariant;
  private supportingText?: HTMLSpanElement;

  constructor(label: string, variant: TextFieldVariant = "filled") {
    super("div");
    this.variant = variant;
    this.element.className = "m3-textfield";
    this.element.style.display = "inline-flex";
    this.element.style.flexDirection = "column";
    this.element.style.position = "relative";
    this.element.style.width = "280px"; // M3's default minimum text field width

    const fieldWrap = document.createElement("div");
    fieldWrap.style.position = "relative";
    fieldWrap.style.height = `${FIELD_HEIGHT}px`;
    fieldWrap.style.display = "flex";
    fieldWrap.style.alignItems = "center";
    fieldWrap.style.boxSizing = "border-box";

    if (variant === "filled") {
      fieldWrap.style.backgroundColor = currentTheme.surfaceVariant;
      fieldWrap.style.borderRadius = `${currentTheme.shapeCornerExtraSmall}px ${currentTheme.shapeCornerExtraSmall}px 0 0`;
      fieldWrap.style.borderBottom = `1px solid ${currentTheme.onSurfaceVariant}`;
      fieldWrap.style.padding = "0 16px";
    } else {
      fieldWrap.style.backgroundColor = "transparent";
      fieldWrap.style.border = `1px solid ${currentTheme.outline}`;
      fieldWrap.style.borderRadius = `${currentTheme.shapeCornerExtraSmall}px`;
      fieldWrap.style.padding = "0 16px";
    }
    fieldWrap.style.transition =
      "border-color 0.1s ease, border-width 0.1s ease";

    this.labelEl = document.createElement("span");
    this.labelEl.textContent = label;
    this.labelEl.style.position = "absolute";
    this.labelEl.style.left = "16px";
    this.labelEl.style.top = "50%";
    this.labelEl.style.transform = "translateY(-50%)";
    this.labelEl.style.color = currentTheme.onSurfaceVariant;
    this.labelEl.style.fontFamily = currentTheme.fontFamily;
    this.labelEl.style.fontSize = "16px";
    this.labelEl.style.transition = "all 0.15s ease";
    this.labelEl.style.pointerEvents = "none";
    this.labelEl.style.background =
      variant === "outlined" ? currentTheme.surface : "transparent";
    this.labelEl.style.padding = variant === "outlined" ? "0 4px" : "0";

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.style.border = "none";
    this.input.style.outline = "none";
    this.input.style.background = "transparent";
    this.input.style.width = "100%";
    this.input.style.height = "100%";
    this.input.style.fontFamily = currentTheme.fontFamily;
    this.input.style.fontSize = "16px";
    this.input.style.color = currentTheme.onSurface;
    this.input.style.paddingTop = "8px"; // room for the floated label above the text baseline

    fieldWrap.appendChild(this.labelEl);
    fieldWrap.appendChild(this.input);
    this.element.appendChild(fieldWrap);

    const floatLabel = () => {
      this.labelEl.style.top = "0";
      this.labelEl.style.fontSize = "12px";
      this.labelEl.style.color = currentTheme.primary;
    };
    const restLabel = () => {
      if (this.input.value) return;
      this.labelEl.style.top = "50%";
      this.labelEl.style.fontSize = "16px";
      this.labelEl.style.color = currentTheme.onSurfaceVariant;
    };

    this.input.addEventListener("focus", () => {
      floatLabel();
      if (this.variant === "filled") {
        fieldWrap.style.borderBottom = `2px solid ${currentTheme.primary}`;
      } else {
        fieldWrap.style.border = `2px solid ${currentTheme.primary}`;
      }
    });
    this.input.addEventListener("blur", () => {
      restLabel();
      if (this.variant === "filled") {
        fieldWrap.style.borderBottom = `1px solid ${currentTheme.onSurfaceVariant}`;
      } else {
        fieldWrap.style.border = `1px solid ${currentTheme.outline}`;
      }
    });
    this.input.addEventListener("input", () => {
      if (this.input.value) floatLabel();
    });
  }

  SetValue(value: string): this {
    this.input.value = value;
    if (value) {
      this.labelEl.style.top = "0";
      this.labelEl.style.fontSize = "12px";
    }
    return this;
  }

  GetValue(): string {
    return this.input.value;
  }

  SetPlaceholder(text: string): this {
    this.input.placeholder = text;
    return this;
  }

  /** Sets helper/error text shown below the field. */
  SetSupportingText(text: string, isError = false): this {
    if (!this.supportingText) {
      this.supportingText = document.createElement("span");
      this.supportingText.style.fontSize = "12px";
      this.supportingText.style.fontFamily = currentTheme.fontFamily;
      this.supportingText.style.marginTop = "4px";
      this.supportingText.style.marginLeft = "16px";
      this.element.appendChild(this.supportingText);
    }
    this.supportingText.textContent = text;
    this.supportingText.style.color = isError
      ? currentTheme.error
      : currentTheme.onSurfaceVariant;
    return this;
  }

  override SetEnabled(enabled: boolean): this {
    this.input.disabled = !enabled;
    this.element.style.opacity = enabled ? "1" : "0.38";
    return this;
  }

  SetOnChange(callback: (value: string) => void): this {
    this.input.addEventListener("input", () => callback(this.input.value));
    return this;
  }

  override GetType(): string {
    return "TextField";
  }
}

export function CreateTextField(
  label: string,
  variant: TextFieldVariant = "filled",
): TextField {
  return new TextField(label, variant);
}

export function AddTextField(
  parent: LayoutElement,
  label: string,
  variant: TextFieldVariant = "filled",
): TextField {
  const field = CreateTextField(label, variant);
  parent.AddChild(field);
  return field;
}
