import { CreateLayout, AddText } from "../../packages/core/index.ts";
import {
  AddTextField,
  AddCheckbox,
  AddRadio,
  AddSwitch,
  AddSlider,
  AddSearchBar,
  AddDatePicker,
  AddTimePicker,
  AddButton,
} from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";
import { PageHeader, Section, Row, Labeled, Style } from "./_shared.ts";

export function CreateFormsPage() {
  const page = CreateLayout("Linear", "FillX");
  Style(page, { alignItems: "stretch", gap: "24px" });

  PageHeader(page, "Forms", "Text entry, selection controls, and pickers for collecting user input.");

  // ------------------------------------------------------------ TextField
  const textFields = Section(page, "Text Fields", "Filled and outlined, with icons, supporting text, and an error state.");
  const tfRow = Row(textFields);

  const filledSlot = Labeled(tfRow, "filled");
  AddTextField(filledSlot, "Email", "filled")
    .SetPlaceholder("you@example.com")
    .SetLeadingIcon(Icons.search);

  const outlinedSlot = Labeled(tfRow, "outlined + clear");
  const outlined = AddTextField(outlinedSlot, "Full name", "outlined");
  outlined.SetTrailingIcon(Icons.close, () => outlined.SetValue(""));

  const errorSlot = Labeled(tfRow, "error state");
  AddTextField(errorSlot, "Username", "outlined").SetSupportingText("This username is already taken", true);

  // ----------------------------------------------------- Selection controls
  const selection = Section(page, "Selection Controls", "Checkboxes, radio groups, and switches.");
  const selRow = Row(selection, "32px");

  const checkSlot = Labeled(selRow, "checkbox (checked / indeterminate)");
  const checkGroup = CreateLayout("Linear");
  Style(checkGroup, { flexDirection: "row", gap: "8px" });
  AddCheckbox(checkGroup, "Checked").SetChecked(true);
  AddCheckbox(checkGroup, "Mixed").SetIndeterminate(true);
  AddCheckbox(checkGroup, "Empty");
  checkSlot.AddChild(checkGroup);

  const radioSlot = Labeled(selRow, "radio group");
  const radioGroup = CreateLayout("Linear");
  Style(radioGroup, { gap: "4px", alignItems: "flex-start" });
  AddRadio(radioGroup, "plan", "monthly", "Monthly").SetChecked(true);
  AddRadio(radioGroup, "plan", "yearly", "Yearly");
  radioSlot.AddChild(radioGroup);

  const switchSlot = Labeled(selRow, "switch (on / off)");
  const switchGroup = CreateLayout("Linear");
  Style(switchGroup, { flexDirection: "row", gap: "12px" });
  AddSwitch(switchGroup).SetChecked(true).SetIcons(Icons.check);
  AddSwitch(switchGroup);
  switchSlot.AddChild(switchGroup);

  // ------------------------------------------------------------- Sliders
  const sliders = Section(page, "Sliders", "Continuous and discrete (stepped) styles.");
  const sliderRow = Row(sliders, "32px");

  const continuousSlot = Labeled(sliderRow, "continuous");
  const continuous = CreateLayout("Linear");
  AddSlider(continuous, 0, 100, 50, "continuous").ShowValueLabel();
  continuousSlot.AddChild(continuous);

  const discreteSlot = Labeled(sliderRow, "discrete (0\u201310)");
  const discrete = CreateLayout("Linear");
  AddSlider(discrete, 0, 10, 4, "discrete").ShowValueLabel();
  discreteSlot.AddChild(discrete);

  // ---------------------------------------------------------- Search bars
  const search = Section(page, "Search Bars", "Filled, outlined, icon-less, and one wired to live suggestions.");
  const searchCol = CreateLayout("Linear", "FillX");
  Style(searchCol, { gap: "12px", alignItems: "flex-start" });
  AddSearchBar(searchCol, "Filled search\u2026", "filled");
  AddSearchBar(searchCol, "Outlined search\u2026", "outlined");
  AddSearchBar(searchCol, "No leading icon\u2026", "filled", null);
  const suggestSearch = AddSearchBar(searchCol, "Try typing a fruit\u2026", "outlined");
  suggestSearch.SetSuggestions(["Apple", "Apricot", "Banana", "Cherry", "Date"]);
  search.AddChild(searchCol);

  // -------------------------------------------------------------- Pickers
  const pickers = Section(page, "Pickers", "Modal date and time selection.");
  const pickerRow = Row(pickers, "24px");

  const dateSlot = Labeled(pickerRow, "date picker");
  const dateBtn = AddButton(dateSlot, "Select date", "filled-tonal");
  const dPicker = AddDatePicker(page);
  dPicker.SetOnSelect((date) => dateBtn.SetText(date.toDateString()));
  dateBtn.SetOnClick(() => dPicker.Show());

  const timeSlot = Labeled(pickerRow, "time picker");
  const timeBtn = AddButton(timeSlot, "Select time", "filled-tonal");
  const tPicker = AddTimePicker(page);
  tPicker.SetOnChange((time) => timeBtn.SetText(time));
  timeBtn.SetOnClick(() => tPicker.Show());

  return page;
}
