import { BaseElement } from "../elements/BaseElement.ts";

/** Shows the app UI. */
export function Show() {
  document.body.style.visibility = "visible";
}

/** Hides the app UI. */
export function Hide() {
  document.body.style.visibility = "hidden";
}

/** Sets a data-theme attribute on the root element, e.g. for CSS theming. */
export function SetTheme(name: string) {
  document.documentElement.dataset.theme = name;
}

/** Sets the app-wide base text size. */
export function SetTextSize(
  size: number,
  mode: "px" | "em" | "rem" | "%" = "px",
) {
  document.documentElement.style.fontSize = `${size}${mode}`;
}

/** Dispatches a synthetic click at (x, y) on a control. */
export function SimulateTouch(target: BaseElement, x: number, y: number) {
  const opts = { clientX: x, clientY: y, bubbles: true };
  target.element.dispatchEvent(new MouseEvent("mousedown", opts));
  target.element.dispatchEvent(new MouseEvent("mouseup", opts));
  target.element.dispatchEvent(new MouseEvent("click", opts));
}

/** Dispatches a synthetic drag from (x1,y1) to (x2,y2) on a control. */
export function SimulateDrag(
  target: BaseElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  target.element.dispatchEvent(
    new MouseEvent("mousedown", { clientX: x1, clientY: y1, bubbles: true }),
  );
  target.element.dispatchEvent(
    new MouseEvent("mousemove", { clientX: x2, clientY: y2, bubbles: true }),
  );
  target.element.dispatchEvent(
    new MouseEvent("mouseup", { clientX: x2, clientY: y2, bubbles: true }),
  );
}

/** Dispatches a synthetic key press on a control. */
export function SimulateKey(target: BaseElement, key: string) {
  target.element.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true }),
  );
  target.element.dispatchEvent(
    new KeyboardEvent("keyup", { key, bubbles: true }),
  );
}

/** Simulates a scroll by deltaY pixels on a control. */
export function SimulateScroll(target: BaseElement, deltaY: number) {
  target.element.scrollTop += deltaY;
  target.element.dispatchEvent(
    new WheelEvent("wheel", { deltaY, bubbles: true }),
  );
}

/** Gets all controls in the document matching a CSS selector, wrapped as BaseElement. */
export function GetObjects(selector = "*"): BaseElement[] {
  const nodes = document.querySelectorAll<HTMLElement>(selector);
  return Array.from(nodes).map((el) => {
    const wrapped = new BaseElement(el.tagName.toLowerCase());
    wrapped.element = el;
    return wrapped;
  });
}
