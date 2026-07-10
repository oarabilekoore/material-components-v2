import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme } from "../theme.ts";

export type TabsVariant = "primary" | "secondary";

export class Tabs extends BaseElement {
  private variant: TabsVariant;
  private tabButtons: HTMLButtonElement[] = [];
  private indicator: HTMLDivElement;
  private activeIndex = 0;
  private onSelect?: (index: number) => void;

  constructor(variant: TabsVariant = "primary") {
    super("div");
    this.variant = variant;
    this.element.style.display = "flex";
    this.element.style.position = "relative";
    this.element.style.borderBottom = `1px solid ${currentTheme.outlineVariant}`;
    this.element.style.fontFamily = currentTheme.fontFamily;

    this.indicator = document.createElement("div");
    this.indicator.style.position = "absolute";
    this.indicator.style.bottom = "0";
    this.indicator.style.height = variant === "primary" ? "3px" : "2px";
    this.indicator.style.backgroundColor = currentTheme.primary;
    this.indicator.style.borderRadius = "3px 3px 0 0";
    this.indicator.style.transition =
      "left 0.2s cubic-bezier(0.2, 0, 0, 1), width 0.2s cubic-bezier(0.2, 0, 0, 1)";
    this.element.appendChild(this.indicator);
  }

  AddTab(label: string): this {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.border = "none";
    btn.style.background = "transparent";
    btn.style.cursor = "pointer";
    btn.style.padding = "0 16px";
    btn.style.height = "48px";
    btn.style.fontFamily = currentTheme.fontFamily;
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "500";
    btn.style.color = currentTheme.onSurfaceVariant;
    btn.style.flex = this.variant === "primary" ? "1" : "none";
    btn.style.transition = "color 0.1s ease";

    const index = this.tabButtons.length;
    btn.addEventListener("click", () => this.SetActiveIndex(index));

    this.tabButtons.push(btn);
    this.element.insertBefore(btn, this.indicator); // keep indicator last so it stays visually on top

    if (index === 0) queueMicrotask(() => this.SetActiveIndex(0));
    return this;
  }

  SetActiveIndex(index: number): this {
    if (index < 0 || index >= this.tabButtons.length) return this;
    this.activeIndex = index;

    this.tabButtons.forEach((btn, i) => {
      btn.style.color =
        i === index ? currentTheme.primary : currentTheme.onSurfaceVariant;
    });

    const target = this.tabButtons[index];
    this.indicator.style.left = `${target.offsetLeft}px`;
    this.indicator.style.width = `${target.offsetWidth}px`;

    this.onSelect?.(index);
    return this;
  }

  GetActiveIndex(): number {
    return this.activeIndex;
  }

  SetOnSelect(callback: (index: number) => void): this {
    this.onSelect = callback;
    return this;
  }

  override GetType(): string {
    return "Tabs";
  }
}

function CreateTabs(variant: TabsVariant = "primary"): Tabs {
  return new Tabs(variant);
}

/**
 * AddTabs function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {TabsVariant} variant - The variant parameter
 * @returns {Tabs}
 *
 */
export function AddTabs(
  parent: LayoutElement,
  variant: TabsVariant = "primary",
): Tabs {
  const tabs = CreateTabs(variant);
  parent.AddChild(tabs);
  return tabs;
}
