import { BaseElement } from "./base_element.ts";

export interface OverlayOptions {
  /** Renders a full-screen scrim behind the overlay (Dialog: yes, Menu/Tooltip: no). */
  scrim?: boolean;
  /** Clicking the scrim dismisses the overlay. Default true when scrim is on. */
  dismissOnScrimClick?: boolean;
  /** Pressing Escape dismisses the overlay. Default true. */
  dismissOnEscape?: boolean;
  /** Clicking outside the overlay's own element dismisses it (used for
   * scrim-less popups like Menu, where there's no scrim to catch the click). */
  dismissOnOutsideClick?: boolean;
  /** display value to use when open. Default "flex". */
  display?: string;
}

let zCounter = 2000;

/**
 * Base for anything that portals itself to `document.body` and floats above
 * the page: Dialog, Menu, Snackbar, Tooltip. Owns the show/close lifecycle,
 * an optional scrim, Escape/outside-click dismissal, z-index stacking, and
 * point/element-anchored positioning, so each of those stops reimplementing
 * its own portal + dismiss-handler wiring from scratch.
 */
export class OverlayElement extends BaseElement {
  protected scrimEl: HTMLDivElement | null = null;

  private _isOpen = false;
  private _mounted = false;
  private _onDismiss?: () => void;
  private _opts: Required<OverlayOptions>;

  private _outsideClickHandler = (e: MouseEvent) => {
    if (!this.element.contains(e.target as Node)) this.Dismiss();
  };
  private _escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.Dismiss();
  };

  constructor(tag = "div", options: OverlayOptions = {}) {
    super(tag);
    this._opts = {
      scrim: options.scrim ?? false,
      dismissOnScrimClick: options.dismissOnScrimClick ?? true,
      dismissOnEscape: options.dismissOnEscape ?? true,
      dismissOnOutsideClick: options.dismissOnOutsideClick ?? false,
      display: options.display ?? "flex",
    };

    this.element.style.display = "none";

    if (this._opts.scrim) {
      this.scrimEl = document.createElement("div");
      this.scrimEl.className = "m3-overlay-scrim";
      this.scrimEl.style.cssText = `
        position: fixed; inset: 0; display: none;
        align-items: center; justify-content: center;
      `;
      this.scrimEl.addEventListener("click", (e) => {
        if (e.target === this.scrimEl && this._opts.dismissOnScrimClick) {
          this.Dismiss();
        }
      });
    } else {
      this.element.style.position = "fixed";
    }
  }

  /** Sets the scrim's background (e.g. `rgba(0,0,0,0.4)`). No-op if this
   * overlay was created without `scrim: true`. */
  SetScrimColor(color: string): this {
    if (this.scrimEl) this.scrimEl.style.background = color;
    return this;
  }

  /** Registers what runs when the overlay is dismissed via scrim click,
   * Escape, or an outside click (not when closed programmatically). */
  SetOnDismiss(callback: () => void): this {
    this._onDismiss = callback;
    return this;
  }

  private mount(): void {
    if (this._mounted) return;
    this._mounted = true;
    const z = ++zCounter;
    this.element.style.zIndex = String(z);
    if (this.scrimEl) {
      this.scrimEl.style.zIndex = String(z - 1);
      this.scrimEl.appendChild(this.element);
      document.body.appendChild(this.scrimEl);
    } else {
      document.body.appendChild(this.element);
    }
  }

  private unmount(): void {
    if (!this._mounted) return;
    this._mounted = false;
    (this.scrimEl ?? this.element).remove();
  }

  /** Called by the scrim/Escape/outside-click handlers; runs the dismiss
   * callback then closes. Public so a subclass can call it directly (e.g. a
   * dialog's own Cancel button). */
  Dismiss(): void {
    this._onDismiss?.();
    this.Close();
  }

  override Show(): this {
    this._isOpen = true;
    this.mount();
    this.element.style.display = this._opts.display;
    if (this.scrimEl) this.scrimEl.style.display = "flex";

    if (this._opts.dismissOnEscape) {
      document.addEventListener("keydown", this._escHandler);
    }
    if (this._opts.dismissOnOutsideClick) {
      // deferred so the click that opened the overlay doesn't also close it
      setTimeout(() => document.addEventListener("click", this._outsideClickHandler), 0);
    }
    return this;
  }

  Close(): this {
    this._isOpen = false;
    this.element.style.display = "none";
    if (this.scrimEl) this.scrimEl.style.display = "none";
    document.removeEventListener("keydown", this._escHandler);
    document.removeEventListener("click", this._outsideClickHandler);
    this.unmount();
    return this;
  }

  IsOpen(): boolean {
    return this._isOpen;
  }

  /** Opens (if needed) and positions the overlay at an absolute screen
   * coordinate. For scrim-less anchored popups: menus, tooltips. */
  OpenAt(x: number, y: number): this {
    if (!this._isOpen) this.Show();
    this.element.style.position = "absolute";
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    return this;
  }

  /** Opens and anchors the overlay just below a target element. */
  ShowAtElement(target: HTMLElement, gap = 0): this {
    const rect = target.getBoundingClientRect();
    return this.OpenAt(rect.left + window.scrollX, rect.bottom + window.scrollY + gap);
  }

  override GetType(): string {
    return "Overlay";
  }
}
