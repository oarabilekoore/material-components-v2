import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { FabSize, currentTheme } from "../theme.ts";

export class ExtendedFab extends BaseElement {
  private _size: FabSize;
  private iconEl: HTMLElement;
  private labelEl: HTMLSpanElement;
  private _extended = true;

  constructor(icon: string, label: string, size: FabSize = "medium") {
    super("button");
    this._size = size;
    this.element.className = `m3-extended-fab m3-extended-fab-${size}`;

    const sizeMap: Record<
      FabSize,
      {
        height: string;
        iconSize: string;
        fontSize: string;
        padding: string;
        radius: number;
      }
    > = {
      small: {
        height: "56px",
        iconSize: "24px",
        fontSize: "0.875rem",
        padding: "0 16px",
        radius: currentTheme.shapeCornerLarge,
      },
      medium: {
        height: "80px",
        iconSize: "28px",
        fontSize: "1rem",
        padding: "0 26px",
        radius: currentTheme.shapeCornerExtraLarge,
      },
      large: {
        height: "96px",
        iconSize: "36px",
        fontSize: "1.15rem",
        padding: "0 32px",
        radius: currentTheme.shapeCornerExtraLarge,
      },
    };
    const s = sizeMap[size];

    this.element.style.cssText = `
      height: ${s.height};
      padding: ${s.padding};
      border-radius: ${s.radius}px;
      background-color: ${currentTheme.primaryContainer};
      color: ${currentTheme.onPrimaryContainer};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      border: none;
      cursor: pointer;
      box-shadow: 0 ${currentTheme.elevationLevel3}px ${currentTheme.elevationLevel4}px rgba(0,0,0,0.2);
      transition: box-shadow 0.2s ease, background-color 0.2s ease, padding 0.2s ease, width 0.2s ease;
      font-family: ${currentTheme.fontFamily};
      white-space: nowrap;
      overflow: hidden;
    `;

    this.iconEl = document.createElement("span");
    this.iconEl.className = "material-icons";
    this.iconEl.textContent = icon;
    this.iconEl.style.fontSize = s.iconSize;
    this.iconEl.style.flexShrink = "0";

    this.labelEl = document.createElement("span");
    this.labelEl.textContent = label;
    this.labelEl.style.fontSize = s.fontSize;
    this.labelEl.style.fontWeight = "500";
    this.labelEl.style.transition =
      "max-width 0.2s ease, opacity 0.15s ease, margin 0.2s ease";
    this.labelEl.style.maxWidth = "300px";
    this.labelEl.style.opacity = "1";
    this.labelEl.style.overflow = "hidden";

    this.element.appendChild(this.iconEl);
    this.element.appendChild(this.labelEl);

    this.element.addEventListener("mouseenter", () => {
      this.element.style.boxShadow = `0 ${currentTheme.elevationLevel4}px ${currentTheme.elevationLevel5}px rgba(0,0,0,0.3)`;
    });
    this.element.addEventListener("mouseleave", () => {
      this.element.style.boxShadow = `0 ${currentTheme.elevationLevel3}px ${currentTheme.elevationLevel4}px rgba(0,0,0,0.2)`;
    });
  }

  /** Shows the text label alongside the icon (default state). */
  Extend(): this {
    if (this._extended) return this;
    this._extended = true;
    this.labelEl.style.maxWidth = "300px";
    this.labelEl.style.opacity = "1";
    return this;
  }

  /** Collapses to icon-only, matching Android's shrink() behavior (e.g. on scroll). */
  Shrink(): this {
    if (!this._extended) return this;
    this._extended = false;
    this.labelEl.style.maxWidth = "0";
    this.labelEl.style.opacity = "0";
    return this;
  }

  IsExtended(): boolean {
    return this._extended;
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "ExtendedFab";
  }
}

export function CreateExtendedFab(
  icon: string,
  label: string,
  size: FabSize = "medium",
): ExtendedFab {
  return new ExtendedFab(icon, label, size);
}

export function AddExtendedFab(
  parent: LayoutElement,
  icon: string,
  label: string,
  size: FabSize = "medium",
): ExtendedFab {
  const fab = CreateExtendedFab(icon, label, size);
  parent.AddChild(fab);
  return fab;
}
