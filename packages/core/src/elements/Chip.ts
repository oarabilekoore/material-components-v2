import { InteractiveElement } from "../../../core/src/elements/interactive_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme, ChipVariant } from "../theme.ts";

const CHIP_HEIGHT = 32;

export class Chip extends InteractiveElement {
  private variant: ChipVariant;
  private selected = false;
  private removeBtn?: HTMLSpanElement;
  private onRemove?: () => void;
  private onSelect?: (selected: boolean) => void;

  constructor(label: string, variant: ChipVariant = "assist") {
    super("div");
    this.variant = variant;
    this.element.className = "m3-chip";
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.height = `${CHIP_HEIGHT}px`;
    this.element.style.borderRadius = `${currentTheme.shapeCornerSmall}px`;
    this.element.style.padding = "0 16px";
    this.element.style.gap = "8px";
    this.element.style.cursor = "pointer";
    this.element.style.fontFamily = currentTheme.fontFamily;
    this.element.style.fontSize = "14px";
    this.element.style.boxSizing = "border-box";
    this.element.style.userSelect = "none";
    this.element.style.transition =
      "background-color 0.1s ease, border-color 0.1s ease";
    this.element.tabIndex = 0;

    this.SetLabel(label);
    this.SetFocusRingColor(currentTheme.primary);

    if (variant === "input") {
      this.removeBtn = document.createElement("span");
      this.removeBtn.textContent = "✕";
      this.removeBtn.style.fontSize = "16px";
      this.removeBtn.style.marginLeft = "4px";
      this.removeBtn.style.position = "relative";
      this.removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onRemove?.();
        this.element.remove();
      });
      this.element.appendChild(this.removeBtn);
    }

    this.element.addEventListener("click", () => {
      if (variant === "filter") {
        this.selected = !this.selected;
        this.onSelect?.(this.selected);
      }
      this.updateStyle();
    });

    this.updateStyle();
  }

  private updateStyle() {
    if (this.selected) {
      this.element.style.backgroundColor = currentTheme.secondaryContainer;
      this.element.style.border = "none";
      this.element.style.color = currentTheme.onSecondaryContainer;
      this.SetStateLayerColor(currentTheme.onSecondaryContainer);
    } else {
      this.element.style.backgroundColor = "transparent";
      this.element.style.border = `1px solid ${currentTheme.outline}`;
      this.element.style.color = currentTheme.onSurfaceVariant;
      this.SetStateLayerColor(currentTheme.onSurfaceVariant);
    }
    if (this.removeBtn) this.removeBtn.style.color = this.element.style.color;
  }

  SetSelected(selected: boolean): this {
    this.selected = selected;
    this.updateStyle();
    return this;
  }

  IsSelected(): boolean {
    return this.selected;
  }

  SetOnSelect(callback: (selected: boolean) => void): this {
    this.onSelect = callback;
    return this;
  }

  SetOnRemove(callback: () => void): this {
    this.onRemove = callback;
    return this;
  }

  SetOnClick(callback: () => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "Chip";
  }
}

export function CreateChip(
  label: string,
  variant: ChipVariant = "assist",
): Chip {
  return new Chip(label, variant);
}

export function AddChip(
  parent: LayoutElement,
  label: string,
  variant: ChipVariant = "assist",
): Chip {
  const chip = CreateChip(label, variant);
  parent.AddChild(chip);
  return chip;
}
