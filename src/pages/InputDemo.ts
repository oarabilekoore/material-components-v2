import { CreateLayout, AddText } from "../../packages/core/index.ts";
import { AddTextField, AddCheckbox, AddRadio, AddSwitch, AddSlider, AddSearchBar, AddDatePicker, AddTimePicker, AddButton } from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";

export function CreateInputDemoPage() {
  const page = CreateLayout("Linear", "FillXY");
  page.element.style.alignItems = "flex-start";
  page.element.style.gap = "24px";
  
  AddText(page, "Inputs & Controls").SetFontSize("2rem").SetFontWeight(600).SetColor("var(--md-primary)");
  AddText(page, "Text fields, checkboxes, radios, switches, and sliders.").SetFontSize("1rem").SetColor("var(--md-on-surface-variant)");

  // Text Fields
  const textSection = CreateLayout("Linear");
  textSection.element.style.gap = "16px";
  AddText(textSection, "Text Fields").SetFontSize("1.5rem").SetFontWeight(500);
  
  const textRow = CreateLayout("Linear");
  textRow.element.style.flexDirection = "row";
  textRow.element.style.gap = "16px";
  
  const filled = AddTextField(textRow, "Filled TextField", "filled");
  filled.SetPlaceholder("Enter text...");
  filled.SetLeadingIcon(Icons.search);

  const outlined = AddTextField(textRow, "Outlined TextField", "outlined");
  outlined.SetPlaceholder("Enter more text...");
  outlined.SetTrailingIcon(Icons.close, () => outlined.SetValue(""));
  
  textSection.AddChild(textRow);
  page.AddChild(textSection);

  // Selection Controls
  const selSection = CreateLayout("Linear");
  selSection.element.style.gap = "16px";
  AddText(selSection, "Selection Controls").SetFontSize("1.5rem").SetFontWeight(500);
  
  const selRow = CreateLayout("Linear");
  selRow.element.style.flexDirection = "row";
  selRow.element.style.gap = "24px";
  selRow.element.style.alignItems = "center";
  
  AddCheckbox(selRow, "Checkbox");
  
  const radioGroup = CreateLayout("Linear");
  radioGroup.element.style.gap = "8px";
  AddRadio(radioGroup, "Radio 1", "group1");
  AddRadio(radioGroup, "Radio 2", "group1");
  selRow.AddChild(radioGroup);

  AddSwitch(selRow).SetChecked(true);
  
  selSection.AddChild(selRow);
  page.AddChild(selSection);

  // Sliders
  const sliderSection = CreateLayout("Linear");
  sliderSection.element.style.gap = "16px";
  sliderSection.element.style.width = "400px";
  AddText(sliderSection, "Sliders").SetFontSize("1.5rem").SetFontWeight(500);
  
  AddSlider(sliderSection, 0, 100, 50);
  
  page.AddChild(sliderSection);

  // Search Bars
  const searchSection = CreateLayout("Linear");
  searchSection.element.style.gap = "16px";
  AddText(searchSection, "Search Bars").SetFontSize("1.5rem").SetFontWeight(500);

  const searchRow = CreateLayout("Linear");
  searchRow.element.style.gap = "16px";

  AddSearchBar(searchRow, "Standard Filled Search...");
  AddSearchBar(searchRow, "Outlined Search...", "outlined");
  AddSearchBar(searchRow, "No Icon Search...", "filled", null);
  
  const customSearch = AddSearchBar(searchRow, "Custom Icon & History...", "outlined", Icons.menu);
  customSearch.SetSuggestions(["Apple", "Banana", "Cherry", "Date"]);

  searchSection.AddChild(searchRow);
  page.AddChild(searchSection);

  // Pickers
  const pickerSection = CreateLayout("Linear");
  pickerSection.element.style.gap = "16px";
  AddText(pickerSection, "Pickers").SetFontSize("1.5rem").SetFontWeight(500);

  const pickerRow = CreateLayout("Linear");
  pickerRow.element.style.flexDirection = "row";
  pickerRow.element.style.gap = "24px";
  
  const dateBtn = AddButton(pickerRow, "Select Date", "filled-tonal");
  const dPicker = AddDatePicker(page);
  dPicker.SetOnSelect((date) => {
    dateBtn.SetText(`Selected: ${date.toDateString()}`);
  });
  dateBtn.SetOnClick(() => dPicker.Show());

  const timeBtn = AddButton(pickerRow, "Select Time", "filled-tonal");
  const tPicker = AddTimePicker(page);
  tPicker.SetOnChange((time) => {
    timeBtn.SetText(`Selected: ${time}`);
  });
  timeBtn.SetOnClick(() => tPicker.Show());

  pickerSection.AddChild(pickerRow);
  page.AddChild(pickerSection);

  return page;
}
