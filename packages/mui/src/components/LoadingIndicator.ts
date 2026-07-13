import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const indicatorSva = sva({
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
    animation: "m3-circular-rotate 2s linear infinite",
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
    strokeDasharray: "125.6",
    strokeDashoffset: "125.6",
    animation: "m3-circular-dash 1.5s ease-in-out infinite",
  },
});

export class LoadingIndicator extends BaseElement {
  private _svg: SVGSVGElement;
  private _circle: SVGCircleElement;

  constructor() {
    super("div");
    this.element.className = "m3-loading-indicator " + indicatorSva();

    this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._svg.setAttribute("viewBox", "22 22 44 44");
    this._svg.setAttribute("class", svgSva());

    this._circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this._circle.setAttribute("cx", "44");
    this._circle.setAttribute("cy", "44");
    this._circle.setAttribute("r", "20.2");
    this._circle.setAttribute("fill", "none");
    this._circle.setAttribute("stroke-width", "3.6");
    this._circle.setAttribute("stroke", "var(--md-primary)");
    this._circle.setAttribute("class", circleSva());
    
    this._svg.appendChild(this._circle);
    this.element.appendChild(this._svg);

    this.ensureAnimations();
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
    return "LoadingIndicator";
  }
}

export function CreateLoadingIndicator(): LoadingIndicator {
  return new LoadingIndicator();
}

export function AddLoadingIndicator(parent: LayoutElement): LoadingIndicator {
  const indicator = CreateLoadingIndicator();
  parent.AddChild(indicator);
  return indicator;
}
