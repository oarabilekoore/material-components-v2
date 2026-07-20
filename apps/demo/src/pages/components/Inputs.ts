import { Layout, Text, EndAutoBind } from "../../../../../packages/core/index.ts";
import { TextField, Checkbox, Slider, Button, Switch, Radio, SearchBar, SearchView, DatePicker, DockedDatePicker, TimePicker, Icons } from "../../../../../packages/mui/index.ts";
import type { TextFieldVariant, SliderStyle } from "../../../../../packages/mui/src/theme.ts";

export function CreateInputs() {
  Layout("Linear", "Fit", "/components/inputs");
  
  Text("Inputs").SetTextSize(24).SetTextColor("var(--core-primary)");
  
  // TextFields
  Text("Text Fields").SetTextSize(20);
  const tfVariants: Record<TextFieldVariant, true> = {
    filled: true,
    outlined: true
  };
  Object.keys(tfVariants).forEach(variant => {
    TextField(`Label (${variant})`, variant as TextFieldVariant);
  });

  // Sliders
  Text("Sliders").SetTextSize(20);
  const sliderStyles: Record<SliderStyle, true> = {
    continuous: true,
    discrete: true
  };
  Object.keys(sliderStyles).forEach(style => {
    const s = Slider(0, 100, 50, style as SliderStyle);
    // Wire up text readout
    const valText = Text(`Value: 50`);
    s.element.addEventListener("input", (e) => {
      valText.SetText(`Value: ${(e.target as HTMLInputElement).value}`);
    });
  });

  // Checkbox & Switch
  Text("Toggles & States").SetTextSize(20);
  const tRow = Layout("Linear");
  tRow.element.style.flexDirection = "row";
  tRow.element.style.gap = "16px";
  tRow.element.style.alignItems = "center";
  
  const cb = Checkbox();
  const cbChecked = Checkbox();
  cbChecked.SetChecked(true);
  const sw = Switch();
  
  // Wire them together for fun
  cb.element.addEventListener("change", (e) => {
    sw.SetChecked((e.target as HTMLInputElement).checked);
  });
  sw.element.addEventListener("change", (e) => {
    cb.SetChecked((e.target as HTMLInputElement).checked);
  });
  EndAutoBind(); // tRow

  // Radio
  Text("Radio Buttons").SetTextSize(20);
  const rRow = Layout("Linear");
  rRow.element.style.flexDirection = "row";
  rRow.element.style.gap = "16px";
  Radio("group1", "val1", "Option 1").SetChecked(true);
  Radio("group1", "val2", "Option 2");
  Radio("group1", "val3");
  EndAutoBind(); // rRow

  // Search
  Text("Search").SetTextSize(20);
  SearchBar();
  
  const searchBtn = Button("Open Search View");
  const sv = SearchView();
  searchBtn.SetOnClick(() => sv.Open());

  // Date and Time Pickers
  Text("Date & Time Pickers").SetTextSize(20);
  const dpBtn = Button("Show Modal Date Picker");
  const dp = DatePicker();
  dpBtn.SetOnClick(() => dp.Show());
  
  Text("Docked Date Picker (Inline)");
  DockedDatePicker();
  
  const tpBtn = Button("Show Time Picker");
  const tp = TimePicker();
  tpBtn.SetOnClick(() => tp.Show());

  EndAutoBind(); // End /components/inputs
}
