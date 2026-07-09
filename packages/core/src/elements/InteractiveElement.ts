import { BaseElement } from "./base_element.ts";
import { ElevationShadow } from "./helper.ts";

export type InteractionState = "hover" | "focus" | "pressed" | "dragged";

/** M3 spec state-layer opacities. */
const STATE_LAYER_OPACITY: Record<InteractionState, number> = {
  hover: 0.08,
  focus: 0.12,
  pressed: 0.12,
  dragged: 0.16,
};

/**
 * Base for any clickable/focusable surface: Button, IconButton, Fab, Chip,
 * Card, menu items, etc. Handles the three things every one of those was
 * previously reimplementing by hand:
 *
 *  - a state layer (the tinted overlay M3 uses for hover/press/focus)
 *  - a focus-visible ring for keyboard users
 *  - a standardized disabled look (38% opacity + pointer-events: none)
 *  - optional elevation, with an automatic "lift on hover/press" transition
 *
 * Subclasses get full control of their own DOM/visuals; this only owns the
 * interaction chrome layered underneath. Use `SetLabel` instead of setting
 * `element.textContent` directly, since textContent would wipe the state
 * layer / focus ring nodes this class appends as children.
 */
export class InteractiveElement extends BaseElement {
  protected stateLayer: HTMLDivElement;
  protected labelEl: HTMLSpanElement | null = null;

  private focusRing: HTMLDivElement | null = null;
  private _focusRingColor = "";
  private _disabled = false;
  private _hovering = false;
  private _pressed = false;
  private _focused = false;

  private _restElevation = 0;
  private _liftElevation: number | null = null;
  private _shadowAlpha = 0.3;

  constructor(tag: string) {
    super(tag);

    if (!this.element.style.position) this.element.style.position = "relative";
    this.element.style.overflow = this.element.style.overflow || "hidden";

    this.stateLayer = document.createElement("div");
    this.stateLayer.className = "m3-state-layer";
    this.stateLayer.style.cssText = `
      position: absolute; inset: 0; border-radius: inherit;
      background-color: currentColor; opacity: 0; pointer-events: none;
      transition: opacity 0.1s ease;
    `;
    this.element.appendChild(this.stateLayer);

    this.element.addEventListener("mouseenter", () => {
      this._hovering = true;
      this.refreshStateLayer();
    });
    this.element.addEventListener("mouseleave", () => {
      this._hovering = false;
      this._pressed = false;
      this.refreshStateLayer();
      this.refreshElevation();
    });
    this.element.addEventListener("mousedown", () => {
      this._pressed = true;
      this.refreshStateLayer();
      this.refreshElevation();
    });
    this.element.addEventListener("mouseup", () => {
      this._pressed = false;
      this.refreshStateLayer();
      this.refreshElevation();
    });

    this.WireFocusEvents(this.element);
  }

  // ---------- State layer ----------

  private refreshStateLayer(): void {
    if (this._disabled) return;
    let state: InteractionState | null = null;
    if (this._pressed) state = "pressed";
    else if (this._focused) state = "focus";
    else if (this._hovering) state = "hover";
    this.stateLayer.style.opacity = state
      ? String(STATE_LAYER_OPACITY[state])
      : "0";
  }

  /** Tints the hover/press/focus overlay. Defaults to `currentColor`. */
  SetStateLayerColor(color: string): this {
    this.stateLayer.style.backgroundColor = color;
    return this;
  }

  // ---------- Focus ring ----------

  /** Wires focus/blur on any element (e.g. a hidden native input owned by a
   * subclass like a checkbox) to drive this control's focus ring/state layer. */
  protected WireFocusEvents(target: HTMLElement): void {
    target.addEventListener("focus", () => {
      this._focused = true;
      this.refreshStateLayer();
      this.ShowFocusRing();
    });
    target.addEventListener("blur", () => {
      this._focused = false;
      this.refreshStateLayer();
      this.HideFocusRing();
    });
  }

  SetFocusRingColor(color: string): this {
    this._focusRingColor = color;
    if (this.focusRing) this.focusRing.style.outlineColor = color;
    return this;
  }

  protected ShowFocusRing(): void {
    if (this._disabled) return;
    if (!this.focusRing) {
      this.focusRing = document.createElement("div");
      this.focusRing.className = "m3-focus-ring";
      this.focusRing.style.cssText = `
        position: absolute; inset: -2px; border-radius: inherit;
        outline: 2px solid ${this._focusRingColor || "currentColor"};
        outline-offset: 2px; pointer-events: none;
      `;
      this.element.appendChild(this.focusRing);
    }
    this.focusRing.style.display = "block";
  }

  protected HideFocusRing(): void {
    if (this.focusRing) this.focusRing.style.display = "none";
  }

  // ---------- Elevation ----------

  /** Sets resting elevation (dp). Pass `liftDp` to auto-raise on hover/press,
   * matching M3's elevated-surface interaction behavior (Button "elevated",
   * Card, Fab, ...). */
  SetElevation(restDp: number, liftDp?: number, alpha = 0.3): this {
    this._restElevation = restDp;
    this._liftElevation = liftDp ?? null;
    this._shadowAlpha = alpha;
    this.element.style.overflow = "visible"; // shadows must not be clipped
    const transition = this.element.style.transition;
    if (!transition.includes("box-shadow")) {
      this.element.style.transition = [transition, "box-shadow 0.2s ease"]
        .filter(Boolean)
        .join(", ");
    }
    this.refreshElevation();
    return this;
  }

  private refreshElevation(): void {
    if (this._restElevation === 0 && this._liftElevation === null) return;
    const lifted =
      (this._hovering || this._pressed) && this._liftElevation !== null;
    const dp = lifted ? (this._liftElevation as number) : this._restElevation;
    this.element.style.boxShadow = ElevationShadow(dp, this._shadowAlpha);
  }

  // ---------- Disabled state ----------

  /** Standardized M3 disabled look: 38% opacity, no pointer events, native
   * form control (if this tag has one) marked `disabled`. */
  SetDisabled(disabled: boolean, opacity = 0.38): this {
    this._disabled = disabled;
    this.element.style.pointerEvents = disabled ? "none" : "auto";
    this.element.style.opacity = disabled ? String(opacity) : "1";
    if (disabled) {
      this._hovering = false;
      this._pressed = false;
      this._focused = false;
      this.refreshStateLayer();
      this.HideFocusRing();
    }
    const native = this.element as unknown as { disabled?: boolean };
    if (typeof native.disabled === "boolean" || "disabled" in this.element) {
      native.disabled = disabled;
    }
    return this;
  }

  IsDisabled(): boolean {
    return this._disabled;
  }

  override SetEnabled(enabled: boolean): this {
    this.SetDisabled(!enabled);
    return this;
  }

  override IsEnabled(): boolean {
    return !this._disabled;
  }

  // ---------- Label ----------

  /** Sets text content via a dedicated child span, so the state layer /
   * focus ring nodes above aren't wiped out the way `element.textContent =`
   * would wipe them. */
  protected SetLabel(text: string): HTMLSpanElement {
    if (!this.labelEl) {
      this.labelEl = document.createElement("span");
      this.labelEl.style.position = "relative";
      this.element.appendChild(this.labelEl);
    }
    this.labelEl.textContent = text;
    return this.labelEl;
  }
}
