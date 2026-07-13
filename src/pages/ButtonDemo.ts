import { CreateLayout, AddText, SetTheme } from "../../packages/core/index.ts";
import {
  AddButton,
  AddFab,
  AddExtendedFab,
  AddIconButton,
  AddSegmentedButton,
  AddSplitButton,
  AddFabMenu,
  AddShimmer,
  SetThemeMode,
} from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";

export function CreateButtonDemoPage() {
  const page = CreateLayout("Linear", "FillXY");
  page.element.style.alignItems = "flex-start";
  page.element.style.gap = "24px";

  AddText(page, "Buttons & FABs")
    .SetFontSize("2rem")
    .SetFontWeight(600)
    .SetColor("var(--md-primary)");
  AddText(page, "A collection of interactive button elements.")
    .SetFontSize("1rem")
    .SetColor("var(--md-on-surface-variant)");

  // Standard Buttons Section
  const btnSection = CreateLayout("Linear");
  btnSection.element.style.gap = "16px";
  AddText(btnSection, "Standard Buttons")
    .SetFontSize("1.5rem")
    .SetFontWeight(500);
  const sh = AddShimmer(btnSection).SetAnimation("static");
  const btnRow = CreateLayout("Linear");
  btnRow.element.style.flexDirection = "row";
  btnRow.element.style.gap = "16px";
  btnRow.element.style.flexWrap = "wrap";

  AddButton(btnRow, "Elevated", "elevated").SetOnTouch(() => {
    SetThemeMode("dark");
  });
  AddButton(btnRow, "Filled", "filled");
  AddButton(btnRow, "Tonal", "filled-tonal");
  AddButton(btnRow, "Outlined", "outlined");
  AddButton(btnRow, "Text", "text");

  btnSection.AddChild(btnRow);
  page.AddChild(btnSection);

  // FAB Section
  const fabSection = CreateLayout("Linear");
  fabSection.element.style.gap = "16px";
  AddText(fabSection, "Floating Action Buttons")
    .SetFontSize("1.5rem")
    .SetFontWeight(500);

  const fabRow = CreateLayout("Linear");
  fabRow.element.style.flexDirection = "row";
  fabRow.element.style.gap = "16px";
  fabRow.element.style.alignItems = "center";

  AddFab(fabRow, Icons.add, "small");
  AddFab(fabRow, Icons.add, "medium");
  AddFab(fabRow, Icons.add, "large");

  fabSection.AddChild(fabRow);
  page.AddChild(fabSection);

  // Icon Button Section
  const iconBtnSection = CreateLayout("Linear");
  iconBtnSection.element.style.gap = "16px";
  AddText(iconBtnSection, "Icon Buttons")
    .SetFontSize("1.5rem")
    .SetFontWeight(500);

  const iconBtnRow = CreateLayout("Linear");
  iconBtnRow.element.style.flexDirection = "row";
  iconBtnRow.element.style.gap = "16px";

  AddIconButton(iconBtnRow, Icons.menu);
  AddIconButton(iconBtnRow, Icons.search);
  AddIconButton(iconBtnRow, Icons.check);

  iconBtnSection.AddChild(iconBtnRow);
  page.AddChild(iconBtnSection);

  // Extended FAB Section
  const efabSection = CreateLayout("Linear");
  efabSection.element.style.gap = "16px";
  AddText(efabSection, "Extended FAB").SetFontSize("1.5rem").SetFontWeight(500);
  const efabRow = CreateLayout("Linear");
  efabRow.element.style.flexDirection = "row";
  efabRow.element.style.gap = "16px";
  AddExtendedFab(efabRow, Icons.add, "Compose");
  efabSection.AddChild(efabRow);
  page.AddChild(efabSection);

  // Segmented Button Section
  const segmentedSection = CreateLayout("Linear");
  segmentedSection.element.style.gap = "16px";
  AddText(segmentedSection, "Segmented Button")
    .SetFontSize("1.5rem")
    .SetFontWeight(500);
  const segRow = CreateLayout("Linear");
  segRow.element.style.flexDirection = "row";
  segRow.element.style.gap = "16px";
  const segBtn = AddSegmentedButton(segRow, true);
  segBtn.AddSegment("Day");
  segBtn.AddSegment("Week");
  segBtn.AddSegment("Month");
  segmentedSection.AddChild(segRow);
  page.AddChild(segmentedSection);

  // Split Button Section
  const splitSection = CreateLayout("Linear");
  splitSection.element.style.gap = "16px";
  AddText(splitSection, "Split Button")
    .SetFontSize("1.5rem")
    .SetFontWeight(500);
  const splitRow = CreateLayout("Linear");
  splitRow.element.style.flexDirection = "row";
  splitRow.element.style.gap = "16px";
  const splitBtn = AddSplitButton(splitRow, "Reply", "filled");
  splitBtn.SetOnPrimaryClick(() => console.log("reply"));
  splitSection.AddChild(splitRow);
  page.AddChild(splitSection);

  // Fab Menu Section
  const fabMenuSection = CreateLayout("Linear");
  fabMenuSection.element.style.gap = "16px";
  fabMenuSection.element.style.paddingBottom = "64px";
  AddText(fabMenuSection, "Fab Menu").SetFontSize("1.5rem").SetFontWeight(500);
  const fabMenuRow = CreateLayout("Linear");
  fabMenuRow.element.style.flexDirection = "row";
  fabMenuRow.element.style.gap = "16px";
  const fmenu = AddFabMenu(fabMenuRow, Icons.add);
  fmenu.SetShapeMorph(true);
  fmenu.AddItem(Icons.check, "Done", () => console.log("done"));
  fmenu.AddItem(Icons.search, "Search", () => console.log("search"));
  fabMenuSection.AddChild(fabMenuRow);
  page.AddChild(fabMenuSection);

  return page;
}
