import { attachStyleObject } from "../utils/sva.ts";
import { Bind } from "../state/signals.ts";
import { WindowSizeClass, WindowSizeClassKey } from "../state/breakpoints.ts";


export type VisSource = "route" | "morph" | "manual";

export class VisibilityArbiter {
  private votes = new Map<VisSource, boolean>();
  constructor(private el: BaseElement) {}
  Vote(source: VisSource, visible: boolean) {
    this.votes.set(source, visible);
    this.resolve();
  }
  private resolve() {
    const visible = [...this.votes.values()].every(v => v);
    this.el.element.style.display = visible ? (this.el as any).goneDisplay : "none";
  }
}

export type MorphMethodCall<T> = {
  [K in keyof T]?: T[K] extends (...args: infer A) => any ? A : never;
};
export type MorphOrderedCall<T> = Array<
  { [K in keyof T]: T[K] extends (...args: infer A) => any ? [K, A] : never }[keyof T]
>;
export type MorphBreakpointValue<T> =
  | MorphMethodCall<T>
  | MorphOrderedCall<T>
  | ((el: T) => void);

export type MorphConfig<T> = Partial<Record<WindowSizeClassKey, MorphBreakpointValue<T>>>;

const TOGGLE_DEFAULTS: Partial<Record<string, unknown>> = {
  SetVisibility: ["Gone"],
};

type MorphEntry = { el: BaseElement; config: MorphConfig<any>; resolve: () => void };
const _morphRegistry = new Set<MorphEntry>();
let _morphBindInitialized = false;

function ensureMorphBind() {
  if (_morphBindInitialized) return;
  _morphBindInitialized = true;
  Bind(WindowSizeClass.Get(), () => {
    for (const entry of _morphRegistry) entry.resolve();
  });
}

function applyMorphResolution<T extends BaseElement>(el: T, config: MorphConfig<T>) {
  const current = WindowSizeClass.Get().Get();
  const order: WindowSizeClassKey[] = ["Compact", "Medium", "Expanded"];
  const upTo = order.slice(0, order.indexOf(current) + 1);

  const allMethods = new Set<string>();
  for (const bp of order) {
    const val = config[bp];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      Object.keys(val).forEach(m => allMethods.add(m));
    }
  }

  const resolvedCalls: Record<string, unknown[]> = {};

  for (const method of allMethods) {
    const declaredAt = order.filter(bp => {
      const val = config[bp];
      return val && typeof val === "object" && !Array.isArray(val) && method in val;
    });

    if (method in TOGGLE_DEFAULTS && declaredAt.length === 1) {
      const bp = declaredAt[0];
      if (upTo.includes(bp)) {
        resolvedCalls[method] = (config[bp] as any)[method];
      } else {
        resolvedCalls[method] = TOGGLE_DEFAULTS[method] as unknown[];
      }
      continue;
    }

    for (const bp of upTo) {
      const val = config[bp];
      if (val && typeof val === "object" && !Array.isArray(val) && method in val) {
        resolvedCalls[method] = (val as any)[method];
      }
    }
  }

  el.Batch(resolvedCalls, true);

  const currentVal = config[current];
  if (currentVal) {
    if (Array.isArray(currentVal)) {
      for (const [method, args] of currentVal as [keyof T, unknown[]][]) {
        const fn = (el as any)[method];
        if (typeof fn === "function") {
          if (method === "SetVisibility") {
             fn.apply(el, [...args, true]);
          } else {
             fn.apply(el, args);
          }
        }
      }
    } else if (typeof currentVal === "function") {
      currentVal(el);
    }
  }
}

export type Visibility = "Show" | "Hide" | "Gone";

/** Base wrapper around any HTML element. All controls extend this. */
export class BaseElement {
  element: HTMLElement;
  data: Record<string, unknown> = {};

  protected goneDisplay = "";
  _visibility: VisibilityArbiter;
  private longTouchTimer: number | undefined;
  private _appliedStyleClass = "";
  protected _cleanupTasks: Array<() => void> = [];

  /** Attaches CSS declaration/object style rules directly to the dynamic stylesheet */
  SetStyle(
    style: Partial<CSSStyleDeclaration> | Record<string, any> | string,
    ..._args: any[]
  ): this {
    if (typeof style === "string") {
      return this;
    }
    if (style && typeof style === "object") {
      if (this._appliedStyleClass) {
        this.element.classList.remove(this._appliedStyleClass);
      }
      const className = attachStyleObject(style);
      this._appliedStyleClass = className;
      if (className) {
        this.element.classList.add(className);
      }
    }
    return this;
  }

  constructor(element: string) {
    this.element = document.createElement(element);
    this.goneDisplay = getComputedStyle(this.element).display || "block";
    this._visibility = new VisibilityArbiter(this);
  }

  /** Sets background color. */
  SetBackColor(color: string) {
    this.element.style.backgroundColor = color;
    return this;
  }

  /** Sets background transparency. 0..0.99 or 1..256, higher = more transparent. */
  SetBackAlpha(alpha: number) {
    const a = alpha > 1 ? 1 - alpha / 256 : 1 - alpha;
    this.element.style.opacity = `${Math.max(0, Math.min(1, a))}`;
    return this;
  }

  /** Sets a linear background gradient. */
  SetBackGradient(
    color1: string,
    color2?: string,
    color3?: string,
    options?: {
      direction?: "left-right" | "right-left" | "top-bottom" | "bottom-top";
    },
  ) {
    const dirMap: Record<string, string> = {
      "top-bottom": "to bottom",
      "bottom-top": "to top",
      "left-right": "to right",
      "right-left": "to left",
    };
    const dir = dirMap[options?.direction ?? "top-bottom"];
    const stops = [color1, color2, color3].filter(Boolean).join(", ");
    this.element.style.background = `linear-gradient(${dir}, ${stops})`;
    return this;
  }

  /** Sets a radial background gradient. */
  SetBackGradientRadial(
    x: number,
    y: number,
    radius = 100,
    color1 = "white",
    color2?: string,
    color3?: string,
  ) {
    const stops = [color1, color2, color3].filter(Boolean).join(", ");
    this.element.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${stops})`;
    this.element.style.backgroundSize = `${radius * 2}px ${radius * 2}px`;
    return this;
  }

  /** Sets a background image. Pass "repeat" to tile it. */
  SetBackground(file: string, options?: string) {
    this.element.style.backgroundImage = `url(${file})`;
    this.element.style.backgroundRepeat =
      options === "repeat" ? "repeat" : "no-repeat";
    if (options !== "repeat") this.element.style.backgroundSize = "cover";
    return this;
  }

  /** Applies a color tint via a blend mode. */
  SetColorFilter(color: string, mode = "src-over") {
    this.element.style.filter = `drop-shadow(0 0 0 ${color})`;
    this.element.style.mixBlendMode = mode as string;
    return this;
  }

  /** Adjusts hue, saturation, brightness, contrast. */
  AdjustColor(hue: number, saturation = 0, brightness = 0, contrast = 0) {
    this.element.style.filter = `hue-rotate(${hue}deg) saturate(${100 + saturation}%) brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;
    return this;
  }

  /** Scales the element and its contents. */
  SetScale(x: number, y: number = x) {
    this.element.style.transform = `scale(${x}, ${y})`;
    return this;
  }

  /**
   * Sets size. width/height are a 0..1 fraction of the parent unless
   * options.px is true, in which case they're literal pixels. -1 = auto.
   */
  SetSize(width: number = -1, height: number = -1, options?: { px?: boolean }) {
    const px = options?.px ?? false;
    this.element.style.width =
      width === -1 ? "auto" : px ? `${width}px` : `${width * 100}%`;
    this.element.style.height =
      height === -1 ? "auto" : px ? `${height}px` : `${height * 100}%`;
    return this;
  }

  /** Gets width as a fraction of the parent, or pixels with options.px. */
  GetWidth(options?: { px?: boolean }): number {
    if (options?.px) return this.element.getBoundingClientRect().width;
    const parent = this.element.parentElement;
    if (!parent) return 0;
    return (
      this.element.getBoundingClientRect().width /
      parent.getBoundingClientRect().width
    );
  }

  /** Gets height as a fraction of the parent, or pixels with options.px. */
  GetHeight(options?: { px?: boolean }): number {
    if (options?.px) return this.element.getBoundingClientRect().height;
    const parent = this.element.parentElement;
    if (!parent) return 0;
    return (
      this.element.getBoundingClientRect().height /
      parent.getBoundingClientRect().height
    );
  }

  /** Gets absolute width in pixels. */
  GetAbsWidth(): number {
    return this.element.getBoundingClientRect().width;
  }

  /** Gets absolute height in pixels. */
  GetAbsHeight(): number {
    return this.element.getBoundingClientRect().height;
  }

  /** Positions and optionally resizes within an Absolute layout parent. */
  SetPosition(
    left: number,
    top: number,
    width?: number,
    height?: number,
    options?: { px?: boolean },
  ) {
    const px = options?.px ?? false;
    this.element.style.position = "absolute";
    this.element.style.left = px ? `${left}px` : `${left * 100}%`;
    this.element.style.top = px ? `${top}px` : `${top * 100}%`;
    if (width !== undefined) this.SetSize(width, height ?? -1, options);
    return this;
  }

  /** Gets distance from the left parent border. */
  GetLeft(options?: { px?: boolean }): number {
    const parent = this.element.parentElement;
    const rect = this.element.getBoundingClientRect();
    if (options?.px || !parent) return rect.left;
    return (
      (rect.left - parent.getBoundingClientRect().left) /
      parent.getBoundingClientRect().width
    );
  }

  /** Gets distance from the top parent border. */
  GetTop(options?: { px?: boolean }): number {
    const parent = this.element.parentElement;
    const rect = this.element.getBoundingClientRect();
    if (options?.px || !parent) return rect.top;
    return (
      (rect.top - parent.getBoundingClientRect().top) /
      parent.getBoundingClientRect().height
    );
  }

  /** Gets left, top, width, height together. */
  GetPosition(options?: { px?: boolean }) {
    return {
      left: this.GetLeft(options),
      top: this.GetTop(options),
      width: this.GetWidth(options),
      height: this.GetHeight(options),
    };
  }

  /** Sets outer margins. */
  SetMargins(left = 0, top = 0, right = 0, bottom = 0, mode = "px") {
    const u = mode === "px" ? "px" : mode;
    this.element.style.marginLeft = `${left}${u}`;
    this.element.style.marginTop = `${top}${u}`;
    this.element.style.marginRight = `${right}${u}`;
    this.element.style.marginBottom = `${bottom}${u}`;
    return this;
  }

  /** Sets inner padding. */
  SetPadding(left = 0, top = 0, right = 0, bottom = 0, mode = "px") {
    const u = mode === "px" ? "px" : mode;
    this.element.style.paddingLeft = `${left}${u}`;
    this.element.style.paddingTop = `${top}${u}`;
    this.element.style.paddingRight = `${right}${u}`;
    this.element.style.paddingBottom = `${bottom}${u}`;
    return this;
  }

  /** Sets text color. */
  SetColor(color: string) {
    this.element.style.color = color;
    return this;
  }

  /** Sets background color. */
  SetBackgroundColor(color: string) {
    this.element.style.backgroundColor = color;
    return this;
  }

  /** Sets border radius. */
  SetBorderRadius(radius: string | number) {
    this.element.style.borderRadius = typeof radius === "number" ? `${radius}px` : radius;
    return this;
  }

  /** Sets box shadow. */
  SetBoxShadow(shadow: string) {
    this.element.style.boxShadow = shadow;
    return this;
  }

  /** Sets font family. */
  SetFontFamily(fontFamily: string) {
    this.element.style.fontFamily = fontFamily;
    return this;
  }

  /** Sets font size. */
  SetFontSize(size: string | number) {
    this.element.style.fontSize = typeof size === "number" ? `${size}px` : size;
    return this;
  }

  /** Sets font weight. */
  SetFontWeight(weight: string | number) {
    this.element.style.fontWeight = String(weight);
    return this;
  }

  /** Sets display property. */
  SetDisplay(display: string) {
    this.element.style.display = display;
    return this;
  }

  /** Sets align-items. */
  SetAlignItems(align: string) {
    this.element.style.alignItems = align;
    return this;
  }

  /** Sets justify-content. */
  SetJustifyContent(justify: string) {
    this.element.style.justifyContent = justify;
    return this;
  }

  /** Sets border. */
  SetBorder(border: string) {
    this.element.style.border = border;
    return this;
  }

  /** Sets outline. */
  SetOutline(outline: string) {
    this.element.style.outline = outline;
    return this;
  }

  /** Sets transition. */
  SetTransition(transition: string) {
    this.element.style.transition = transition;
    return this;
  }

  /** Sets opacity. */
  SetOpacity(opacity: number | string) {
    this.element.style.opacity = String(opacity);
    return this;
  }

  /** Sets z-index. */
  SetZIndex(zIndex: number | string) {
    this.element.style.zIndex = String(zIndex);
    return this;
  }

  /** Makes visible, restoring layout space. */
  Show() {
    this.element.style.visibility = "visible";
    this._visibility.Vote("manual", true);
    return this;
  }

  /** Hides but keeps layout space reserved. */
  Hide() {
    this.element.style.visibility = "hidden";
    return this;
  }

  /** Hides and removes from layout flow entirely. */
  Gone() {
    this._visibility.Vote("manual", false);
    return this;
  }

  /** Sets visibility to "Show", "Hide", or "Gone". */
  SetVisibility(mode: Visibility, isMorph = false) {
    const source = isMorph ? "morph" : "manual";
    if (mode === "Show") {
      this.element.style.visibility = "visible";
      this._visibility.Vote(source, true);
    } else if (mode === "Hide") {
      this.element.style.visibility = "hidden";
    } else {
      this._visibility.Vote(source, false);
    }
    return this;
  }

  /** Gets current visibility state. */
  GetVisibility(): Visibility {
    if (this.element.style.display === "none") return "Gone";
    if (this.element.style.visibility === "hidden") return "Hide";
    return "Show";
  }

  /** True if visible (not Hide or Gone). */
  IsVisible(): boolean {
    return this.GetVisibility() === "Show";
  }

  /** Enables or disables user interaction. */
  SetEnabled(enable: boolean) {
    if (
      this.element instanceof HTMLButtonElement ||
      this.element instanceof HTMLInputElement ||
      this.element instanceof HTMLTextAreaElement ||
      this.element instanceof HTMLSelectElement
    ) {
      this.element.disabled = !enable;
    }
    this.element.style.pointerEvents = enable ? "auto" : "none";
    this.element.style.opacity = enable ? "1" : "0.5";
    return this;
  }

  /** True if currently enabled. */
  IsEnabled(): boolean {
    if (
      this.element instanceof HTMLButtonElement ||
      this.element instanceof HTMLInputElement ||
      this.element instanceof HTMLTextAreaElement ||
      this.element instanceof HTMLSelectElement
    ) {
      return !this.element.disabled;
    }
    return this.element.style.pointerEvents !== "none";
  }

  /** Focuses the element. */
  Focus() {
    this.element.focus();
    return this;
  }

  /** Removes focus. */
  ClearFocus() {
    this.element.blur();
    return this;
  }

  /** Sets an accessibility label. */
  SetDescription(desc: string) {
    this.element.setAttribute("aria-label", desc);
    return this;
  }

  /** Gets the underlying tag name. */
  GetType(): string {
    return this.element.tagName;
  }

  /** Gets the parent control, if any. */
  GetParent(): BaseElement | null {
    const parent = this.element.parentElement;
    if (!parent) return null;
    const wrapped = new BaseElement(parent.tagName.toLowerCase());
    wrapped.element = parent;
    return wrapped;
  }

  /** True if this overlaps another control within a given distance. */
  IsOverlap(other: BaseElement, depth = 0): boolean {
    const a = this.element.getBoundingClientRect();
    const b = other.element.getBoundingClientRect();
    return !(
      a.right + depth < b.left ||
      a.left - depth > b.right ||
      a.bottom + depth < b.top ||
      a.top - depth > b.bottom
    );
  }

  private _onTouchCb?: (event: MouseEvent) => void;

  /** Fires on click/tap. */
  SetOnTouch(callback: (event: MouseEvent) => void) {
    if (this._onTouchCb) {
      this.element.removeEventListener("click", this._onTouchCb);
    }
    this._onTouchCb = callback;
    this.element.addEventListener("click", callback);
    return this;
  }

  private _onMousedownCb?: (e: MouseEvent) => void;
  private _onMouseupCb?: () => void;
  private _onMouseleaveCb?: () => void;

  /** Fires after holding for holdMs (default 500). */
  SetOnLongTouch(callback: (event: MouseEvent) => void, holdMs = 500) {
    if (this._onMousedownCb) this.element.removeEventListener("mousedown", this._onMousedownCb);
    if (this._onMouseupCb) this.element.removeEventListener("mouseup", this._onMouseupCb);
    if (this._onMouseleaveCb) this.element.removeEventListener("mouseleave", this._onMouseleaveCb);

    this._onMousedownCb = (e: MouseEvent) => {
      this.longTouchTimer = window.setTimeout(() => callback(e), holdMs);
    };
    this._onMouseupCb = () => clearTimeout(this.longTouchTimer);
    this._onMouseleaveCb = () => clearTimeout(this.longTouchTimer);

    this.element.addEventListener("mousedown", this._onMousedownCb);
    this.element.addEventListener("mouseup", this._onMouseupCb);
    this.element.addEventListener("mouseleave", this._onMouseleaveCb);
    return this;
  }

  RegisterCleanup(task: () => void): this {
    this._cleanupTasks.push(task);
    return this;
  }

  Dispose(): void {
    this._cleanupTasks.forEach((task) => task());
    this._cleanupTasks = [];
    if (this._onTouchCb) this.element.removeEventListener("click", this._onTouchCb);
    if (this._onMousedownCb) this.element.removeEventListener("mousedown", this._onMousedownCb);
    if (this._onMouseupCb) this.element.removeEventListener("mouseup", this._onMouseupCb);
    if (this._onMouseleaveCb) this.element.removeEventListener("mouseleave", this._onMouseleaveCb);
    
    // Use remove() rather than innerHTML for direct children if this is called recursively?
    // Child disposal is handled by subclasses like LayoutElement.
    
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
  }

  /** Runs a Web Animations API animation. */
  Animate(
    keyframes: Keyframe[],
    options?: KeyframeAnimationOptions,
    callback?: () => void,
  ) {
    const anim = this.element.animate(
      keyframes,
      options ?? { duration: 300, fill: "forwards" },
    );
    if (callback) anim.onfinish = () => callback();
    return anim;
  }

  /** Animates position/size/rotation toward a target over duration ms. */
  Tween(
    target: { x?: number; y?: number; w?: number; h?: number; rot?: number },
    duration = 300,
    callback?: () => void,
  ) {
    const keyframes: Keyframe[] = [
      {
        transform: [
          target.x !== undefined ? `translateX(${target.x}px)` : "",
          target.y !== undefined ? `translateY(${target.y}px)` : "",
          target.rot !== undefined ? `rotate(${target.rot}deg)` : "",
        ]
          .filter(Boolean)
          .join(" "),
        ...(target.w !== undefined ? { width: `${target.w}px` } : {}),
        ...(target.h !== undefined ? { height: `${target.h}px` } : {}),
      },
    ];
    return this.Animate(keyframes, { duration, fill: "forwards" }, callback);
  }

  /** Animates border radius from one value to another (e.g. "50%" to "16px"). */
  MorphShape(
    radius1: string | number,
    radius2: string | number,
    durationMs = 300,
    callback?: () => void,
  ) {
    const r1 = typeof radius1 === "number" ? `${radius1}px` : radius1;
    const r2 = typeof radius2 === "number" ? `${radius2}px` : radius2;
    this.element.style.borderRadius = r2;
    return this.Animate(
      [{ borderRadius: r1 }, { borderRadius: r2 }],
      { duration: durationMs, fill: "forwards", easing: "cubic-bezier(0.2, 0, 0, 1)" },
      callback,
    );
  }

  /** Calls multiple setter methods at once from a { MethodName: [args] } map. */
  Batch(properties: Record<string, unknown[]>, isMorph = false) {
    for (const [method, args] of Object.entries(properties)) {
      // deno-lint-ignore no-explicit-any
      const fn = (this as any)[method];
      if (typeof fn === "function") {
        if (isMorph && method === "SetVisibility") {
           fn.apply(this, [...args, true]);
        } else {
           fn.apply(this, args);
        }
      }
    }
    return this;
  }

  Morph<T extends BaseElement>(this: T, config: MorphConfig<T>): T {
    ensureMorphBind();

    let entry = [..._morphRegistry].find(e => e.el === this as unknown as BaseElement) as MorphEntry | undefined;
    if (!entry) {
      entry = {
        el: this as unknown as BaseElement,
        config: {},
        resolve: () => {},
      };
      entry.resolve = () => applyMorphResolution(this as unknown as BaseElement, entry!.config);
      _morphRegistry.add(entry);
      this.RegisterCleanup(() => _morphRegistry.delete(entry!));
    }

    for (const key of Object.keys(config) as WindowSizeClassKey[]) {
      entry.config[key] = { ...(entry.config[key] as object ?? {}), ...(config[key] as object) };
    }

    entry.resolve();
    return this;
  }
}
