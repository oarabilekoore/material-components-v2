import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";
import { Signal, CreateSignal, Bind } from "../../../core/src/state/signals.ts";
import { sva } from "../../../core/src/utils/sva.ts";

export type TabsVariant = "primary" | "secondary";

const tabsSva = sva({
  base: {
    display: "flex",
    position: "relative",
    borderBottom: "1px solid var(--md-outline-variant)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

const indicatorSva = sva({
  base: {
    position: "absolute",
    bottom: "0",
    backgroundColor: "var(--md-primary)",
    borderRadius: "3px 3px 0 0",
    transition: "left 0.2s cubic-bezier(0.2, 0, 0, 1), width 0.2s cubic-bezier(0.2, 0, 0, 1)",
  },
  variants: {
    variant: {
      primary: { height: "3px" },
      secondary: { height: "2px" },
    },
  },
  defaultVariants: { variant: "primary" },
});

const tabBtnSva = sva({
  base: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "0 16px",
    height: "48px",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.1s ease",
  },
  variants: {
    variant: {
      primary: { flex: "1" },
      secondary: { flex: "none" },
    },
    active: {
      true: { color: "var(--md-primary)" },
      false: { color: "var(--md-on-surface-variant)" },
    },
  },
  defaultVariants: {
    variant: "primary",
    active: false,
  },
});

export class TabsEl extends BaseElement {
  private variant: TabsVariant;
  private tabButtons: HTMLButtonElement[] = [];
  private indicator: HTMLDivElement;
  private activeIndex: Signal<number>;
  private onSelect?: (index: number) => void;

  constructor(variant: TabsVariant = "primary") {
    super("div");
    this.variant = variant;
    this.element.className = "m3-tabs " + tabsSva();

    this.indicator = document.createElement("div");
    this.indicator.className = indicatorSva({ variant });
    this.element.appendChild(this.indicator);

    this.activeIndex = CreateSignal(-1);
    Bind(this.activeIndex, (index) => {
      this.tabButtons.forEach((btn, i) => {
        btn.className = tabBtnSva({ variant: this.variant, active: i === index });
      });

      const target = this.tabButtons[index];
      if (target) {
        this.indicator.style.left = `${target.offsetLeft}px`;
        this.indicator.style.width = `${target.offsetWidth}px`;
      }
    });
  }

  AddTab(label: string): this {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = tabBtnSva({ variant: this.variant, active: false });

    const index = this.tabButtons.length;
    btn.addEventListener("click", () => this.SetActiveIndex(index));

    this.tabButtons.push(btn);
    this.element.insertBefore(btn, this.indicator); // keep indicator last so it stays visually on top

    if (index === 0) queueMicrotask(() => this.SetActiveIndex(0));
    return this;
  }

  SetActiveIndex(index: number): this {
    if (index < 0 || index >= this.tabButtons.length) return this;
    this.activeIndex.Set(index);
    this.onSelect?.(index);
    return this;
  }

  GetActiveIndex(): number {
    return this.activeIndex.Get();
  }

  SetOnSelect(callback: (index: number) => void): this {
    this.onSelect = callback;
    return this;
  }

  override GetType(): string {
    return "Tabs";
  }
}

function CreateTabs(variant: TabsVariant = "primary"): TabsEl {
  return new TabsEl(variant);
}

/**
 * AddTabs function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {TabsVariant} variant - The variant parameter
 * @returns {TabsEl}
 *
 */
export function Tabs(
  variant: TabsVariant = "primary", bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }
): TabsEl {
  const tabs = CreateTabs(variant);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(tabs);
      else document.body.appendChild(tabs.element);
  return tabs;
}
