import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { sva } from "../../../core/src/utils/sva.ts";

const containerSva = sva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    width: "52px",
    height: "32px",
    userSelect: "none",
  },
  variants: {
    focused: {
      true: {
        outline: "2px solid var(--md-primary)",
        outlineOffset: "2px",
      },
      false: {
        outline: "none",
      },
    },
  },
  defaultVariants: {
    focused: false,
  },
});

const inputSva = sva({
  base: {
    position: "absolute",
    opacity: "0",
    width: "0",
    height: "0",
  },
});

const trackSva = sva({
  base: {
    position: "absolute",
    boxSizing: "border-box",
    inset: "0",
    borderRadius: "16px",
    transition: "background-color 0.15s ease, border-color 0.15s ease",
  },
  variants: {
    checked: {
      true: {
        backgroundColor: "var(--md-primary)",
        border: "none",
      },
      false: {
        backgroundColor: "var(--md-surface-variant)",
        border: "2px solid var(--md-outline)",
      },
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const thumbSva = sva({
  base: {
    position: "absolute",
    borderRadius: "50%",
    transition: "all 0.15s cubic-bezier(0.2, 0, 0, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  variants: {
    checked: {
      true: {
        width: "24px",
        height: "24px",
        top: "4px",
        left: "24px",
        backgroundColor: "var(--md-on-primary)",
      },
      false: {
        width: "16px",
        height: "16px",
        top: "8px",
        left: "8px",
        backgroundColor: "var(--md-outline)",
      },
    },
    hasIcon: {
      true: {},
      false: {}
    }
  },
  compoundVariants: [
    {
      checked: false,
      hasIcon: true,
      style: {
        width: "24px",
        height: "24px",
        top: "4px",
        left: "4px",
      }
    }
  ],
  defaultVariants: {
    checked: false,
    hasIcon: false,
  },
});

const iconSva = sva({
  base: {
    fontFamily: "'Material Icons'",
    fontSize: "16px",
    transition: "color 0.15s ease, opacity 0.15s ease",
  },
  variants: {
    checked: {
      true: {
        color: "var(--md-on-primary-container)",
        opacity: "1",
      },
      false: {
        color: "var(--md-surface-variant)",
        opacity: "1",
      }
    }
  }
});

export class Switch extends BaseElement {
  private input: HTMLInputElement;
  private track: HTMLDivElement;
  private thumb: HTMLDivElement;
  private iconSpan: HTMLSpanElement;
  private _focused = false;
  private _onIcon?: string;
  private _offIcon?: string;

  constructor() {
    super("label");
    this.updateContainerStyle();

    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.className = inputSva();

    this.track = document.createElement("div");
    this.thumb = document.createElement("div");
    
    this.iconSpan = document.createElement("span");
    this.iconSpan.className = iconSva({ checked: false });
    this.iconSpan.style.display = "none";
    this.thumb.appendChild(this.iconSpan);

    this.element.appendChild(this.input);
    this.element.appendChild(this.track);
    this.element.appendChild(this.thumb);

    this.input.addEventListener("focus", () => {
      this._focused = true;
      this.updateContainerStyle();
    });
    this.input.addEventListener("blur", () => {
      this._focused = false;
      this.updateContainerStyle();
    });

    this.input.addEventListener("change", () => {
      this.updateState(this.input.checked);
    });

    this.updateState(false);
  }

  private updateContainerStyle() {
    this.element.className = "m3-switch " + containerSva({ focused: this._focused });
  }

  private updateState(checked: boolean): void {
    const hasIcon = !!(checked ? this._onIcon : this._offIcon);
    this.track.className = trackSva({ checked });
    this.thumb.className = thumbSva({ checked, hasIcon: !!this._onIcon || !!this._offIcon });
    
    if (hasIcon) {
      this.iconSpan.style.display = "block";
      this.iconSpan.textContent = (checked ? this._onIcon : this._offIcon) || "";
      this.iconSpan.className = iconSva({ checked });
    } else {
      this.iconSpan.style.display = "none";
    }
  }

  SetIcons(onIcon: string, offIcon?: string): this {
    this._onIcon = onIcon;
    this._offIcon = offIcon;
    this.updateState(this.input.checked);
    return this;
  }

  SetChecked(checked: boolean): this {
    this.input.checked = checked;
    this.updateState(checked);
    return this;
  }

  IsChecked(): boolean {
    return this.input.checked;
  }

  override SetEnabled(enabled: boolean): this {
    this.input.disabled = !enabled;
    this.element.style.opacity = enabled ? "1" : "0.38";
    this.element.style.cursor = enabled ? "pointer" : "not-allowed";
    this.element.style.pointerEvents = enabled ? "auto" : "none";
    return this;
  }

  SetOnChange(callback: (checked: boolean) => void): this {
    this.input.addEventListener("change", () => callback(this.input.checked));
    return this;
  }

  override GetType(): string {
    return "Switch";
  }
}

function CreateSwitch(): Switch {
  return new Switch();
}

/**
 * AddSwitch function.
 * @param {LayoutElement} parent - The parent parameter
 * @returns {Switch}
 *
 */
export function AddSwitch(parent: LayoutElement): Switch {
  const sw = CreateSwitch();
  parent.AddChild(sw);
  return sw;
}
