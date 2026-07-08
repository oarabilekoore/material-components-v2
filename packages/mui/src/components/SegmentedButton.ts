import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme } from "../theme.ts";

export class SegmentedButton extends BaseElement {
  private _buttons: HTMLButtonElement[] = [];
  private _selectedIndex: number = -1;
  private _onSelect: ((index: number, value: string) => void) | null = null;
  private _multiSelect: boolean = false;
  private _selectedIndices: Set<number> = new Set();

  constructor(multiSelect: boolean = false) {
    super("div");
    this._multiSelect = multiSelect;
    this.element.className = "m3-segmented-button material-icons";
    this.element.style.display = "inline-flex";
    this.element.style.border = `1px solid ${currentTheme.outline}`;
    this.element.style.borderRadius = `${currentTheme.shapeCornerFull}px`;
    this.element.style.overflow = "hidden";
    this.element.style.fontFamily = currentTheme.fontFamily;
  }

  AddSegment(label: string, value: string, icon?: string): this {
    const btn = document.createElement("button");
    const index = this._buttons.length;

    btn.dataset.value = value;
    btn.style.flex = "1";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.gap = "8px";
    btn.style.padding = "10px 16px";
    btn.style.backgroundColor = "transparent";
    btn.style.color = currentTheme.onSurface;
    btn.style.border = "none";
    btn.style.borderRight =
      index > 0 ? `1px solid ${currentTheme.outline}` : "none";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "500";
    btn.style.transition = "background-color 0.2s ease";

    if (index > 0) {
      this._buttons[index - 1].style.borderRight =
        `1px solid ${currentTheme.outline}`;
    }

    if (icon) {
      const iconSpan = document.createElement("span");
      iconSpan.textContent = icon;
      iconSpan.className = "material-icons";
      btn.appendChild(iconSpan);
    }

    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    btn.appendChild(labelSpan);

    btn.addEventListener("click", () => this.Select(index));

    this._buttons.push(btn);
    this.element.appendChild(btn);
    return this;
  }

  Select(index: number): this {
    if (index < 0 || index >= this._buttons.length) return this;

    if (this._multiSelect) {
      if (this._selectedIndices.has(index)) {
        this._selectedIndices.delete(index);
        this.updateButtonState(index, false);
      } else {
        this._selectedIndices.add(index);
        this.updateButtonState(index, true);
      }
      if (this._onSelect) {
        this._onSelect(index, this._buttons[index].dataset.value || "");
      }
    } else {
      if (this._selectedIndex === index) return this;

      if (this._selectedIndex >= 0) {
        this.updateButtonState(this._selectedIndex, false);
      }
      this._selectedIndex = index;
      this.updateButtonState(index, true);

      if (this._onSelect) {
        this._onSelect(index, this._buttons[index].dataset.value || "");
      }
    }
    return this;
  }

  private updateButtonState(index: number, active: boolean): void {
    const btn = this._buttons[index];
    if (active) {
      btn.style.backgroundColor = currentTheme.secondaryContainer;
      btn.style.color = currentTheme.onSecondaryContainer;
    } else {
      btn.style.backgroundColor = "transparent";
      btn.style.color = currentTheme.onSurface;
    }
  }

  SetOnSelect(callback: (index: number, value: string) => void): this {
    this._onSelect = callback;
    return this;
  }

  override GetType(): string {
    return "SegmentedButton";
  }
}

export function CreateSegmentedButton(
  multiSelect: boolean = false,
): SegmentedButton {
  return new SegmentedButton(multiSelect);
}

export function AddSegmentedButton(
  parent: LayoutElement,
  multiSelect: boolean = false,
): SegmentedButton {
  const seg = CreateSegmentedButton(multiSelect);
  parent.AddChild(seg);
  return seg;
}
