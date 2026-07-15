import { SimulateTouch } from "../actions";
import { uniqueId } from "../utils";
import { BaseElement } from "./BaseElement";

export class Dialog extends BaseElement {
  public primaryCommander: BaseElement | null = null;
  public secondaryCommander: BaseElement | null = null;

  constructor() {
    super("dialog");
    this.element.id = uniqueId("Dialog");
  }

  SetCommanders(primary: BaseElement, secondary: BaseElement): this {
    if (primary == null || secondary == null) {
      console.error(
        "Declare both primary and secondary commanders to use Show and Hide",
      );
      return this;
    }

    this.primaryCommander = primary;
    this.secondaryCommander = secondary;

    primary.element.setAttribute("commandfor", this.element.id);
    secondary.element.setAttribute("commandfor", this.element.id);

    return this;
  }

  Show(): this {
    if (this.primaryCommander != null) {
      this.primaryCommander.element.setAttribute("command", "show-modal");
      SimulateTouch(this.primaryCommander, 1, 1);
    }
    return this;
  }

  Hide(): this {
    if (this.secondaryCommander != null) {
      this.secondaryCommander.element.setAttribute("command", "close");
      SimulateTouch(this.secondaryCommander, 1, 1);
    }
    return this;
  }

  GetType(): string {
    return "Dialog";
  }
}
