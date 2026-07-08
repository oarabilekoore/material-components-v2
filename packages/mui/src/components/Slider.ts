import { BaseElement } from "../../../core/src/elements/base_element.ts";
import { LayoutElement } from "../../../core/src/elements/layout_element.ts";
import { currentTheme, SliderStyle } from "../theme.ts";

let stylesInjected = false;

function injectSliderStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    .m3-slider-input {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      outline: none;
    }
    .m3-slider-input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--m3-slider-thumb-color);
      cursor: pointer;
      border: none;
    }
    .m3-slider-input::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--m3-slider-thumb-color);
      cursor: pointer;
      border: none;
    }
  `;
  document.head.appendChild(style);
}

export class Slider extends BaseElement {
  declare element: HTMLDivElement;
  private input: HTMLInputElement;
  private valueLabel?: HTMLSpanElement;

  constructor(
    min = 0,
    max = 100,
    value = 0,
    style: SliderStyle = "continuous",
  ) {
    super("div");
    injectSliderStyles();

    this.element.style.display = "flex";
    this.element.style.flexDirection = "column";
    this.element.style.width = "200px";

    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.min = String(min);
    this.input.max = String(max);
    this.input.value = String(value);
    this.input.className = "m3-slider-input";
    this.input.style.setProperty(
      "--m3-slider-thumb-color",
      currentTheme.primary,
    );
    this.input.style.background = `linear-gradient(to right, ${currentTheme.primary} 0%, ${currentTheme.primary} ${this.percent()}%, ${currentTheme.surfaceVariant} ${this.percent()}%, ${currentTheme.surfaceVariant} 100%)`;

    if (style === "discrete") {
      this.input.step = "1";
    }

    this.input.addEventListener("input", () => {
      this.input.style.background = `linear-gradient(to right, ${currentTheme.primary} 0%, ${currentTheme.primary} ${this.percent()}%, ${currentTheme.surfaceVariant} ${this.percent()}%, ${currentTheme.surfaceVariant} 100%)`;
      if (this.valueLabel) this.valueLabel.textContent = this.input.value;
    });

    this.element.appendChild(this.input);
  }

  private percent(): number {
    const min = Number(this.input.min);
    const max = Number(this.input.max);
    return ((Number(this.input.value) - min) / (max - min)) * 100;
  }

  /** Shows a live value readout below the track. */
  ShowValueLabel(): this {
    this.valueLabel = document.createElement("span");
    this.valueLabel.textContent = this.input.value;
    this.valueLabel.style.fontFamily = currentTheme.fontFamily;
    this.valueLabel.style.fontSize = "12px";
    this.valueLabel.style.color = currentTheme.onSurfaceVariant;
    this.valueLabel.style.marginTop = "4px";
    this.valueLabel.style.textAlign = "center";
    this.element.appendChild(this.valueLabel);
    return this;
  }

  SetValue(value: number): this {
    this.input.value = String(value);
    this.input.dispatchEvent(new Event("input"));
    return this;
  }

  GetValue(): number {
    return Number(this.input.value);
  }

  SetOnChange(callback: (value: number) => void): this {
    this.input.addEventListener("input", () =>
      callback(Number(this.input.value)),
    );
    return this;
  }

  override GetType(): string {
    return "Slider";
  }
}

export function CreateSlider(
  min = 0,
  max = 100,
  value = 0,
  style: SliderStyle = "continuous",
): Slider {
  return new Slider(min, max, value, style);
}

export function AddSlider(
  parent: LayoutElement,
  min = 0,
  max = 100,
  value = 0,
  style: SliderStyle = "continuous",
): Slider {
  const slider = CreateSlider(min, max, value, style);
  parent.AddChild(slider);
  return slider;
}
