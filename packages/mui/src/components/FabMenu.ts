import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { Signal, CreateSignal, Bind } from "../../../core/src/state/signals.ts";

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
  variants: {
    open: {
      true: { transform: "rotate(135deg)" },
      false: { transform: "rotate(0deg)" }
    }
  },
  defaultVariants: { open: false }
});

const toggleIconSva = sva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
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
  variants: {
    visible: {
      true: {
        opacity: "1",
        transform: "translateY(0)",
        pointerEvents: "auto",
      },
      false: {
        opacity: "0",
        transform: "translateY(8px)",
        pointerEvents: "none",
      }
    }
  },
  defaultVariants: { visible: false }
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
  iconNodes: SvgIconNode[] | string;
  label: string;
  callback: () => void;
  row: HTMLDivElement;
}

export class FabMenuEl extends BaseElement {
  private toggleBtnObj: BaseElement;
  private toggleBtn: HTMLButtonElement;
  private toggleIcon: HTMLSpanElement;
  private itemsContainer: HTMLDivElement;
  private items: FabMenuItem[] = [];
  private _isOpen: Signal<boolean>;
  private openIconNodes: SvgIconNode[] | string;
  private closeIconNodes: SvgIconNode[] | string;
  private _currentToggleIcon?: Icon;
  private _morphShape = false;

  constructor(openIconNodes: SvgIconNode[] | string = Icons.add, closeIconNodes: SvgIconNode[] | string = Icons.close) {
    super("div");
    this.openIconNodes = openIconNodes;
    this.closeIconNodes = closeIconNodes;

    this.element.className = "m3-fab-menu " + menuSva();

    this.itemsContainer = document.createElement("div");
    this.itemsContainer.className = containerSva();

    this.toggleBtnObj = new BaseElement("button");
    this.toggleBtnObj.element.className = toggleBtnSva();
    this.toggleBtn = this.toggleBtnObj.element as HTMLButtonElement;

    this.toggleIcon = document.createElement("span");
    this.toggleIcon.className = toggleIconSva();
    this._currentToggleIcon = new Icon(openIconNodes);
    this.toggleIcon.appendChild(this._currentToggleIcon.element);
    this.toggleBtn.appendChild(this.toggleIcon);

    this.toggleBtn.addEventListener("click", () => this.Toggle());

    this.element.appendChild(this.itemsContainer);
    this.element.appendChild(this.toggleBtn);

    if (typeof document !== "undefined") {
      document.body.appendChild(this.element);
      document.addEventListener("click", (e) => {
        if (!this.element.contains(e.target as Node) && this.IsOpen()) {
          this.Close();
        }
      });
    }

    this._isOpen = CreateSignal(false);
    
    let isInitial = true;
    Bind(this._isOpen, (isOpen) => {
      if (isOpen) {
        if (this._morphShape) {
          if (!isInitial) {
            this.toggleBtnObj.MorphShape("16px", "28px", 200);
          } else {
            this.toggleBtn.style.borderRadius = "28px";
          }
        }
        if (this._currentToggleIcon) this._currentToggleIcon.Dispose();
        this._currentToggleIcon = new Icon(this.closeIconNodes);
        this.toggleIcon.innerHTML = "";
        this.toggleIcon.appendChild(this._currentToggleIcon.element);
        this.toggleBtn.className = toggleBtnSva({ open: true });
        this.items.forEach((item, i) => {
          setTimeout(() => {
            item.row.className = rowSva({ visible: true });
          }, i * 30);
        });
      } else {
        if (this._morphShape) {
          if (!isInitial) {
            this.toggleBtnObj.MorphShape("28px", "16px", 200);
          } else {
            this.toggleBtn.style.borderRadius = "16px";
          }
        }
        if (this._currentToggleIcon) this._currentToggleIcon.Dispose();
        this._currentToggleIcon = new Icon(this.openIconNodes);
        this.toggleIcon.innerHTML = "";
        this.toggleIcon.appendChild(this._currentToggleIcon.element);
        this.toggleBtn.className = toggleBtnSva({ open: false });
        this.items.forEach((item) => {
          item.row.className = rowSva({ visible: false });
        });
      }
      isInitial = false;
    });
  }

  AddItem(iconNodes: SvgIconNode[] | string, label: string, callback: () => void): this {
    const row = document.createElement("div");
    row.className = rowSva();

    const labelChip = document.createElement("span");
    labelChip.className = chipSva();
    labelChip.textContent = label;

    const iconBtn = document.createElement("button");
    iconBtn.className = itemBtnSva();

    const iconObj = new Icon(iconNodes, 20);
    iconBtn.appendChild(iconObj.element);

    iconBtn.addEventListener("click", () => {
      callback();
      this.Close();
    });

    row.appendChild(labelChip);
    row.appendChild(iconBtn);
    this.itemsContainer.appendChild(row);

    this.items.push({ iconNodes, label, callback, row });
    return this;
  }

  SetShapeMorph(enable = true): this {
    this._morphShape = enable;
    if (this._morphShape) {
      this.toggleBtn.style.borderRadius = this._isOpen.Get() ? "28px" : "16px";
    } else {
      this.toggleBtn.style.borderRadius = ""; // reset to default sva styles
    }
    return this;
  }

  Open(): this {
    this._isOpen.Set(true);
    return this;
  }

  Close(): this {
    this._isOpen.Set(false);
    return this;
  }

  Toggle(): this {
    this._isOpen.Set(!this._isOpen.Get());
    return this;
  }

  IsOpen(): boolean {
    return this._isOpen.Get();
  }

  override GetType(): string {
    return "FabMenu";
  }
}

function CreateFabMenu(openIconNodes: SvgIconNode[] | string = Icons.add, closeIconNodes: SvgIconNode[] | string = Icons.close): FabMenuEl {
  return new FabMenuEl(openIconNodes, closeIconNodes);
}

/**
 * AddFabMenu function.
 * @param {import("../../../core/src/elements/Layout.ts").LayoutElement} parent - The parent parameter
 * @param {SvgIconNode[] | string} openIconNodes - The open icon nodes parameter
 * @param {SvgIconNode[] | string} closeIconNodes - The close icon nodes parameter
 * @returns {FabMenuEl}
 */
export function FabMenu(
  openIconNodes: SvgIconNode[] | string = Icons.add,
  closeIconNodes: SvgIconNode[] | string = Icons.close,
): FabMenuEl {
  const menu = CreateFabMenu(openIconNodes, closeIconNodes);
  return menu;
}
