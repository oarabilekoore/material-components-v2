import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { currentTheme, SliderStyle } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { Signal, CreateSignal, Bind } from "../../../core/src/state/signals.ts";

const containerSva = sva({
  base: {
    display: "flex",
    flexDirection: "column",
    width: "200px",
    position: "relative",
    padding: "8px 0", // Space for thumb
  }
});

const inputSva = sva({
  base: {
    WebkitAppearance: "none",
    appearance: "none",
    width: "100%",
    height: "16px",
    background: "transparent", // background handled by separate track div
    outline: "none",
    margin: "0",
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
    "&::-webkit-slider-thumb": {
      WebkitAppearance: "none",
      appearance: "none",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "var(--m3-slider-thumb-color)",
      cursor: "pointer",
      border: "none",
      transition: "transform 0.1s ease",
    },
    "&::-webkit-slider-thumb:hover": {
      transform: "scale(1.2)",
    },
    "&::-moz-range-thumb": {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "var(--m3-slider-thumb-color)",
      cursor: "pointer",
      border: "none",
      transition: "transform 0.1s ease",
    },
    "&::-moz-range-thumb:hover": {
      transform: "scale(1.2)",
    }
  }
});

const trackContainerSva = sva({
  base: {
    position: "absolute",
    top: "50%",
    left: "10px", // thumb radius
    right: "10px", // thumb radius
    height: "4px",
    transform: "translateY(-50%)",
    borderRadius: "2px",
    backgroundColor: "var(--md-surface-variant)",
    pointerEvents: "none",
    zIndex: 1,
    overflow: "hidden",
  }
});

const activeTrackSva = sva({
  base: {
    position: "absolute",
    top: "0",
    left: "0",
    bottom: "0",
    backgroundColor: "var(--md-primary)",
    transformOrigin: "left center",
  }
});

const ticksContainerSva = sva({
  base: {
    position: "absolute",
    top: "50%",
    left: "10px",
    right: "10px",
    height: "4px",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }
});

const tickSva = sva({
  base: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: "var(--md-on-surface-variant)",
    opacity: "0.38",
  }
});

const valueLabelSva = sva({
  base: {
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
    fontSize: "12px",
    color: "var(--md-on-surface-variant)",
    marginTop: "4px",
    textAlign: "center",
  }
});

export class Slider extends BaseElement {
  declare element: HTMLDivElement;
  private input: HTMLInputElement;
  private activeTrack: HTMLDivElement;
  private valueLabel?: HTMLSpanElement;
  private min: number;
  private max: number;
  public valueSignal: Signal<number>;

  constructor(
    min = 0,
    max = 100,
    value = 0,
    style: SliderStyle = "continuous",
  ) {
    super("div");
    this.min = min;
    this.max = max;

    this.element.className = containerSva();

    const trackContainer = document.createElement("div");
    trackContainer.className = trackContainerSva();
    
    this.activeTrack = document.createElement("div");
    this.activeTrack.className = activeTrackSva();
    trackContainer.appendChild(this.activeTrack);

    this.element.appendChild(trackContainer);

    if (style === "discrete") {
      const step = 1;
      const ticksContainer = document.createElement("div");
      ticksContainer.className = ticksContainerSva();
      const steps = Math.floor((max - min) / step);
      for (let i = 0; i <= steps; i++) {
        const tick = document.createElement("div");
        tick.className = tickSva();
        ticksContainer.appendChild(tick);
      }
      this.element.appendChild(ticksContainer);
    }

    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.min = String(min);
    this.input.max = String(max);
    this.input.value = String(value);
    this.input.className = inputSva();
    this.input.style.setProperty(
      "--m3-slider-thumb-color",
      currentTheme.primary,
    );

    if (style === "discrete") {
      this.input.step = "1";
    }

    this.valueSignal = CreateSignal(value);
    Bind(this.valueSignal, (val) => {
      this.input.value = String(val);
      this.updateView();
    });

    this.input.addEventListener("input", () => {
      this.valueSignal.Set(Number(this.input.value));
    });
    this.element.appendChild(this.input);
  }

  private percent(): number {
    return ((Number(this.input.value) - this.min) / (this.max - this.min)) * 100;
  }

  private updateView() {
    this.activeTrack.style.width = `${this.percent()}%`;
    if (this.valueLabel) {
      this.valueLabel.textContent = this.input.value;
    }
  }

  ShowValueLabel(): this {
    if (!this.valueLabel) {
      this.valueLabel = document.createElement("span");
      this.valueLabel.className = valueLabelSva();
      this.element.appendChild(this.valueLabel);
    }
    this.valueLabel.textContent = this.input.value;
    return this;
  }

  SetValue(value: number): this {
    this.valueSignal.Set(value);
    return this;
  }

  GetValue(): number {
    return this.valueSignal.Get();
  }

  SetOnChange(callback: (value: number) => void): this {
    this.valueSignal.Subscribe(callback);
    return this;
  }

  override GetType(): string {
    return "Slider";
  }
}

function CreateSlider(
  min = 0,
  max = 100,
  value = 0,
  style: SliderStyle = "continuous",
): Slider {
  return new Slider(min, max, value, style);
}

/**
 * AddSlider function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {any} min - The min parameter
 * @param {any} max - The max parameter
 * @param {any} value - The value parameter
 * @param {SliderStyle} style - The style parameter
 * @returns {Slider}
 *
 */
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
