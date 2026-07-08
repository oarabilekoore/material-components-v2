import { BaseElement } from "./base_element.ts";

/** Embeds a web page. */
export class WebViewElement extends BaseElement {
  declare element: HTMLIFrameElement;

  constructor() {
    super("iframe");
    this.element.style.border = "none";
  }

  /** Loads a URL. */
  LoadUrl(url: string) {
    this.element.src = url;
    return this;
  }

  /** Loads raw HTML content. */
  LoadHtml(html: string) {
    this.element.srcdoc = html;
    return this;
  }
}
