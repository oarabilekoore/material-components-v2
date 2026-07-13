import { BaseElement } from "./BaseElement.ts";

export interface SvgIconNode {
  tag: string;
  attrs: Record<string, string>;
}

export type IconSize = "small" | "medium" | "large" | number;

/** Programmatic SVG Icon for MUI. Replaces material-icons string font icons. */
export class Icon extends BaseElement {
  private svgElement: SVGSVGElement;

  constructor(icon: string | SvgIconNode[], size: IconSize = "medium") {
    super("span");
    
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    
    this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svgElement.setAttribute("viewBox", "0 0 24 24");
    this.svgElement.setAttribute("fill", "currentColor");
    this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    this.svgElement.style.display = "inline-block";
    this.svgElement.style.flexShrink = "0";
    this.svgElement.style.userSelect = "none";
    
    this.SetIcon(icon);

    this.SetIconSize(size);
  }

  private renderNodes(nodes: SvgIconNode[]) {
    this.svgElement.innerHTML = "";
    for (const node of nodes) {
      const child = document.createElementNS("http://www.w3.org/2000/svg", node.tag);
      for (const [key, value] of Object.entries(node.attrs)) {
        child.setAttribute(key, value);
      }
      this.svgElement.appendChild(child);
    }
  }

  public SetIcon(icon: string | SvgIconNode[]): this {
    if (typeof icon === "string") {
      this.element.textContent = icon;
      this.element.classList.add("material-icons");
      if (this.svgElement.parentNode === this.element) {
        this.element.removeChild(this.svgElement);
      }
    } else {
      this.element.textContent = "";
      this.element.classList.remove("material-icons");
      this.renderNodes(icon);
      if (this.svgElement.parentNode !== this.element) {
        this.element.appendChild(this.svgElement as unknown as Node);
      }
    }
    return this;
  }

  public SetIconSize(size: IconSize): this {
    let px = 24;
    if (typeof size === "number") {
      px = size;
    } else {
      switch (size) {
        case "small": px = 20; break;
        case "medium": px = 24; break;
        case "large": px = 36; break;
      }
    }
    
    this.svgElement.setAttribute("width", px.toString());
    this.svgElement.setAttribute("height", px.toString());
    this.element.style.fontSize = `${px}px`;
    return this;
  }

  public SetIconColor(color: string): this {
    this.svgElement.setAttribute("fill", color);
    this.element.style.color = color;
    return this;
  }

  override GetType(): string {
    return "Icon";
  }
}

/** Helper to create standard icons from path strings */
export function createSvgNodesFromPaths(paths: string[]): SvgIconNode[] {
  return paths.map(d => ({
    tag: "path",
    attrs: { d }
  }));
}

/** Pre-defined icons used across MUI */
export const Icons = {
  add: createSvgNodesFromPaths(["M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"]),
  menu: createSvgNodesFromPaths(["M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"]),
  close: createSvgNodesFromPaths(["M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"]),
  check: createSvgNodesFromPaths(["M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"]),
  arrowBack: createSvgNodesFromPaths(["M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"]),
  search: createSvgNodesFromPaths(["M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"])
};
