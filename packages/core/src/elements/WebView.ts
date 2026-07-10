import { BaseElement } from "./BaseElement.ts";

export class WebViewElement extends BaseElement {
  constructor() {
    super("iframe");
  }

  LoadUrl(url: string) {
    this.element.setAttribute("src", url);
    return this;
  }
}
