import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const menuSva = sva({
  base: {
    position: "fixed",
    right: "16px",
    bottom: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
    zIndex: 1500,
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

const containerSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
});

const toggleBtnSva = sva({
  base: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    backgroundColor: "var(--md-primary-container)",
    color: "var(--md-on-primary-container)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
    transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s ease",
    alignSelf: "flex-end",
    outline: "none",
  },
});

const toggleIconSva = sva({
  base: {
    fontSize: "24px",
    transition: "transform 0.2s ease",
  },
});

const rowSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: "0",
    transform: "translateY(8px)",
    pointerEvents: "none",
    transition: "opacity 0.15s ease, transform 0.15s ease",
  },
});

const chipSva = sva({
  base: {
    backgroundColor: "var(--md-surface-container, var(--md-surface))",
    color: "var(--md-on-surface)",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
  },
});

const itemBtnSva = sva({
  base: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    backgroundColor: "var(--md-secondary-container)",
    color: "var(--md-on-secondary-container)",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    outline: "none",
  },
});

interface FabMenuItem {
  icon: string;
  label: string;
  callback: () => void;
  row: HTMLDivElement;
}

export class FabMenu extends BaseElement {
  private toggleBtn: HTMLButtonElement;
  private toggleIcon: HTMLSpanElement;
  private itemsContainer: HTMLDivElement;
  private items: FabMenuItem[] = [];
  private _isOpen = false;
  private openIcon: string;
  private closeIcon: string;

  constructor(openIcon = "add", closeIcon = "close") {
    super("div");
    this.openIcon = openIcon;
    this.closeIcon = closeIcon;

    this.element.className = "m3-fab-menu " + menuSva();

    this.itemsContainer = document.createElement("div");
    this.itemsContainer.className = containerSva();

    this.toggleBtn = document.createElement("button");
    this.toggleBtn.className = toggleBtnSva();

    this.toggleIcon = document.createElement("span");
    this.toggleIcon.className = "material-icons " + toggleIconSva();
    this.toggleIcon.textContent = openIcon;
    this.toggleBtn.appendChild(this.toggleIcon);

    this.toggleBtn.addEventListener("click", () => this.Toggle());

    this.element.appendChild(this.itemsContainer);
    this.element.appendChild(this.toggleBtn);

    if (typeof document !== "undefined") {
      document.body.appendChild(this.element);
    }
  }

  AddItem(icon: string, label: string, callback: () => void): this {
    const row = document.createElement("div");
    row.className = rowSva();

    const labelChip = document.createElement("span");
    labelChip.className = chipSva();
    labelChip.textContent = label;

    const iconBtn = document.createElement("button");
    iconBtn.className = itemBtnSva();

    const iconSpan = document.createElement("span");
    iconSpan.className = "material-icons";
    iconSpan.textContent = icon;
    iconSpan.style.fontSize = "20px";
    iconBtn.appendChild(iconSpan);

    iconBtn.addEventListener("click", () => {
      callback();
      this.Close();
    });

    row.appendChild(labelChip);
    row.appendChild(iconBtn);
    this.itemsContainer.appendChild(row);

    this.items.push({ icon, label, callback, row });
    return this;
  }

  Open(): this {
    this._isOpen = true;
    this.toggleIcon.textContent = this.closeIcon;
    this.toggleBtn.style.transform = "rotate(135deg)";
    this.items.forEach((item, i) => {
      setTimeout(() => {
        item.row.style.opacity = "1";
        item.row.style.transform = "translateY(0)";
        item.row.style.pointerEvents = "auto";
      }, i * 30);
    });
    return this;
  }

  Close(): this {
    this._isOpen = false;
    this.toggleIcon.textContent = this.openIcon;
    this.toggleBtn.style.transform = "rotate(0deg)";
    this.items.forEach((item) => {
      item.row.style.opacity = "0";
      item.row.style.transform = "translateY(8px)";
      item.row.style.pointerEvents = "none";
    });
    return this;
  }

  Toggle(): this {
    return this._isOpen ? this.Close() : this.Open();
  }

  IsOpen(): boolean {
    return this._isOpen;
  }

  override GetType(): string {
    return "FabMenu";
  }
}

function CreateFabMenu(openIcon = "add", closeIcon = "close"): FabMenu {
  return new FabMenu(openIcon, closeIcon);
}
