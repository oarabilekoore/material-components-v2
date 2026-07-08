import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { FabSize, currentTheme } from "../theme.ts";

export class Fab extends BaseElement {
  private _size: FabSize;
  private iconEl: HTMLElement;

  constructor(icon: string, size: FabSize = "medium") {
    super("button");
    this._size = size;
    this.element.className = `m3-fab m3-fab-${size}`;

    const sizeMap: Record<FabSize, { dim: string; iconSize: string }> = {
      small: { dim: "40px", iconSize: "20px" },
      medium: { dim: "56px", iconSize: "24px" },
      large: { dim: "96px", iconSize: "36px" },
    };

    const currentDim = sizeMap[size].dim;

    this.element.style.cssText = `
      width: ${currentDim};
      height: ${currentDim};
      border-radius: ${size === "large" ? currentTheme.shapeCornerExtraLarge : currentTheme.shapeCornerLarge}px;
      background-color: ${currentTheme.primaryContainer};
      color: ${currentTheme.onPrimaryContainer};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      box-shadow: 0 ${currentTheme.elevationLevel3}px ${currentTheme.elevationLevel4}px rgba(0,0,0,0.2);
      transition: box-shadow 0.2s ease, background-color 0.2s ease;
      font-family: var(--md-font-family, Roboto, sans-serif);
    `;

    this.iconEl = document.createElement("span");
    this.iconEl.className = "material-icons";
    this.iconEl.textContent = icon;
    this.iconEl.style.fontSize = sizeMap[size].iconSize;
    this.element.appendChild(this.iconEl);

    this.element.addEventListener("mouseenter", () => {
      this.element.style.boxShadow = `0 ${currentTheme.elevationLevel4}px ${currentTheme.elevationLevel5}px rgba(0,0,0,0.3)`;
    });
    this.element.addEventListener("mouseleave", () => {
      this.element.style.boxShadow = `0 ${currentTheme.elevationLevel3}px ${currentTheme.elevationLevel4}px rgba(0,0,0,0.2)`;
    });
  }

  SetOnClick(callback: (e: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "Fab";
  }
}

export function CreateFab(icon: string, size: FabSize = "medium"): Fab {
  return new Fab(icon, size);
}

export function AddFab(
  parent: LayoutElement,
  icon: string,
  size: FabSize = "medium",
): Fab {
  const fab = CreateFab(icon, size);
  parent.AddChild(fab);
  return fab;
}
