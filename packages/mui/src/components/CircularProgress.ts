import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme } from "../theme.ts";

export class CircularProgress extends BaseElement {
  private _svg: SVGSVGElement;
  private _circle: SVGCircleElement;
  private _circumference: number = 125.6;

  constructor() {
    super("div");
    this.element.className = "m3-circular-progress";
    this.element.style.width = "48px";
    this.element.style.height = "48px";
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";

    this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._svg.setAttribute("viewBox", "22 22 44 44");
    this._svg.style.width = "100%";
    this._svg.style.height = "100%";
    this._svg.style.transform = "rotate(-90deg)";

    this._circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this._circle.setAttribute("cx", "44");
    this._circle.setAttribute("cy", "44");
    this._circle.setAttribute("r", "20.2");
    this._circle.setAttribute("fill", "none");
    this._circle.setAttribute("stroke-width", "3.6");
    this._circle.setAttribute("stroke", currentTheme.primary);
    this._circle.style.strokeDasharray = `${this._circumference}`;
    this._circle.style.strokeDashoffset = `${this._circumference}`;
    this._circle.style.transition = "stroke-dashoffset 0.3s ease";

    this._svg.appendChild(this._circle);
    this.element.appendChild(this._svg);
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
      const offset = this._circumference - (value / 100) * this._circumference;
      this._circle.style.strokeDashoffset = `${offset}`;
    }
    return this;
  }

  private ensureAnimations(): void {
    if (!document.getElementById("m3-circular-anim")) {
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

export function CreateCircularProgress(): CircularProgress {
  return new CircularProgress();
}

export function AddCircularProgress(parent: LayoutElement): CircularProgress {
  const progress = CreateCircularProgress();
  parent.AddChild(progress);
  return progress;
}
