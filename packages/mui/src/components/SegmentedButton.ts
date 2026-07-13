import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";

import { attachRipple } from "../../../core/src/utils/ripple.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const containerSva = sva({
  base: {
    display: "inline-flex",
    border: "1px solid var(--md-outline)",
    borderRadius: "100px", // Full radius
    overflow: "hidden",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

const segmentBtnSva = sva({
  base: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "transparent",
    color: "var(--md-on-surface)",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
  variants: {
    active: {
      true: {
        backgroundColor: "var(--md-secondary-container)",
        color: "var(--md-on-secondary-container)",
      },
      false: {
        backgroundColor: "transparent",
        color: "var(--md-on-surface)",
      },
    },
    hasBorder: {
      true: {
        borderRight: "1px solid var(--md-outline)",
      },
      false: {
        borderRight: "none",
      },
    },
  },
  defaultVariants: {
    active: false,
    hasBorder: false,
  },
});

export class SegmentedButton extends BaseElement {
  private _buttons: HTMLButtonElement[] = [];
  private _selectedIndex: number = -1;
  private _onSelect: ((value: string) => void) | null = null;
  private _multiSelect: boolean = false;
  private _selectedIndices: Set<number> = new Set();
  private _defaultIcons: (SvgIconNode[] | string | undefined)[] = [];
  private _icons: Icon[] = [];

  constructor(multiSelect: boolean = false) {
    super("div");
    this._multiSelect = multiSelect;
    this.element.className = "m3-segmented-button " + containerSva();
  }

  AddSegment(label: string, iconNodes?: SvgIconNode[] | string): this {
    const btn = document.createElement("button");
    const index = this._buttons.length;
    btn.dataset.label = label;
    this._defaultIcons.push(iconNodes);

    btn.className = segmentBtnSva({ active: false, hasBorder: index > 0 });

    if (index > 0) {
      this._buttons[index - 1].className = segmentBtnSva({ active: this._selectedIndices.has(index - 1) || this._selectedIndex === index - 1, hasBorder: true });
    }

    const iconSpan = new Icon(iconNodes || Icons.check);
    iconSpan.SetIconSize(18);
    if (iconNodes) {
      iconSpan.SetIcon(iconNodes);
    } else {
      iconSpan.element.style.display = "none";
    }
    this._icons.push(iconSpan);
    btn.appendChild(iconSpan.element);

    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    btn.appendChild(labelSpan);

    btn.addEventListener("click", () => this.Select(index));

    this._buttons.push(btn);
    this.element.appendChild(btn);
    
    attachRipple(btn);
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
        this._onSelect(this._buttons[index].dataset.label || "");
      }
    } else {
      if (this._selectedIndex === index) return this;

      if (this._selectedIndex >= 0) {
        this.updateButtonState(this._selectedIndex, false);
      }
      this._selectedIndex = index;
      this.updateButtonState(index, true);

      if (this._onSelect) {
        this._onSelect(this._buttons[index].dataset.label || "");
      }
    }
    return this;
  }

  private updateButtonState(index: number, active: boolean): void {
    const btn = this._buttons[index];
    const iconSpan = this._icons[index];
    const defaultIcon = this._defaultIcons[index];

    if (active) {
      btn.className = segmentBtnSva({ active: true, hasBorder: index < this._buttons.length - 1 });
      iconSpan.SetIcon(Icons.check);
      iconSpan.element.style.display = "inline-flex";
    } else {
      btn.className = segmentBtnSva({ active: false, hasBorder: index < this._buttons.length - 1 });
      if (defaultIcon) {
        iconSpan.SetIcon(defaultIcon);
        iconSpan.element.style.display = "inline-flex";
      } else {
        iconSpan.element.style.display = "none";
      }
    }
  }

  SetOnSelect(callback: (label: string) => void): this {
    this._onSelect = callback;
    return this;
  }

  override GetType(): string {
    return "SegmentedButton";
  }
}

function CreateSegmentedButton(multiSelect: boolean = false): SegmentedButton {
  return new SegmentedButton(multiSelect);
}

/**
 * AddSegmentedButton function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {boolean} multiSelect - The multiSelect parameter
 * @returns {SegmentedButton}
 *
 */
export function AddSegmentedButton(
  parent: LayoutElement,
  multiSelect: boolean = false,
): SegmentedButton {
  const seg = CreateSegmentedButton(multiSelect);
  parent.AddChild(seg);
  return seg;
}
