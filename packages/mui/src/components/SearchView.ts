import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { SearchBar } from "./SearchBar.ts";
import { Icon, Icons } from "../icons/Icon.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const searchViewSva = sva({
  base: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "var(--md-surface)",
    zIndex: 3000,
    display: "flex",
    flexDirection: "column",
    transform: "translateY(100%)",
    opacity: "0",
    transition: "transform 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s cubic-bezier(0.2, 0, 0, 1)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

const headerSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    gap: "16px",
    borderBottom: "1px solid var(--md-outline-variant)",
  },
});

const backBtnSva = sva({
  base: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--md-on-surface)",
    padding: "8px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "var(--md-surface-variant)",
    }
  },
});

const contentSva = sva({
  base: {
    flex: "1",
    overflowY: "auto",
    padding: "0",
  },
});

export class SearchView extends BaseElement {
  private _searchBar: SearchBar;
  private _contentEl: HTMLDivElement;
  private _isOpen = false;

  constructor() {
    super("div");
    this.element.className = "m3-search-view " + searchViewSva();

    const header = document.createElement("div");
    header.className = headerSva();

    const backBtn = document.createElement("button");
    backBtn.className = backBtnSva();
    const backIcon = new Icon("arrow_back");
    backBtn.appendChild(backIcon.element);
    backBtn.addEventListener("click", () => this.Close());
    header.appendChild(backBtn);

    this._searchBar = new SearchBar("Search...", "filled");
    this._searchBar.element.style.flex = "1";
    this._searchBar.element.style.boxShadow = "none";
    this._searchBar.element.style.backgroundColor = "transparent";
    header.appendChild(this._searchBar.element);

    this.element.appendChild(header);

    this._contentEl = document.createElement("div");
    this._contentEl.className = contentSva();
    this.element.appendChild(this._contentEl);
  }

  Open(): this {
    if (this._isOpen) return this;
    this._isOpen = true;
    if (!this.element.parentNode) {
      document.body.appendChild(this.element);
    }
    // trigger layout
    void this.element.offsetHeight;
    this.element.style.transform = "translateY(0)";
    this.element.style.opacity = "1";
    return this;
  }

  Close(): this {
    if (!this._isOpen) return this;
    this._isOpen = false;
    this.element.style.transform = "translateY(100%)";
    this.element.style.opacity = "0";
    setTimeout(() => {
      if (this.element.parentNode) {
        this.element.remove();
      }
    }, 300);
    return this;
  }

  GetSearchBar(): SearchBar {
    return this._searchBar;
  }

  AddChild(child: BaseElement): this {
    this._contentEl.appendChild(child.element);
    return this;
  }

  override GetType(): string {
    return "SearchView";
  }
}

export function CreateSearchView(): SearchView {
  return new SearchView();
}
