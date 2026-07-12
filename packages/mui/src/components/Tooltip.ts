import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { currentTheme } from "../theme.ts";
import { Signal, CreateSignal, Bind } from "../../../core/src/state/signals.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const tooltipSva = sva({
  base: {
    position: "absolute",
    backgroundColor: "var(--md-inverse-surface)",
    color: "var(--md-inverse-on-surface)",
    padding: "4px 8px",
    borderRadius: "calc(var(--md-shape-corner-extra-small) * var(--md-shape-scale, 1))",
    fontSize: "12px",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    pointerEvents: "none",
    transition: "opacity 0.2s ease",
    zIndex: 1000,
    whiteSpace: "nowrap",
  },
  variants: {
    open: {
      true: { opacity: "1" },
      false: { opacity: "0" }
    }
  },
  defaultVariants: { open: false }
});

export class Tooltip extends BaseElement {
  private _target: BaseElement;
  private _text: string;
  private _isOpen: Signal<boolean>;

  constructor(target: BaseElement, text: string) {
    super("div");
    this._target = target;
    this._text = text;

    this.element.className = "m3-tooltip " + tooltipSva({ open: false });
    this.element.textContent = text;

    document.body.appendChild(this.element);

    const anchorName = `--tooltip-anchor-${Math.random().toString(36).substring(2, 8)}`;
    this._target.element.style.setProperty("anchor-name", anchorName);
    this.element.style.setProperty("position-anchor", anchorName);
    this.element.style.setProperty("position-area", "block-start");
    this.element.style.setProperty("position-try-fallbacks", "flip-block, flip-inline");
    this.element.style.inset = "auto";
    this.element.style.margin = "0";

    this._isOpen = CreateSignal(false);
    Bind(this._isOpen, (isOpen) => {
      this.element.className = "m3-tooltip " + tooltipSva({ open: isOpen });
    });

    this._target.element.addEventListener("mouseenter", () => this._isOpen.Set(true));
    this._target.element.addEventListener("mouseleave", () => this._isOpen.Set(false));
  }

  override Show(): this {
    this._isOpen.Set(true);
    return this;
  }

  override Hide(): this {
    this._isOpen.Set(false);
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
