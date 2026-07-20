import { BaseElement } from "../../../core/src/elements/BaseElement.ts";
import { LayoutElement } from "../../../core/src/elements/Layout.ts";
import { TextFieldEl } from "./TextField.ts";
import { DatePickerEl } from "./DatePicker.ts";
import { Icons } from "../icons/Icon.ts";

export class DockedDatePickerEl extends BaseElement {
  private _textField: TextFieldEl;
  private _datePicker: DatePickerEl;

  constructor() {
    super("div");
    this.element.style.position = "relative";
    this.element.style.display = "inline-flex";

    this._textField = new TextFieldEl("Date", "outlined");
    
    // We open the date picker when the text field or icon is clicked
    this._textField.element.addEventListener("click", () => {
      if (!this._datePicker.IsOpen()) {
        this._datePicker.ShowAtElement(this._textField.element, 4);
      }
    });

    this.element.appendChild(this._textField.element);

    this._datePicker = new DatePickerEl();
    this._datePicker.SetScrimColor("transparent"); // docked picker doesn't use dark scrim

    this._datePicker.SetOnSelect((date) => {
      this._textField.SetValue(date.toLocaleDateString());
      this._datePicker.Close();
    });
  }

  SetDate(date: Date): this {
    // this._datePicker.SetDate(date);
    this._textField.SetValue(date.toLocaleDateString());
    return this;
  }

  override GetType(): string {
    return "DockedDatePicker";
  }
}

export function CreateDockedDatePicker(): DockedDatePickerEl {
  return new DockedDatePickerEl();
}

export function DockedDatePicker(): DockedDatePickerEl {
  const picker = CreateDockedDatePicker();
  return picker;
}
