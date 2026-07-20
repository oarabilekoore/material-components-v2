import type { RouteParams } from "../router/router.ts";
import { ensureAnchorIntercept, getHashPathname, matchPathPrefix } from "../router/router.ts";
import { BaseElement } from "./BaseElement.ts";

const _autoBindStack: LayoutElement[] = [];

export function currentAutoBindTarget(): LayoutElement | undefined {
  return _autoBindStack[_autoBindStack.length - 1];
}

export function EndAutoBind(): void {
  _autoBindStack.pop();
}


export type LayoutType = "Linear" | "Absolute" | "Frame" | "Card";
export type Orientation = "Horizontal" | "Vertical";

export class LayoutElement extends BaseElement {
  private children: BaseElement[] = [];
  private layoutType: LayoutType;

  private parentLayout?: LayoutElement;
  private routePath?: string;
  private routeParams: RouteParams = {};
  private onRouteParamsCallback?: (params: RouteParams) => void;

  private isOutlet = false;
  private routedChildren: LayoutElement[] = [];

  constructor(type: LayoutType = "Linear") {
    super("div");
    this.layoutType = type;
    this.applyLayoutType(type);
  }

  private applyLayoutType(type: LayoutType) {
    const s = this.element.style;

    switch (type) {
      case "Linear":
        s.display = "flex";
        s.flexDirection = "column";
        // default gravity per spec: "Top,Center"
        s.justifyContent = "flex-start"; // Top (main axis, column)
        s.alignItems = "center"; // Center (cross axis, column)
        s.position = "static";
        break;

      case "Absolute":
        s.display = "block";
        s.position = "relative";
        break;

      case "Frame":
        s.display = "block";
        s.position = "relative";
        break;

      case "Card":
        s.display = "block";
        s.position = "relative";
        s.borderRadius = "8px";
        s.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        s.overflow = "hidden";
        break;
    }
  }

  /** Returns the control class name. */
  override GetType(): string {
    return "Layout";
  }

  // ---------- Children ----------

  _internalMount(child: BaseElement, order?: number) {
    if (this.layoutType === "Frame" || this.layoutType === "Card") {
      child.element.style.position = "absolute";
      child.element.style.top = "0";
      child.element.style.left = "0";
      child.element.style.zIndex = `${this.children.length}`;
    }

    if (order !== undefined && order < this.children.length) {
      const ref = this.children[order];
      this.element.insertBefore(child.element, ref.element);
      this.children.splice(order, 0, child);
    } else {
      this.element.appendChild(child.element);
      this.children.push(child);
    }

    if (child instanceof LayoutElement) {
      child.parentLayout = this;
      if (this.isOutlet && child.routePath !== undefined) {
        this.registerRoutedChild(child);
        this.updateOutlet();
      }
    }

    return this;
  }

  RemoveChild(child: BaseElement) {
    const idx = this.children.indexOf(child);
    if (idx === -1) return this;
    if (child.element.parentElement === this.element) {
      this.element.removeChild(child.element);
    }
    this.children.splice(idx, 1);
    return this;
  }

  DestroyChild(child: BaseElement) {
    this.RemoveChild(child);
    child.Dispose();
    return this;
  }

  ChildToFront(child: BaseElement) {
    this.element.appendChild(child.element);
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      this.children.push(child);
    }
    if (this.layoutType === "Frame" || this.layoutType === "Card") {
      this.children.forEach((c, i) => {
        c.element.style.zIndex = `${i}`;
      });
    }
    return this;
  }

  Clear() {
    this.children.forEach(c => c.Dispose());
    this.children = [];
    return this;
  }

  override Dispose() {
    this.Clear();
    super.Dispose();
  }

  GetChildOrder(child: BaseElement): number {
    return this.children.indexOf(child);
  }

  // ---------- Orientation / Gravity ----------

  SetOrientation(orient: Orientation) {
    this.element.style.flexDirection =
      orient === "Horizontal" ? "row" : "column";
    return this;
  }

  SetGravity(gravity: string) {
    const opts = gravity.split(",").map((g) => g.trim());
    const isRow = this.element.style.flexDirection === "row";

    for (const opt of opts) {
      switch (opt) {
        case "Center":
          this.element.style.justifyContent = "center";
          this.element.style.alignItems = "center";
          break;
        case "HCenter":
          if (isRow) this.element.style.justifyContent = "center";
          else this.element.style.alignItems = "center";
          break;
        case "VCenter":
          if (isRow) this.element.style.alignItems = "center";
          else this.element.style.justifyContent = "center";
          break;
        case "Left":
          if (isRow) this.element.style.justifyContent = "flex-start";
          else this.element.style.alignItems = "flex-start";
          break;
        case "Right":
          if (isRow) this.element.style.justifyContent = "flex-end";
          else this.element.style.alignItems = "flex-end";
          break;
        case "Top":
          if (isRow) this.element.style.alignItems = "flex-start";
          else this.element.style.justifyContent = "flex-start";
          break;
        case "Bottom":
          if (isRow) this.element.style.alignItems = "flex-end";
          else this.element.style.justifyContent = "flex-end";
          break;
      }
    }
    return this;
  }

  /** Enables flex-wrap for children that overflow the layout's main axis. */
  SetWrap(wrap: boolean) {
    this.element.style.flexWrap = wrap ? "wrap" : "nowrap";
    return this;
  }

  // ---------- Routing ----------

  AddRoute(path: string = "/"): this {
    this.routePath = path;
    // Retroactive: if already mounted in an Outlet parent, self-register now.
    if (this.parentLayout?.isOutlet) {
      this.parentLayout.registerRoutedChild(this);
      this.parentLayout.updateOutlet();
    }
    return this;
  }

  GetRouteParams(): RouteParams {
    return this.routeParams;
  }

  SetOnRouteParams(callback: (params: RouteParams) => void): this {
    this.onRouteParamsCallback = callback;
    return this;
  }

  /** Walks up through routed ancestors, consuming each one's matched prefix, to find the pathname this layout's own Outlet should resolve against. */
  private getLocalPathname(): string {
    const chain: LayoutElement[] = [];
    let cur = this.parentLayout;
    while (cur) {
      if (cur.routePath !== undefined) chain.unshift(cur);
      cur = cur.parentLayout;
    }
    let pathname = getHashPathname();
    for (const ancestor of chain) {
      const match = matchPathPrefix(ancestor.routePath!, pathname);
      if (!match) return "\0"; // sentinel: an ancestor no longer matches, nothing under it should show
      pathname = match.remainder;
    }
    return pathname;
  }

  // ---------- Routing: outlet behavior on the parent ----------

  private registerRoutedChild(child: LayoutElement) {
    if (this.routedChildren.includes(child)) return;
    this.routedChildren.push(child);
    child._visibility.Vote("route", false);
  }

  private updateOutlet() {
    const pathname = this.getLocalPathname();
    for (const child of this.routedChildren) {
      const match = pathname === "\0" ? null : matchPathPrefix(child.routePath!, pathname);
      // Leaf children must fully consume the path; branch (Outlet) children may leave a remainder.
      const isValid = match && (child.isOutlet || match.remainder === "/");
      if (isValid) {
        child._visibility.Vote("route", true);
        child.routeParams = match!.params;
        child.onRouteParamsCallback?.(match!.params);
      } else {
        child._visibility.Vote("route", false);
      }
      if (child.isOutlet) child.updateOutlet(); // cascade so nested Outlets re-resolve too
    }
  }

  // ---------- Options string (from CreateLayout's options param) ----------

  private applyOptions(options?: string) {
    if (!options) return;
    const opts = options.split(",").map((o) => o.trim());

    if (opts.includes("Outlet")) {
      this.isOutlet = true;
      ensureAnchorIntercept();
      if (typeof globalThis !== "undefined" && globalThis.addEventListener) {
        globalThis.addEventListener("hashchange", () => this.updateOutlet());
      }
    }

    if (opts.includes("FillX") || opts.includes("FillXY"))
      this.element.style.width = "100%";
    if (opts.includes("FillY") || opts.includes("FillXY"))
      this.element.style.height = "100%";
    if (opts.includes("Wrap")) this.SetWrap(true);
    if (opts.includes("Horizontal")) this.SetOrientation("Horizontal");
    if (opts.includes("Vertical")) this.SetOrientation("Vertical");
    if (opts.includes("TouchThrough")) this.SetTouchThrough(true);

    const gravityTokens = opts.filter((o) =>
      [
        "Left",
        "Right",
        "Top",
        "Bottom",
        "Center",
        "HCenter",
        "VCenter",
      ].includes(o),
    );
    if (gravityTokens.length) this.SetGravity(gravityTokens.join(","));

    // Theme reactivity
    if (opts.includes("Surface")) this.element.style.backgroundColor = "var(--md-surface)";
    else if (opts.includes("SurfaceContainer")) this.element.style.backgroundColor = "var(--md-surface-container)";
    else if (opts.includes("SurfaceContainerLow")) this.element.style.backgroundColor = "var(--md-surface-container-low)";
    else if (opts.includes("SurfaceContainerHigh")) this.element.style.backgroundColor = "var(--md-surface-container-high)";
    else if (opts.includes("SurfaceVariant")) this.element.style.backgroundColor = "var(--md-surface-variant)";
  }

  // ---------- Card-specific ----------

  SetCornerRadius(radius: number) {
    this.element.style.borderRadius = `${radius}px`;
    return this;
  }

  SetElevation(elevation: number) {
    const blur = elevation * 2;
    const spread = elevation * 0.5;
    this.element.style.boxShadow = `0 ${elevation}px ${blur}px ${spread}px rgba(0,0,0,0.3)`;
    return this;
  }

  // ---------- Child-wide helpers ----------

  SetChildMargins(left = 0, top = 0, right = 0, bottom = 0, mode = "px") {
    if (this.children.length === 0) {
      console.warn("SetChildMargins called but layout has no children. If using Morph(), ensure children are added before morphing this property.");
    }
    const u = mode === "px" ? "px" : mode;
    for (const child of this.children) {
      child.element.style.marginLeft = `${left}${u}`;
      child.element.style.marginTop = `${top}${u}`;
      child.element.style.marginRight = `${right}${u}`;
      child.element.style.marginBottom = `${bottom}${u}`;
    }
    return this;
  }

  SetChildTextSize(size: number, mode = "px") {
    if (this.children.length === 0) {
      console.warn("SetChildTextSize called but layout has no children. If using Morph(), ensure children are added before morphing this property.");
    }
    for (const child of this.children) {
      child.element.style.fontSize = `${size}${mode}`;
    }
    return this;
  }

  /**
   * Recalculates child layout after a container resize.
   * On the web, percentage-based sizing already responds to resize
   * automatically, so this just forces a reflow for edge cases
   * (e.g. canvas-based children) that don't recompute on their own.
   */
  Resize() {
    void this.element.offsetHeight;
    return this;
  }

  // ---------- Touch passthrough ----------

  SetTouchable(touchable: boolean) {
    this.element.style.pointerEvents = touchable ? "auto" : "none";
    return this;
  }

  SetTouchThrough(through: boolean) {
    this.element.style.pointerEvents = through ? "none" : "auto";
    return this;
  }

  SetOnTouchDown(callback: (e: MouseEvent) => void) {
    this.element.addEventListener("mousedown", callback);
    return this;
  }

  SetOnTouchMove(callback: (e: MouseEvent) => void) {
    this.element.addEventListener("mousemove", callback);
    return this;
  }

  SetOnTouchUp(callback: (e: MouseEvent) => void) {
    this.element.addEventListener("mouseup", callback);
    return this;
  }

  SetOnChildChange(callback: (e: Event) => void) {
    this.element.addEventListener("change", callback);
    return this;
  }

  static withOptions(layout: LayoutElement, options?: string, route?: string): LayoutElement {
    layout["applyOptions"](options);
    route ? layout.AddRoute(route) : null
    return layout;
  }
}

/** Creates a Layout container. */
export function Layout(
  type: LayoutType = "Linear",
  options?: string, route?: string,
  bindOptions?: { into?: LayoutElement; mountTarget?: HTMLElement },
): LayoutElement {
  const layout = new LayoutElement(type);
  LayoutElement.withOptions(layout, options, route);

  const parent = bindOptions?.into ?? currentAutoBindTarget();
  if (parent) {
    parent._internalMount(layout);
  } else {
    (bindOptions?.mountTarget ?? document.body).appendChild(layout.element);
  }

  _autoBindStack.push(layout);
  return layout;
}

