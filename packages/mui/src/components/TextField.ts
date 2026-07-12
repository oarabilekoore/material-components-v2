import { Icon, SvgIconNode, Icons } from "../icons/Icon.ts";
import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { TextFieldVariant } from "../theme.ts";
import { sva } from "../../../core/src/utils/sva.ts";
import { Signal, CreateSignal, Bind } from "../../../core/src/state/signals.ts";

const textFieldSva = sva({
  base: {
    display: "inline-flex",
    flexDirection: "column",
    position: "relative",
    width: "280px", // M3 default min-width
    fontFamily: "var(--md-font-family, Roboto, sans-serif)",
  },
});

const fieldWrapSva = sva({
  base: {
    position: "relative",
    height: "56px",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    transition: "border-color 0.1s ease, border-width 0.1s ease, background-color 0.1s ease",
    cursor: "text",
    borderTopLeftRadius: "calc(var(--md-shape-corner-extra-small) * var(--md-shape-scale, 1))",
    borderTopRightRadius: "calc(var(--md-shape-corner-extra-small) * var(--md-shape-scale, 1))",
  },
  variants: {
    variant: {
      filled: {
        backgroundColor: "var(--md-surface-variant)",
        borderBottom: "1px solid var(--md-on-surface-variant)",
        padding: "0 16px",
        "&:hover": {
          backgroundColor: "rgba(73, 69, 79, 0.08)", // on-surface-variant 8% hover
        }
      },
      outlined: {
        backgroundColor: "transparent",
        border: "1px solid var(--md-outline)",
        padding: "0 16px",
        borderRadius: "calc(var(--md-shape-corner-extra-small) * var(--md-shape-scale, 1))",
        "&:hover": {
          borderColor: "var(--md-on-surface)",
        }
      },
    },
    focused: {
      true: {},
      false: {},
    },
    error: {
      true: {},
      false: {},
    }
  },
  compoundVariants: [
    {
      variant: "filled",
      focused: true,
      style: {
        borderBottom: "2px solid var(--md-primary)",
      }
    },
    {
      variant: "outlined",
      focused: true,
      style: {
        border: "2px solid var(--md-primary)",
      }
    },
    {
      variant: "filled",
      error: true,
      style: {
        borderBottom: "2px solid var(--md-error)",
      }
    },
    {
      variant: "outlined",
      error: true,
      style: {
        border: "2px solid var(--md-error)",
      }
    }
  ]
});

const labelSva = sva({
  base: {
    position: "absolute",
    color: "var(--md-on-surface-variant)",
    transition: "all 0.15s cubic-bezier(0.2, 0, 0, 1)",
    pointerEvents: "none",
    transformOrigin: "left top",
    background: "transparent",
    padding: "0",
  },
  variants: {
    state: {
      rest: {
        top: "50%",
        transform: "translateY(-50%) scale(1)",
      },
      floated: {
        top: "0",
        transform: "translateY(-50%) scale(0.75)",
      }
    },
    variant: {
      filled: {},
      outlined: {
        background: "var(--md-surface)",
        padding: "0 4px",
      }
    },
    focused: {
      true: {
        color: "var(--md-primary)",
      },
      false: {}
    },
    error: {
      true: {
        color: "var(--md-error)",
      },
      false: {}
    },
    hasLeadingIcon: {
      true: { left: "48px" },
      false: { left: "16px" }
    }
  },
  defaultVariants: {
    hasLeadingIcon: false
  },
  compoundVariants: [
    {
      state: "rest",
      variant: "outlined",
      style: {
        background: "transparent",
        padding: "0",
      }
    },
    {
      state: "floated",
      variant: "filled",
      style: {
        top: "8px",
        transform: "translateY(0) scale(0.75)",
      }
    }
  ]
});

const inputSva = sva({
  base: {
    border: "none",
    outline: "none",
    background: "transparent",
    width: "100%",
    height: "100%",
    fontFamily: "inherit",
    fontSize: "1rem",
    color: "var(--md-on-surface)",
  },
  variants: {
    variant: {
      filled: { paddingTop: "14px" },
      outlined: { paddingTop: "0" },
    }
  }
});

const iconSva = sva({
  base: {
    color: "var(--md-on-surface-variant)",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  variants: {
    position: {
      leading: { marginRight: "12px" },
      trailing: { marginLeft: "12px" }
    },
    interactive: {
      true: { cursor: "pointer" },
      false: { cursor: "default" }
    }
  },
  defaultVariants: {
    interactive: false
  }
});

const supportingTextSva = sva({
  base: {
    fontSize: "0.75rem",
    marginTop: "4px",
    marginLeft: "16px",
  },
  variants: {
    error: {
      true: { color: "var(--md-error)" },
      false: { color: "var(--md-on-surface-variant)" }
    }
  }
});

export class TextField extends BaseElement {
  private input: HTMLInputElement;
  private labelEl: HTMLSpanElement;
  private fieldWrap: HTMLDivElement;
  private supportingText?: HTMLSpanElement;
  private leadingIconSpan?: Icon;
  private trailingIconSpan?: Icon;
  
  private variant: TextFieldVariant;
  private labelText: string;
  private isFocused: Signal<boolean>;
  private isError: Signal<boolean>;
  public valueSignal: Signal<string>;
  private _placeholderText = "";

  constructor(label: string, variant: TextFieldVariant = "filled") {
    super("div");
    this.variant = variant;
    this.labelText = label;

    this.element.className = textFieldSva();

    this.fieldWrap = document.createElement("div");
    
    this.labelEl = document.createElement("span");
    this.labelEl.textContent = label;
    
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.className = inputSva({ variant });

    this.fieldWrap.appendChild(this.labelEl);
    this.fieldWrap.appendChild(this.input);
    this.element.appendChild(this.fieldWrap);

    this.isFocused = CreateSignal(false);
    this.isError = CreateSignal(false);
    this.valueSignal = CreateSignal("");

    const updateView = () => {
      const hasValue = !!this.valueSignal.Get();
      const focused = this.isFocused.Get();
      const error = this.isError.Get();
      const floated = focused || hasValue;

      this.fieldWrap.className = fieldWrapSva({
        variant: this.variant,
        focused: focused,
        error: error
      });

      this.labelEl.className = labelSva({
        variant: this.variant,
        state: floated ? "floated" : "rest",
        focused: focused && !error,
        error: error,
        hasLeadingIcon: !!this.leadingIconSpan
      });

      this.input.placeholder = floated ? this._placeholderText : "";
    };

    Bind(this.isFocused, updateView);
    Bind(this.isError, updateView);
    Bind(this.valueSignal, (val) => {
      this.input.value = val;
      updateView();
    });

    this.input.addEventListener("focus", () => this.isFocused.Set(true));
    this.input.addEventListener("blur", () => this.isFocused.Set(false));
    this.input.addEventListener("input", () => this.valueSignal.Set(this.input.value));
    
    this.fieldWrap.addEventListener("click", () => {
      this.input.focus();
    });
  }

  SetValue(value: string): this {
    this.valueSignal.Set(value);
    return this;
  }

  GetValue(): string {
    return this.valueSignal.Get();
  }

  SetPlaceholder(text: string): this {
    this._placeholderText = text;
    this.input.placeholder = (this.isFocused.Get() || !!this.valueSignal.Get()) ? text : "";
    return this;
  }

  SetLeadingIcon(iconNodes: SvgIconNode[]): this {
    if (!this.leadingIconSpan) {
      this.leadingIconSpan = new Icon(iconNodes);
      this.leadingIconSpan.element.className = iconSva({ position: "leading", interactive: false });
      this.fieldWrap.insertBefore(this.leadingIconSpan.element, this.labelEl);
      this.labelEl.className = labelSva({
        variant: this.variant,
        state: this.isFocused.Get() || !!this.valueSignal.Get() ? "floated" : "rest",
        focused: this.isFocused.Get() && !this.isError.Get(),
        error: this.isError.Get(),
        hasLeadingIcon: true
      });
    }
    this.leadingIconSpan.SetIcon(iconNodes);
    return this;
  }

  SetTrailingIcon(iconNodes: SvgIconNode[], onClick?: () => void): this {
    if (!this.trailingIconSpan) {
      this.trailingIconSpan = new Icon(iconNodes);
      this.trailingIconSpan.element.className = iconSva({ position: "trailing", interactive: false });
      this.fieldWrap.appendChild(this.trailingIconSpan.element);
    }
    this.trailingIconSpan.SetIcon(iconNodes);
    if (onClick) {
      this.trailingIconSpan.element.className = iconSva({ position: "trailing", interactive: true });
      this.trailingIconSpan.element.onclick = (e) => {
        e.stopPropagation();
        onClick();
      };
    }
    return this;
  }

  SetSupportingText(text: string, isError = false): this {
    if (!this.supportingText) {
      this.supportingText = document.createElement("span");
      this.element.appendChild(this.supportingText);
    }
    this.isError.Set(isError);
    this.supportingText.className = supportingTextSva({ error: isError });
    this.supportingText.textContent = text;
    return this;
  }

  override SetEnabled(enabled: boolean): this {
    this.input.disabled = !enabled;
    this.element.style.opacity = enabled ? "1" : "0.38";
    this.element.style.pointerEvents = enabled ? "auto" : "none";
    return this;
  }

  SetOnChange(callback: (value: string) => void): this {
    this.valueSignal.Subscribe(callback);
    return this;
  }

  override GetType(): string {
    return "TextField";
  }
}

function CreateTextField(
  label: string,
  variant: TextFieldVariant = "filled",
): TextField {
  return new TextField(label, variant);
}

/**
 * AddTextField function.
 * @param {LayoutElement} parent - The parent parameter
 * @param {string} label - The label parameter
 * @param {TextFieldVariant} variant - The variant parameter
 * @returns {TextField}
 *
 */
export function AddTextField(
  parent: LayoutElement,
  label: string,
  variant: TextFieldVariant = "filled",
): TextField {
  const field = CreateTextField(label, variant);
  parent.AddChild(field);
  return field;
}
