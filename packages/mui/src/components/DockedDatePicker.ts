import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { TextField } from "./TextField.ts";
import { DatePicker } from "./DatePicker.ts";
import { Icons } from "../icons/Icon.ts";

export class DockedDatePicker extends BaseElement {
  private _textField: TextField;
  private _datePicker: DatePicker;

  constructor() {
    super("div");
    this.element.style.position = "relative";
    this.element.style.display = "inline-flex";

    this._textField = new TextField("Date", "outlined", Icons.calendar_today);
    
    // We open the date picker when the text field or icon is clicked
    this._textField.element.addEventListener("click", () => {
      if (!this._datePicker.IsOpen()) {
        this._datePicker.ShowAtElement(this._textField.element, 4);
      }
    });

    this.element.appendChild(this._textField.element);

    this._datePicker = new DatePicker();
    this._datePicker.SetScrimColor("transparent"); // docked picker doesn't use dark scrim

    this._datePicker.SetOnSelect((date) => {
      this._textField.SetValue(date.toLocaleDateString());
      this._datePicker.Close();
    });
  }

  SetDate(date: Date): this {
    this._datePicker.SetDate(date);
    this._textField.SetValue(date.toLocaleDateString());
    return this;
  }

  override GetType(): string {
    return "DockedDatePicker";
  }
}

export function CreateDockedDatePicker(): DockedDatePicker {
  return new DockedDatePicker();
}

export function AddDockedDatePicker(parent: LayoutElement): DockedDatePicker {
  const picker = CreateDockedDatePicker();
  parent.AddChild(picker);
  return picker;
}
