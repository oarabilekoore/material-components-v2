import { BaseElement } from "./BaseElement.ts";

/** Displays an image. */
export class ImageElement extends BaseElement {
  declare element: HTMLImageElement;

  constructor() {
    super("img");
  }

  /** Sets the image source path or URL. */
  SetSrc(path: string) {
    this.element.src = path;
    return this;
  }

  /** Gets the image source. */
  GetSrc(): string {
    return this.element.src;
  }

  /** Sets accessible alt text. */
  SetAlt(text: string) {
    this.element.alt = text;
    return this;
  }
}
