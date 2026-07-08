import { BaseElement } from "./base_element.ts";
import { LayoutElement } from "./layout_element.ts";

/** Wraps a custom web component / custom element. */
export class WebComponentElement extends BaseElement {
  constructor(tagName: string) {
    super(tagName);
  }

  /** Sets an HTML attribute. */
  SetAttr(name: string, value: string) {
    this.element.setAttribute(name, value);
    return this;
  }

  /** Gets an HTML attribute. */
  GetAttr(name: string): string | null {
    return this.element.getAttribute(name);
  }

  /** Sets a JS property directly on the component instance. */
  SetProp(name: string, value: unknown) {
    // deno-lint-ignore no-explicit-any
    (this.element as any)[name] = value;
    return this;
  }

  /** Gets a JS property from the component instance. */
  GetProp(name: string): unknown {
    // deno-lint-ignore no-explicit-any
    return (this.element as any)[name];
  }

  /** Listens for a custom event dispatched by the component. */
  On(event: string, callback: (e: CustomEvent) => void) {
    this.element.addEventListener(event, callback as EventListener);
    return this;
  }

  /** Resolves once the custom element has been upgraded and is ready. */
  WhenReady(): Promise<void> {
    return customElements.whenDefined(this.element.tagName.toLowerCase());
  }
}

/** Creates a web component wrapper for a given custom element tag name. */
export function CreateWebComponent(
  tagName: string,
  width = -1,
  height = -1,
  options?: { px?: boolean },
): WebComponentElement {
  const comp = new WebComponentElement(tagName);
  if (width !== -1 || height !== -1) comp.SetSize(width, height, options);
  return comp;
}

/** Creates and adds a web component to a Layout. */
export function AddWebComponent(
  parent: LayoutElement,
  tagName: string,
  width = -1,
  height = -1,
  options?: { px?: boolean },
): WebComponentElement {
  const comp = CreateWebComponent(tagName, width, height, options);
  parent.AddChild(comp);
  return comp;
}
