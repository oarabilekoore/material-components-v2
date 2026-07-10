import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { currentTheme } from "../theme.ts";

export class Tooltip extends BaseElement {
  private _target: BaseElement;
  private _text: string;

  constructor(target: BaseElement, text: string) {
    super("div");
    this._target = target;
    this._text = text;

    this.element.className = "m3-tooltip";
    this.element.textContent = text;
    this.element.style.position = "absolute";
    this.element.style.backgroundColor = currentTheme.inverseSurface;
    this.element.style.color = currentTheme.inverseOnSurface;
    this.element.style.padding = "4px 8px";
    this.element.style.borderRadius = `${currentTheme.shapeCornerExtraSmall * (currentTheme.shapeScale || 1)}px`;
    this.element.style.fontSize = "12px";
    this.element.style.fontFamily = currentTheme.fontFamily;
    this.element.style.pointerEvents = "none";
    this.element.style.opacity = "0";
    this.element.style.transition = "opacity 0.2s ease";
    this.element.style.zIndex = "1000";
    this.element.style.whiteSpace = "nowrap";

    document.body.appendChild(this.element);

    this._target.element.addEventListener("mouseenter", () => this.Show());
    this._target.element.addEventListener("mouseleave", () => this.Hide());
  }

  override Show(): this {
    const rect = this._target.element.getBoundingClientRect();
    this.element.style.top = `${rect.bottom + window.scrollY + 4}px`;
    this.element.style.left = `${rect.left + window.scrollX + rect.width / 2 - this.element.offsetWidth / 2}px`;
    this.element.style.opacity = "1";
    return this;
  }

  override Hide(): this {
    this.element.style.opacity = "0";
    return this;
  }

  override GetType(): string {
    return "Tooltip";
  }
}

function CreateTooltip(target: BaseElement, text: string): Tooltip {
  return new Tooltip(target, text);
}

/**
 * AddTooltip function.
 * @param {BaseElement} target - The target parameter
 * @param {string} text - The text parameter
 * @returns {Tooltip}
 *
 */
export function AddTooltip(target: BaseElement, text: string): Tooltip {
  return new Tooltip(target, text);
}
