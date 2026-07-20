import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement, currentAutoBindTarget } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const progressSva = sva({
  base: {
    width: "48px",
    height: "48px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const svgSva = sva({
  base: {
    width: "100%",
    height: "100%",
    transform: "rotate(-90deg)",
  },
});

const circleSva = sva({
  base: {
    cx: "44",
    cy: "44",
    r: "20.2",
    fill: "none",
    strokeWidth: "3.6",
    stroke: "var(--md-primary)",
    transition: "stroke-dashoffset 0.3s ease",
  },
});

export class CircularProgressEl extends BaseElement {
  private _svg: SVGSVGElement;
  private _circle: SVGCircleElement;
  private _circumference: number = 125.6;

  constructor() {
    super("div");
    this.element.className = "m3-circular-progress " + progressSva();

    this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._svg.setAttribute("viewBox", "22 22 44 44");
    this._svg.setAttribute("class", svgSva());

    this._circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this._circle.setAttribute("cx", "44");
    this._circle.setAttribute("cy", "44");
    this._circle.setAttribute("r", "20.2");
    this._circle.setAttribute("fill", "none");
    this._circle.setAttribute("stroke-width", "3.6");
    this._circle.setAttribute("stroke", "var(--md-primary)");
    this._circle.setAttribute("class", circleSva());
    
    this._circle.style.strokeDasharray = `${this._circumference}`;
    this._circle.style.strokeDashoffset = `${this._circumference}`;

    this._svg.appendChild(this._circle);
    this.element.appendChild(this._svg);

    this.SetProgress(null);
  }

  SetProgress(value: number | null): this {
    if (value === null) {
      this._circle.style.transition = "none";
      this._svg.style.animation = "m3-circular-rotate 2s linear infinite";
      this._circle.style.animation =
        "m3-circular-dash 1.5s ease-in-out infinite";
      this.ensureAnimations();
    } else {
      this._svg.style.animation = "none";
      this._circle.style.animation = "none";
      this._circle.style.transition = "stroke-dashoffset 0.3s ease";
      const offset = this._circumference - value * this._circumference;
      this._circle.style.strokeDashoffset = `${offset}`;
    }
    return this;
  }

  private ensureAnimations(): void {
    if (typeof document !== "undefined" && !document.getElementById("m3-circular-anim")) {
      const style = document.createElement("style");
      style.id = "m3-circular-anim";
      style.textContent = `
        @keyframes m3-circular-rotate {
          100% { transform: rotate(270deg); }
        }
        @keyframes m3-circular-dash {
          0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 100, 200; stroke-dashoffset: -15px; }
          100% { stroke-dasharray: 100, 200; stroke-dashoffset: -125px; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  override GetType(): string {
    return "CircularProgress";
  }
}

function CreateCircularProgress(): CircularProgressEl {
  return new CircularProgressEl();
}

/**
 * AddCircularProgress function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {CircularProgressEl}
 *
 */
export function CircularProgress(bindOptions?: { into?: import("../../../core/src/elements/Layout.ts").LayoutElement }): CircularProgressEl {
  const progress = CreateCircularProgress();
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
      if (parentTarget) parentTarget._internalMount(progress);
      else document.body.appendChild(progress.element);
  return progress;
}
