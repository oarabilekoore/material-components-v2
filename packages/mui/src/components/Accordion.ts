import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";
import { Signal, CreateSignal, Bind } from "../../../core/src/state/signals.ts";

const accordionContainerSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "var(--md-surface)",
    color: "var(--md-on-surface)",
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
});

const headerSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    height: "56px",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 0.2s ease",
  },
});

const titleSva = sva({
  base: {
    fontSize: "16px",
    fontWeight: "400",
  },
});

const iconSva = sva({
  base: {
    fontFamily: "'Material Icons'",
    transition: "transform 0.3s cubic-bezier(0.2, 0, 0, 1)",
    color: "var(--md-on-surface-variant)",
  },
  variants: {
    expanded: {
      true: {
        transform: "rotate(180deg)",
      },
      false: {
        transform: "rotate(0)",
      }
    }
  },
  defaultVariants: {
    expanded: false,
  }
});

const contentSva = sva({
  base: {
    display: "grid",
    gridTemplateRows: "0fr",
    transition: "grid-template-rows 0.3s cubic-bezier(0.2, 0, 0, 1)",
    visibility: "hidden",
  },
  variants: {
    expanded: {
      true: {
        gridTemplateRows: "1fr",
        visibility: "visible",
      },
      false: {
        gridTemplateRows: "0fr",
        visibility: "hidden",
      }
    }
  },
  defaultVariants: {
    expanded: false,
  }
});

const contentInnerSva = sva({
  base: {
    overflow: "hidden",
  },
});

const contentPaddingSva = sva({
  base: {
    padding: "16px",
    paddingTop: "0",
    color: "var(--md-on-surface-variant)",
    fontSize: "14px",
    lineHeight: "1.5",
  },
});

export class Accordion extends BaseElement {
  private _header: HTMLDivElement;
  private _titleSpan: HTMLSpanElement;
  private _iconSpan: HTMLSpanElement;
  private _contentContainer: HTMLDivElement;
  private _contentInner: HTMLDivElement;
  private _contentPadding: HTMLDivElement;
  private _expanded: Signal<boolean>;

  constructor(title: string) {
    super("div");
    this.element.className = "m3-accordion " + accordionContainerSva();

    this._header = document.createElement("div");
    this._header.className = headerSva();
    
    this._titleSpan = document.createElement("span");
    this._titleSpan.className = titleSva();
    this._titleSpan.textContent = title;
    
    this._iconSpan = document.createElement("span");
    this._iconSpan.className = iconSva({ expanded: false });
    this._iconSpan.textContent = "expand_more";

    this._header.appendChild(this._titleSpan);
    this._header.appendChild(this._iconSpan);
    attachRipple(this._header);
    
    this._header.addEventListener("click", () => this.Toggle());

    this.element.appendChild(this._header);

    this._expanded = CreateSignal(false);

    this._contentContainer = document.createElement("div");
    this._contentContainer.className = contentSva({ expanded: false });
    
    this._contentInner = document.createElement("div");
    this._contentInner.className = contentInnerSva();
    
    this._contentPadding = document.createElement("div");
    this._contentPadding.className = contentPaddingSva();

    this._contentInner.appendChild(this._contentPadding);
    this._contentContainer.appendChild(this._contentInner);
    this.element.appendChild(this._contentContainer);

    Bind(this._expanded, (expanded) => {
      this._iconSpan.className = iconSva({ expanded });
      this._contentContainer.className = contentSva({ expanded });
    });
  }

  SetTitle(title: string): this {
    this._titleSpan.textContent = title;
    return this;
  }

  SetContent(content: string | BaseElement): this {
    this._contentPadding.innerHTML = "";
    if (typeof content === "string") {
      this._contentPadding.textContent = content;
    } else {
      this._contentPadding.appendChild(content.element);
    }
    return this;
  }

  Expand(): this {
    this._expanded.Set(true);
    return this;
  }

  Collapse(): this {
    this._expanded.Set(false);
    return this;
  }

  Toggle(): this {
    this._expanded.Set(!this._expanded.Get());
    return this;
  }
  
  IsExpanded(): boolean {
    return this._expanded.Get();
  }

  override GetType(): string {
    return "Accordion";
  }
}

function CreateAccordion(title: string): Accordion {
  return new Accordion(title);
}

/**
 * AddAccordion function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} title - The title parameter
 * @returns {Accordion}
 *
 */
export function AddAccordion(parent: LayoutElement, title: string): Accordion {
  const acc = CreateAccordion(title);
  parent.AddChild(acc);
  return acc;
}
