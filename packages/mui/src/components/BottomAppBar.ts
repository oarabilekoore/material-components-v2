import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const barSva = sva({
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "var(--md-surface-container)",
    color: "var(--md-on-surface)",
    padding: "0 16px",
    height: "80px", // M3 Bottom App Bar is 80px high
    boxSizing: "border-box",
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    zIndex: 10,
    boxShadow: "0 -1px 3px rgba(0,0,0,0.1)",
  },
});

const actionsContainerSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
});

const fabContainerSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
  }
});

export class BottomAppBarEl extends BaseElement {
  private _actionsContainer: HTMLDivElement;
  private _fabContainer: HTMLDivElement;
  private _fab?: BaseElement;

  constructor() {
    super("div");
    this.element.className = "m3-bottom-app-bar " + barSva();

    this._actionsContainer = document.createElement("div");
    this._actionsContainer.className = actionsContainerSva();
    this.element.appendChild(this._actionsContainer);

    this._fabContainer = document.createElement("div");
    this._fabContainer.className = fabContainerSva();
    this.element.appendChild(this._fabContainer);
  }

  AddAction(iconBtn: BaseElement): this {
    this._actionsContainer.appendChild(iconBtn.element);
    return this;
  }

  SetFab(fab: BaseElement): this {
    if (this._fab) {
      this._fab.Dispose();
    }
    this._fab = fab;
    this._fabContainer.appendChild(fab.element);
    return this;
  }

  override GetType(): string {
    return "BottomAppBar";
  }
}

function CreateBottomAppBar(): BottomAppBarEl {
  return new BottomAppBarEl();
}

/**
 * AddBottomAppBar function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {BottomAppBarEl}
 *
 */
export function BottomAppBar(bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }): BottomAppBarEl {
  const bar = CreateBottomAppBar();
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(bar);
      else document.body.appendChild(bar.element);
  return bar;
}
