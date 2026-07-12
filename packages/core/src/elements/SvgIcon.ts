import { BaseElement } from "./BaseElement.ts";

export interface SvgIconNode {
  tag: string;
  attrs: Record<string, string>;
}

export class SvgIconElement extends BaseElement {
  private svgElement: SVGSVGElement;

  constructor(nodes: SvgIconNode[]) {
    super("span");
    
    this.element.style.display = "inline-flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    
    this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svgElement.setAttribute("width", "24");
    this.svgElement.setAttribute("height", "24");
    this.svgElement.setAttribute("viewBox", "0 0 24 24");
    this.svgElement.setAttribute("fill", "currentColor");
    this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    this.svgElement.style.display = "inline-block";
    this.svgElement.style.flexShrink = "0";
    this.svgElement.style.userSelect = "none";
    
    this.renderNodes(nodes);
    this.element.appendChild(this.svgElement as unknown as Node);
  }

  private renderNodes(nodes: SvgIconNode[]) {
    for (const node of nodes) {
      const child = document.createElementNS("http://www.w3.org/2000/svg", node.tag);
      for (const [key, value] of Object.entries(node.attrs)) {
        child.setAttribute(key, value);
      }
      this.svgElement.appendChild(child);
    }
  }

  override SetSize(width: number, height: number = width): this {
    super.SetSize(width, height);
    this.svgElement.setAttribute("width", width.toString());
    this.svgElement.setAttribute("height", height.toString());
    return this;
  }

  override SetColor(color: string): this {
    this.svgElement.setAttribute("fill", color);
    return this;
  }

  override GetType(): string {
    return "SvgIcon";
  }
}
