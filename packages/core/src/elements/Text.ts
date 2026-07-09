import { BaseElement } from "./base_element.ts";

/** A control that displays text, e.g. labels. */
export class TextElement extends BaseElement {
  /** Sets displayed text. */
  SetText(text: string) {
    this.element.textContent = text;
    return this;
  }

  /** Gets displayed text. */
  GetText(): string {
    return this.element.textContent ?? "";
  }

  /** Sets HTML-formatted content. */
  SetHtml(str: string) {
    this.element.innerHTML = str;
    return this;
  }

  /** Sets text color. */
  SetTextColor(color: string) {
    this.element.style.color = color;
    return this;
  }

  /** Sets text size. */
  SetTextSize(size: number, mode: "px" | "em" | "rem" | "%" = "px") {
    this.element.style.fontSize = `${size}${mode}`;
    return this;
  }

  /** Gets current text size. */
  GetTextSize(options?: { px?: boolean }): number {
    const size = getComputedStyle(this.element).fontSize;
    return options?.px ? parseFloat(size) : parseFloat(size) / 16;
  }

  /** Truncates overflowing text with an ellipsis. */
  SetEllipsize(mode: "start" | "middle" | "end" = "end") {
    this.element.style.overflow = "hidden";
    this.element.style.whiteSpace = "nowrap";
    this.element.style.textOverflow = "ellipsis";
    if (mode === "start") this.element.style.direction = "rtl";
    return this;
  }

  /** Adds a text shadow. */
  SetTextShadow(radius: number, dx = 0, dy = 0, color = "black") {
    this.element.style.textShadow = `${dx}px ${dy}px ${radius}px ${color}`;
    return this;
  }
}
