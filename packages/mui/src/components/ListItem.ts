import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { currentTheme } from "../theme.ts";
import { List } from "./List.ts";
import { attachRipple } from "../../../core/src/utils/ripple.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const listItemSva = sva({
  base: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    boxSizing: "border-box",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "var(--md-surface-variant)",
    },
  },
  variants: {
    lines: {
      1: { minHeight: "56px" },
      2: { minHeight: "72px" },
      3: { minHeight: "88px" }
    }
  },
  defaultVariants: { lines: 1 }
});

const textContainerSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    justifyContent: "center",
  },
});

const headlineSva = sva({
  base: {
    fontSize: "1rem",
    color: "var(--md-on-surface)",
  },
});

const supportingTextSva = sva({
  base: {
    fontSize: "0.875rem",
    color: "var(--md-on-surface-variant)",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  variants: {
    lines: {
      1: { WebkitLineClamp: "1" },
      2: { WebkitLineClamp: "2" }
    }
  },
  defaultVariants: { lines: 1 }
});

const leadingContentSva = sva({
  base: {
    marginRight: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    color: "var(--md-on-surface-variant)",
  },
});

const trailingContentSva = sva({
  base: {
    marginLeft: "16px",
  },
});

export class ListItem extends BaseElement {
  private _headline: HTMLSpanElement;
  private _supportingText: HTMLSpanElement | null = null;
  private _leadingContent: HTMLElement | null = null;
  private _leadingIcon?: Icon;
  private _trailingContent: HTMLElement | null = null;

  constructor(headline: string) {
    super("li");
    this.element.className = "m3-list-item " + listItemSva({ lines: 1 });

    attachRipple(this.element);

    const textContainer = document.createElement("div");
    textContainer.className = textContainerSva();

    this._headline = document.createElement("span");
    this._headline.textContent = headline;
    this._headline.className = headlineSva();
    textContainer.appendChild(this._headline);

    this.element.appendChild(textContainer);
  }

  SetSupportingText(text: string, lines: 1 | 2 = 1): this {
    if (!this._supportingText) {
      this._supportingText = document.createElement("span");
      const textContainer = this.element.querySelector("div");
      if (textContainer) textContainer.appendChild(this._supportingText);
    }
    this._supportingText.className = supportingTextSva({ lines });
    this._supportingText.textContent = text;
    this.element.className = "m3-list-item " + listItemSva({ lines: lines === 1 ? 2 : 3 });
    return this;
  }

  SetLeadingIcon(iconNodes: SvgIconNode[]): this {
    if (!this._leadingContent) {
      this._leadingContent = document.createElement("span");
      this._leadingContent.className = leadingContentSva();
      
      this._leadingIcon = new Icon(iconNodes);
      this._leadingContent.appendChild(this._leadingIcon.element);
      this.element.insertBefore(this._leadingContent, this.element.firstChild);
    } else if (this._leadingIcon) {
      this._leadingIcon.SetIcon(iconNodes);
    }
    return this;
  }

  SetTrailingContent(element: BaseElement): this {
    if (this._trailingContent) {
      this._trailingContent.remove();
    }
    this._trailingContent = document.createElement("div");
    this._trailingContent.className = trailingContentSva();
    this._trailingContent.appendChild(element.element);
    this.element.appendChild(this._trailingContent);
    return this;
  }

  SetOnClick(callback: (event: MouseEvent) => void): this {
    this.element.addEventListener("click", callback);
    return this;
  }

  override GetType(): string {
    return "ListItem";
  }
}

function CreateListItem(headline: string): ListItem {
  return new ListItem(headline);
}

/**
 * AddListItem function.
 * @param {List} parent - The parent parameter
 * @param {string} headline - The headline parameter
 * @returns {ListItem}
 *
 */
export function AddListItem(parent: List, headline: string): ListItem {
  const item = CreateListItem(headline);
  parent.AddChild(item);
  return item;
}
