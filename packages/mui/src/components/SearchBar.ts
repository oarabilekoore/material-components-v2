import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";

const containerSva = sva({
  base: {
    position: "relative",
    width: "100%",
    maxWidth: "720px",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

const barSva = sva({
  base: {
    height: "56px",
    backgroundColor: "var(--md-surface-container-high, var(--md-surface))",
    borderRadius: "28px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "0 16px",
    gap: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.15)", // elevation level 1
    boxSizing: "border-box",
    transition: "box-shadow 0.2s ease, background-color 0.2s ease",
  },
  variants: {
    focused: {
      true: {
        boxShadow: "0 3px 6px rgba(0,0,0,0.20)", // elevation level 3
        backgroundColor: "var(--md-surface-container, var(--md-surface))",
      },
      false: {}
    }
  }
});

const inputSva = sva({
  base: {
    flex: "1",
    background: "transparent",
    border: "none",
    fontSize: "16px",
    color: "var(--md-on-surface)",
    outline: "none",
    fontFamily: "inherit",
  },
});

const popupSva = sva({
  base: {
    position: "absolute",
    top: "60px",
    left: "0",
    right: "0",
    backgroundColor: "var(--md-surface-container-high)",
    borderRadius: "16px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    padding: "8px 0",
    display: "none",
    zIndex: 10,
    maxHeight: "280px",
    overflowY: "auto",
  },
});

const suggestionItemSva = sva({
  base: {
    padding: "12px 16px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    color: "var(--md-on-surface)",
    fontSize: "14px",
    transition: "background-color 0.1s ease",
  },
});

export class SearchBar extends BaseElement {
  private inputEl: HTMLInputElement;
  private popupEl: HTMLDivElement;
  private barEl: HTMLDivElement;
  private searchIconEl: HTMLSpanElement;
  private clearIconEl: HTMLSpanElement;
  private suggestions: string[] = [];
  private onSearchCallback: ((query: string) => void) | null = null;

  constructor(placeholder = "Search...") {
    super("div");
    this.element.className = containerSva();

    this.barEl = document.createElement("div");
    this.barEl.className = barSva({ focused: false });

    this.searchIconEl = document.createElement("span");
    this.searchIconEl.className = "material-icons";
    this.searchIconEl.textContent = "search";
    this.searchIconEl.style.color = "var(--md-on-surface-variant)";
    this.barEl.appendChild(this.searchIconEl);

    this.inputEl = document.createElement("input");
    this.inputEl.className = inputSva();
    this.inputEl.placeholder = placeholder;
    this.inputEl.type = "text";
    this.barEl.appendChild(this.inputEl);

    this.clearIconEl = document.createElement("span");
    this.clearIconEl.className = "material-icons";
    this.clearIconEl.textContent = "close";
    this.clearIconEl.style.color = "var(--md-on-surface-variant)";
    this.clearIconEl.style.cursor = "pointer";
    this.clearIconEl.style.display = "none";
    this.clearIconEl.style.padding = "4px";
    this.clearIconEl.style.borderRadius = "50%";
    
    this.clearIconEl.addEventListener("click", () => {
      this.inputEl.value = "";
      this.clearIconEl.style.display = "none";
      this.hideSuggestions();
      this.notifySearch("");
      this.inputEl.focus();
    });
    this.barEl.appendChild(this.clearIconEl);

    this.element.appendChild(this.barEl);

    this.popupEl = document.createElement("div");
    this.popupEl.className = popupSva();
    this.element.appendChild(this.popupEl);

    this.inputEl.addEventListener("input", () => {
      this.clearIconEl.style.display = this.inputEl.value ? "block" : "none";
      this.filterSuggestions();
    });

    this.inputEl.addEventListener("focus", () => {
      this.barEl.className = barSva({ focused: true });
      if (this.suggestions.length > 0 && this.inputEl.value) {
        this.filterSuggestions();
      }
    });

    this.inputEl.addEventListener("blur", () => {
      this.barEl.className = barSva({ focused: false });
    });

    if (typeof document !== "undefined") {
      document.addEventListener("click", (e) => {
        if (!this.element.contains(e.target as Node)) {
          this.hideSuggestions();
        }
      });
    }
  }

  SetSuggestions(list: string[]): this {
    this.suggestions = list;
    return this;
  }

  private filterSuggestions() {
    const val = this.inputEl.value.toLowerCase();
    if (!val) {
      this.hideSuggestions();
      return;
    }
    const filtered = this.suggestions.filter(s => s.toLowerCase().includes(val));
    if (filtered.length > 0) {
      this.popupEl.innerHTML = "";
      filtered.forEach(s => {
        const item = document.createElement("div");
        item.className = suggestionItemSva();
        
        const historyIcon = document.createElement("span");
        historyIcon.className = "material-icons";
        historyIcon.textContent = "history";
        historyIcon.style.color = "var(--md-on-surface-variant)";
        item.appendChild(historyIcon);

        const txt = document.createElement("span");
        txt.textContent = s;
        item.appendChild(txt);

        item.addEventListener("click", () => {
          this.inputEl.value = s;
          this.clearIconEl.style.display = "block";
          this.hideSuggestions();
          this.notifySearch(s);
        });

        item.addEventListener("mouseenter", () => {
          item.style.backgroundColor = "var(--md-surface-variant)";
        });
        item.addEventListener("mouseleave", () => {
          item.style.backgroundColor = "transparent";
        });

        attachRipple(item);
        this.popupEl.appendChild(item);
      });
      this.popupEl.style.display = "block";
    } else {
      this.hideSuggestions();
    }
  }

  private hideSuggestions() {
    this.popupEl.style.display = "none";
  }

  private notifySearch(query: string) {
    if (this.onSearchCallback) {
      this.onSearchCallback(query);
    }
  }

  SetOnSearch(callback: (query: string) => void): this {
    this.onSearchCallback = callback;
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.hideSuggestions();
        callback(this.inputEl.value);
      }
    });
    return this;
  }

  override GetType(): string {
    return "SearchBar";
  }
}

function CreateSearchBar(placeholder = "Search..."): SearchBar {
  return new SearchBar(placeholder);
}

/**
 * AddSearchBar function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {any} placeholder - The placeholder parameter
 * @returns {SearchBar}
 *
 */
export function AddSearchBar(parent: LayoutElement, placeholder = "Search..."): SearchBar {
  const bar = CreateSearchBar(placeholder);
  parent.AddChild(bar);
  return bar;
}
