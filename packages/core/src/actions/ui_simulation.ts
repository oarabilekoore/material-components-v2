import { BaseElement } from "../elements/BaseElement.ts";

export function SimulateTouch(target: BaseElement, x: number, y: number) {
  const opts = { clientX: x, clientY: y, bubbles: true };
  target.element.dispatchEvent(new MouseEvent("mousedown", opts));
  target.element.dispatchEvent(new MouseEvent("mouseup", opts));
  target.element.dispatchEvent(new MouseEvent("click", opts));
}

/** Dispatches a synthetic drag from (x,y) to (x2,y2) on a control. */
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
