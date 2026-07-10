import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { TopAppBarVariant } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const HEIGHT_COMPACT = 64;
const HEIGHT_MEDIUM_EXPANDED = 112;
const HEIGHT_LARGE_EXPANDED = 152;

const barSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--md-surface)",
    color: "var(--md-on-surface)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    boxSizing: "border-box",
    position: "sticky",
    top: "0",
    zIndex: 10,
    overflow: "hidden",
    transition: "height 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.15s ease, background-color 0.15s ease",
  },
});

const topRowSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    padding: "0 4px",
    height: `${HEIGHT_COMPACT}px`,
    flexShrink: "0",
  },
});

const titleSva = sva({
  base: {
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    transition: "font-size 0.15s ease, padding 0.15s ease, opacity 0.1s ease",
  },
  variants: {
    variant: {
      small: {
        fontSize: "1.375rem",
        textAlign: "left",
        paddingLeft: "4px",
      },
      "center-aligned": {
        fontSize: "1.375rem",
        textAlign: "center",
        paddingLeft: "0",
      },
      medium: {
        textAlign: "left",
        opacity: "0",
      },
      large: {
        textAlign: "left",
        opacity: "0",
      },
    },
  },
});

const expandedTitleSva = sva({
  base: {
    padding: "0 16px 24px 16px",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    transition: "font-size 0.15s ease, opacity 0.15s ease",
  },
  variants: {
    variant: {
      medium: { fontSize: "1.75rem" },
      large: { fontSize: "2rem" },
    },
  },
});

const navContainerSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    width: "48px",
    justifyContent: "center",
  },
});

const actionsContainerSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

const appIconSva = sva({
  base: {
    cursor: "pointer",
    fontSize: "24px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

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

    this.element.className = "m3-top-app-bar " + barSva();
    this.element.style.height = `${this._expandedHeight}px`;

    const topRow = document.createElement("div");
    topRow.className = topRowSva();

    this._navigationIconContainer = document.createElement("div");
    this._navigationIconContainer.className = navContainerSva();

    this._titleEl = document.createElement("span");
    this._titleEl.className = titleSva({ variant });
    this._titleEl.textContent = title;

    this._actionsContainer = document.createElement("div");
    this._actionsContainer.className = actionsContainerSva();

    topRow.appendChild(this._navigationIconContainer);
    topRow.appendChild(this._titleEl);
    topRow.appendChild(this._actionsContainer);
    this.element.appendChild(topRow);

    this.applyVariant(variant);
  }

  private applyVariant(variant: TopAppBarVariant): void {
    if (variant === "medium" || variant === "large") {
      const expandedTitle = document.createElement("span");
      expandedTitle.className = expandedTitleSva({ variant });
      expandedTitle.textContent = this._titleEl.textContent;
      expandedTitle.dataset.role = "expanded-title";
      this.element.appendChild(expandedTitle);
    }
  }

  private updateScrollState(): void {
    if (!this._scrollTarget) return;
    const scrollTop = this._scrollTarget.scrollTop;

    if (this._variant === "medium" || this._variant === "large") {
      const collapseRange = this._expandedHeight - HEIGHT_COMPACT;
      const progress = Math.min(1, Math.max(0, scrollTop / collapseRange));
      const currentHeight = this._expandedHeight - collapseRange * progress;
      this.element.style.height = `${currentHeight}px`;

      const expandedTitle = this.element.querySelector<HTMLSpanElement>(
        '[data-role="expanded-title"]',
      );
      if (expandedTitle) {
        expandedTitle.style.opacity = `${1 - progress}`;
      }
      this._titleEl.style.opacity = `${progress}`;

      this.element.style.boxShadow =
        progress > 0.05
          ? "0 3px 6px rgba(0,0,0,0.15)"
          : "none";
    } else {
      this.element.style.boxShadow =
        scrollTop > 0
          ? "0 3px 6px rgba(0,0,0,0.15)"
          : "none";
    }
  }

  AttachScrollable(target: HTMLElement): this {
    if (this._scrollTarget) {
      this._scrollTarget.removeEventListener("scroll", this._onScroll);
    }
    this._scrollTarget = target;
    target.addEventListener("scroll", this._onScroll);
    this.updateScrollState();
    return this;
  }

  SetNavigationIcon(iconBtn: BaseElement): this {
    this._navigationIconContainer.innerHTML = "";
    this._navigationIconContainer.appendChild(iconBtn.element);
    return this;
  }

  AddAction(iconBtn: BaseElement): this {
    this._actionsContainer.appendChild(iconBtn.element);
    return this;
  }

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

function CreateTopAppBar(
  title: string,
  variant: TopAppBarVariant = "small",
): TopAppBar {
  return new TopAppBar(title, variant);
}

/**
 * AddTopAppBar function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} title - The title parameter
 * @param {TopAppBarVariant} variant - The variant parameter
 * @returns {TopAppBar}
 *
 */
export function AddTopAppBar(
  parent: LayoutElement,
  title: string,
  variant: TopAppBarVariant = "small",
): TopAppBar {
  const bar = CreateTopAppBar(title, variant);
  parent.AddChild(bar);
  return bar;
}

function CreateAppBarIcon(
  iconName: string,
  onClick?: () => void,
): BaseElement {
  const icon = new BaseElement("span");
  icon.element.className = "material-icons " + appIconSva();
  icon.element.textContent = iconName;
  if (onClick) icon.element.addEventListener("click", onClick);
  return icon;
}
