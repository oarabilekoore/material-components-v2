import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { TopAppBarVariant, currentTheme } from "../theme.ts";

const HEIGHT_COMPACT = 64; // small, center-aligned, and the collapsed state of medium/large
const HEIGHT_MEDIUM_EXPANDED = 112;
const HEIGHT_LARGE_EXPANDED = 152;

export class TopAppBar extends BaseElement {
  private _titleEl: HTMLSpanElement;
  private _navigationIconContainer: HTMLDivElement;
  private _actionsContainer: HTMLDivElement;
  private _variant: TopAppBarVariant;
  private _expandedHeight: number;
  private _scrollTarget: HTMLElement | null = null;
  private _onScroll = () => this.updateScrollState();

  constructor(title: string, variant: TopAppBarVariant = "small") {
    super("header");
    this._variant = variant;
    this._expandedHeight =
      variant === "medium"
        ? HEIGHT_MEDIUM_EXPANDED
        : variant === "large"
          ? HEIGHT_LARGE_EXPANDED
          : HEIGHT_COMPACT;

    this.element.className = "m3-top-app-bar";
    this.element.style.display = "flex";
    this.element.style.flexDirection = "column";
    this.element.style.backgroundColor = currentTheme.surface;
    this.element.style.color = currentTheme.onSurface;
    this.element.style.fontFamily = currentTheme.fontFamily;
    this.element.style.boxSizing = "border-box";
    this.element.style.position = "sticky";
    this.element.style.top = "0";
    this.element.style.zIndex = "10";
    this.element.style.overflow = "hidden";
    this.element.style.transition =
      "height 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.15s ease, background-color 0.15s ease";

    const topRow = document.createElement("div");
    topRow.style.display = "flex";
    topRow.style.alignItems = "center";
    topRow.style.padding = "0 4px";
    topRow.style.height = `${HEIGHT_COMPACT}px`;
    topRow.style.flexShrink = "0";

    this._navigationIconContainer = document.createElement("div");
    this._navigationIconContainer.style.display = "flex";
    this._navigationIconContainer.style.alignItems = "center";
    this._navigationIconContainer.style.width = "48px";
    this._navigationIconContainer.style.justifyContent = "center";

    this._titleEl = document.createElement("span");
    this._titleEl.textContent = title;
    this._titleEl.style.flex = "1";
    this._titleEl.style.overflow = "hidden";
    this._titleEl.style.textOverflow = "ellipsis";
    this._titleEl.style.whiteSpace = "nowrap";
    this._titleEl.style.transition = "font-size 0.15s ease, padding 0.15s ease";

    this._actionsContainer = document.createElement("div");
    this._actionsContainer.style.display = "flex";
    this._actionsContainer.style.alignItems = "center";
    this._actionsContainer.style.justifyContent = "flex-end";

    topRow.appendChild(this._navigationIconContainer);
    topRow.appendChild(this._titleEl);
    topRow.appendChild(this._actionsContainer);
    this.element.appendChild(topRow);

    this.applyVariant(variant);
  }

  private applyVariant(variant: TopAppBarVariant): void {
    this.element.style.height = `${this._expandedHeight}px`;

    switch (variant) {
      case "small":
        this._titleEl.style.fontSize = "1.375rem";
        this._titleEl.style.textAlign = "left";
        this._titleEl.style.paddingLeft = "4px";
        break;

      case "center-aligned":
        this._titleEl.style.fontSize = "1.375rem";
        this._titleEl.style.textAlign = "center";
        this._titleEl.style.paddingLeft = "0";
        break;

      case "medium":
      case "large": {
        // expanded-state title sits below the icon row, per spec, left-aligned, larger type
        this._titleEl.style.textAlign = "left";
        const expandedTitle = document.createElement("span");
        expandedTitle.textContent = this._titleEl.textContent;
        expandedTitle.style.fontSize =
          variant === "medium" ? "1.75rem" : "2rem";
        expandedTitle.style.padding = "0 16px 24px 16px";
        expandedTitle.style.display = "block";
        expandedTitle.style.overflow = "hidden";
        expandedTitle.style.textOverflow = "ellipsis";
        expandedTitle.style.whiteSpace = "nowrap";
        expandedTitle.style.transition =
          "font-size 0.15s ease, opacity 0.15s ease";
        expandedTitle.dataset.role = "expanded-title";
        this.element.appendChild(expandedTitle);

        this._titleEl.style.opacity = "0"; // top-row title is invisible until collapsed
        this._titleEl.style.transition = "opacity 0.1s ease";
        break;
      }
    }
  }

  /** Recomputes height/title state based on the scroll target's current offset. */
  private updateScrollState(): void {
    if (!this._scrollTarget) return;
    const scrollTop = this._scrollTarget.scrollTop;

    if (this._variant === "medium" || this._variant === "large") {
      const collapseRange = this._expandedHeight - HEIGHT_COMPACT;
      const progress = Math.min(1, Math.max(0, scrollTop / collapseRange)); // 0 = expanded, 1 = fully collapsed
      const currentHeight = this._expandedHeight - collapseRange * progress;
      this.element.style.height = `${currentHeight}px`;

      const expandedTitle = this.element.querySelector<HTMLSpanElement>(
        '[data-role="expanded-title"]',
      );
      if (expandedTitle) {
        expandedTitle.style.opacity = `${1 - progress}`;
      }
      this._titleEl.style.opacity = `${progress}`; // top-row title fades in as it collapses

      this.element.style.boxShadow =
        progress > 0.05
          ? `0 ${currentTheme.elevationLevel2}px ${currentTheme.elevationLevel3}px rgba(0,0,0,0.15)`
          : "none";
    } else {
      // small / center-aligned: fixed height, but still gain elevation once content scrolls under them
      this.element.style.boxShadow =
        scrollTop > 0
          ? `0 ${currentTheme.elevationLevel2}px ${currentTheme.elevationLevel3}px rgba(0,0,0,0.15)`
          : "none";
    }
  }

  /** Wires this app bar's collapse/elevation behavior to a scrollable container's scroll events. */
  AttachScrollable(target: HTMLElement): this {
    if (this._scrollTarget) {
      this._scrollTarget.removeEventListener("scroll", this._onScroll);
    }
    this._scrollTarget = target;
    target.addEventListener("scroll", this._onScroll);
    this.updateScrollState();
    return this;
  }

  /** Sets the navigation icon (typically a menu or back IconButton). */
  SetNavigationIcon(iconBtn: BaseElement): this {
    this._navigationIconContainer.innerHTML = "";
    this._navigationIconContainer.appendChild(iconBtn.element);
    return this;
  }

  /** Adds an action icon to the trailing end of the app bar. */
  AddAction(iconBtn: BaseElement): this {
    this._actionsContainer.appendChild(iconBtn.element);
    return this;
  }

  /** Updates the title text in both the compact row and (if present) the expanded headline. */
  SetTitle(title: string): this {
    this._titleEl.textContent = title;
    const expandedTitle = this.element.querySelector<HTMLSpanElement>(
      '[data-role="expanded-title"]',
    );
    if (expandedTitle) expandedTitle.textContent = title;
    return this;
  }

  override GetType(): string {
    return "TopAppBar";
  }
}

export function CreateTopAppBar(
  title: string,
  variant: TopAppBarVariant = "small",
): TopAppBar {
  return new TopAppBar(title, variant);
}

export function AddTopAppBar(
  parent: LayoutElement,
  title: string,
  variant: TopAppBarVariant = "small",
): TopAppBar {
  const bar = CreateTopAppBar(title, variant);
  parent.AddChild(bar);
  return bar;
}

/** Creates a standard icon-only span for use as a navigation or action icon, following the material-icons font convention. */
export function CreateAppBarIcon(
  iconName: string,
  onClick?: () => void,
): BaseElement {
  const icon = new BaseElement("span");
  icon.element.className = "material-icons";
  icon.element.textContent = iconName;
  icon.element.style.cursor = "pointer";
  icon.element.style.fontSize = "24px";
  icon.element.style.width = "24px";
  icon.element.style.height = "24px";
  icon.element.style.display = "flex";
  icon.element.style.alignItems = "center";
  icon.element.style.justifyContent = "center";
  if (onClick) icon.element.addEventListener("click", onClick);
  return icon;
}
