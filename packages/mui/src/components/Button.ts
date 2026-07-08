import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { ButtonVariant, currentTheme } from "../theme.ts";

export class Button extends BaseElement {
  private _variant: ButtonVariant;

  constructor(
    text: string,
    variant: ButtonVariant = "filled",
    _options?: string,
  ) {
    super("button");
    this._variant = variant;
    this.element.className = `m3-button m3-button-${variant}`;
    this.element.textContent = text;
    this.element.style.fontFamily = currentTheme.fontFamily;
    this.element.style.fontSize = "0.875rem";
    this.element.style.fontWeight = "500";
    this.element.style.borderRadius = `${currentTheme.shapeCornerFull}px`;
    this.element.style.padding = "10px 24px";
    this.element.style.cursor = "pointer";
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    this.element.style.gap = "8px";
    this.element.style.border = "none";
    this.applyVariant(variant);
  }

  private applyVariant(variant: ButtonVariant): void {
    switch (variant) {
      case "elevated":
        this.element.style.backgroundColor =
          currentTheme.surfaceContainer || currentTheme.surface;
        this.element.style.color = currentTheme.primary;
        this.element.style.boxShadow = `0 ${currentTheme.elevationLevel1}px ${currentTheme.elevationLevel2}px rgba(0,0,0,0.15)`;
        break;
      case "filled":
        this.element.style.backgroundColor = currentTheme.primary;
        this.element.style.color = currentTheme.onPrimary;
        break;
      case "filled-tonal":
        this.element.style.backgroundColor = currentTheme.secondaryContainer;
        this.element.style.color = currentTheme.onSecondaryContainer;
        break;
      case "outlined":
        this.element.style.backgroundColor = "transparent";
        this.element.style.color = currentTheme.primary;
        this.element.style.border = `1px solid ${currentTheme.outline}`;
        break;
      case "text":
        this.element.style.backgroundColor = "transparent";
        this.element.style.color = currentTheme.primary;
        break;
    }
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "Button";
  }
}

export function CreateButton(
  text: string,
  variant: ButtonVariant = "filled",
  options?: string,
): Button {
  return new Button(text, variant, options);
}

export function AddButton(
  parent: LayoutElement,
  text: string,
  variant: ButtonVariant = "filled",
  options?: string,
): Button {
  const btn = CreateButton(text, variant, options);
  parent.AddChild(btn);
  return btn;
}
