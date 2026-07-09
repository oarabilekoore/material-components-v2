import { InteractiveElement } from "../../../core/src/elements/interactive_element.ts";
import { IconElement } from "../../../core/src/elements/icon_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { FabSize, currentTheme } from "../theme.ts";

export class Fab extends InteractiveElement {
  private _size: FabSize;
  private icon: IconElement;

  constructor(icon: string, size: FabSize = "medium") {
    super("button");
    this._size = size;
    this.element.className = `m3-fab m3-fab-${size}`;

    const sizeMap: Record<FabSize, { dim: string; iconSize: number }> = {
      small: { dim: "40px", iconSize: 24 },
      medium: { dim: "56px", iconSize: 24 },
      large: { dim: "96px", iconSize: 36 },
    };

    this.element.style.width = sizeMap[size].dim;
    this.element.style.height = sizeMap[size].dim;
    this.element.style.borderRadius = `${
      size === "large"
        ? currentTheme.shapeCornerExtraLarge
        : currentTheme.shapeCornerLarge
    }px`;
    this.element.style.backgroundColor = currentTheme.primaryContainer;
    this.element.style.color = currentTheme.onPrimaryContainer;
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    this.element.style.border = "none";
    this.element.style.cursor = "pointer";
    this.element.style.fontFamily = currentTheme.fontFamily;

    this.SetElevation(currentTheme.elevationLevel3, currentTheme.elevationLevel4);
    this.SetStateLayerColor(currentTheme.onPrimaryContainer);
    this.SetFocusRingColor(currentTheme.primary);

    this.icon = new IconElement(icon);
    this.icon.SetIconSize(sizeMap[size].iconSize);
    this.element.appendChild(this.icon.element);
  }

  /** Updates the displayed icon. */
  SetIcon(icon: string): this {
    this.icon.SetIcon(icon);
    return this;
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
