import { InteractiveElement } from "./interactive_element.ts";

export type ToggleInputType = "checkbox" | "radio";

/**
 * Base for the "visually-hidden native input + custom visual" pattern
 * shared by Checkbox, Radio, and Switch. Owns the input element, its
 * checked/indeterminate/disabled state, change events, and wires its
 * focus/blur into the inherited InteractiveElement focus ring/state layer.
 *
 * Subclasses build whatever custom visual they want (a box, a track+thumb,
 * ...) and override `OnToggleChange` to react to state flips.
 */
export class ToggleInputElement extends InteractiveElement {
  protected input: HTMLInputElement;

  constructor(type: ToggleInputType, tag: "label" | "div" = "label") {
    super(tag);

    this.input = document.createElement("input");
    this.input.type = type;
    this.input.style.cssText =
      "position:absolute; opacity:0; width:0; height:0; margin:0; pointer-events:none;";
    this.element.insertBefore(this.input, this.element.firstChild);

    this.WireFocusEvents(this.input);
    this.input.addEventListener("change", () =>
      this.OnToggleChange(this.input.checked),
    );
  }

  /** Called whenever the checked state changes, so subclasses can repaint
   * their custom visual (box fill, thumb position, ...). */
  protected OnToggleChange(_checked: boolean): void {}

  SetChecked(checked: boolean): this {
    this.input.checked = checked;
    this.input.indeterminate = false;
    this.OnToggleChange(checked);
    return this;
  }

  SetIndeterminate(indeterminate: boolean): this {
    this.input.indeterminate = indeterminate;
    this.OnToggleChange(this.input.checked);
    return this;
  }

  IsChecked(): boolean {
    return this.input.checked;
  }

  IsIndeterminate(): boolean {
    return this.input.indeterminate;
  }

  SetName(name: string): this {
    this.input.name = name;
    return this;
  }

  SetValue(value: string): this {
    this.input.value = value;
    return this;
  }

  GetValue(): string {
    return this.input.value;
  }

  SetOnChange(callback: (checked: boolean, value: string) => void): this {
    this.input.addEventListener("change", () =>
      callback(this.input.checked, this.input.value),
    );
    return this;
  }

  override SetDisabled(disabled: boolean, opacity = 0.38): this {
    super.SetDisabled(disabled, opacity);
    this.input.disabled = disabled;
    return this;
  }

  override GetType(): string {
    return "ToggleInput";
  }
}
