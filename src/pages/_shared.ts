import { CreateLayout, AddText } from "../../packages/core/index.ts";
import { LayoutElement } from "../../packages/core/src/elements/Layout.ts";
import { TextElement } from "../../packages/core/src/elements/Text.ts";
import { BaseElement } from "../../packages/core/src/elements/BaseElement.ts";

/**
 * Shared visual building blocks for every demo page, so the whole app
 * reads like one coherent product instead of five hand-rolled layouts.
 */

/**
 * Applies styles directly on the element (inline), not via SetStyle()'s
 * generated CSS class. LayoutElement sets display/flexDirection/alignItems/
 * justifyContent/position inline in its own constructor, and inline styles
 * always beat class-based rules in the cascade regardless of specificity —
 * so SetStyle() can never override those particular properties on a Layout.
 * Use this instead whenever you need to touch any of them.
 */
export function Style<T extends BaseElement>(
  el: T,
  styles: Partial<CSSStyleDeclaration> | Record<string, string | number>,
): T {
  Object.assign(el.element.style, styles as Record<string, string>);
  return el;
}

/** Page header: big title + one-line description. Used once per category page. */
export function PageHeader(parent: LayoutElement, title: string, description: string) {
  const header = CreateLayout("Linear", "FillX");
  Style(header, { alignItems: "flex-start", gap: "4px", marginBottom: "8px" });

  AddText(header, title)
    .SetFontSize("1.75rem")
    .SetFontWeight(600)
    .SetColor("var(--md-on-surface)");

  AddText(header, description)
    .SetFontSize("0.9375rem")
    .SetColor("var(--md-on-surface-variant)");

  parent.AddChild(header);
  return header;
}

/**
 * A titled, card-like grouping for one component family (e.g. "Buttons").
 * Returns the inner content layout — add rows/examples to it.
 */
export function Section(parent: LayoutElement, title: string, description?: string) {
  const card = CreateLayout("Linear", "FillX");
  Style(card, {
    alignItems: "stretch",
    gap: "20px",
    padding: "28px",
    borderRadius: "20px",
    border: "1px solid var(--md-outline-variant)",
    backgroundColor: "var(--md-surface-container-low, var(--md-surface))",
    boxSizing: "border-box",
  });

  const headingWrap = CreateLayout("Linear", "FillX");
  Style(headingWrap, { alignItems: "flex-start", gap: "4px" });

  AddText(headingWrap, title)
    .SetFontSize("1.125rem")
    .SetFontWeight(600)
    .SetColor("var(--md-on-surface)");

  if (description) {
    AddText(headingWrap, description)
      .SetFontSize("0.8125rem")
      .SetColor("var(--md-on-surface-variant)");
  }

  card.AddChild(headingWrap);

  const content = CreateLayout("Linear", "FillX");
  Style(content, { alignItems: "flex-start", gap: "16px" });
  card.AddChild(content);

  parent.AddChild(card);
  return content;
}

/** A horizontal, wrapping row — the default way examples sit next to each other. */
export function Row(parent: LayoutElement, gap = "16px") {
  const row = CreateLayout("Linear", "FillX");
  Style(row, {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap,
  });
  parent.AddChild(row);
  return row;
}

/** Labels a single example with a small caption underneath it. */
export function Labeled(parent: LayoutElement, label: string) {
  const wrap = CreateLayout("Linear");
  Style(wrap, { alignItems: "center", gap: "10px" });

  const slot = CreateLayout("Linear");
  Style(slot, { alignItems: "center", justifyContent: "center", minHeight: "40px" });
  wrap.AddChild(slot);

  AddText(wrap, label)
    .SetFontSize("0.75rem")
    .SetFontWeight(500)
    .SetColor("var(--md-on-surface-variant)");

  parent.AddChild(wrap);
  return slot;
}

/** Small pill used to tag a variant name inline (e.g. inside list rows). */
export function Caption(parent: LayoutElement, text: string): TextElement {
  return AddText(parent, text).SetFontSize("0.75rem").SetColor("var(--md-on-surface-variant)");
}
