import { CreateLayout, AddText } from "../../packages/core/index.ts";
import {
  AddButton,
  AddIconButton,
  AddFab,
  AddExtendedFab,
  AddFabMenu,
  AddSegmentedButton,
  AddSplitButton,
} from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";
import { PageHeader, Section, Row, Labeled, Caption, Style } from "./_shared.ts";

export function CreateActionsPage() {
  const page = CreateLayout("Linear", "FillX");
  Style(page, { alignItems: "stretch", gap: "24px" });

  PageHeader(page, "Actions", "Buttons, floating action buttons, and grouped controls — every variant the library ships.");

  // ---------------------------------------------------------------- Buttons
  const buttons = Section(page, "Buttons", "Five emphasis levels, from highest to lowest.");
  const btnRow = Row(buttons);
  (["elevated", "filled", "filled-tonal", "outlined", "text"] as const).forEach((variant) => {
    const slot = Labeled(btnRow, variant);
    AddButton(slot, variant.replace("-", " "), variant);
  });

  // ------------------------------------------------------------ IconButton
  const iconButtons = Section(page, "Icon Buttons", "Compact actions for toolbars and cards.");
  const iconRow = Row(iconButtons);
  [Icons.menu, Icons.search, Icons.check, Icons.close].forEach((icon, i) => {
    const slot = Labeled(iconRow, ["Menu", "Search", "Confirm", "Close"][i]);
    AddIconButton(slot, icon);
  });

  // ------------------------------------------------------------------- FAB
  const fabs = Section(page, "Floating Action Button", "Three sizes for the single most important action on a screen.");
  const fabRow = Row(fabs);
  (["small", "medium", "large"] as const).forEach((size) => {
    const slot = Labeled(fabRow, size);
    AddFab(slot, Icons.add, size);
  });

  // ---------------------------------------------------------- Extended FAB
  const extended = Section(page, "Extended FAB", "Icon plus a label; can collapse to an icon-only FAB.");
  const extRow = Row(extended);
  const extSlot = Labeled(extRow, "Extended \u2194 collapsed");
  const efab = AddExtendedFab(extSlot, Icons.add, "Compose");
  const toggleSlot = Labeled(extRow, "toggle state");
  AddButton(toggleSlot, "Toggle", "outlined").SetOnClick(() => {
    if (efab.IsExtended()) efab.Shrink();
    else efab.Extend();
  });

  // -------------------------------------------------------------- FAB Menu
  const fabMenu = Section(page, "FAB Menu", "Speed-dial menu that morphs open from a FAB. Pinned to the bottom-right of the viewport.");
  const fabMenuRow = Row(fabMenu);
  const fmSlot = Labeled(fabMenuRow, "shape-morphing");
  const fm = AddFabMenu(fmSlot, Icons.add, Icons.close);
  fm.SetShapeMorph(true);
  fm.AddItem(Icons.check, "Approve", () => console.log("approve"));
  fm.AddItem(Icons.search, "Inspect", () => console.log("inspect"));

  // ------------------------------------------------------------- Segmented
  const segmented = Section(page, "Segmented Buttons", "Single-select and multi-select variants.");
  const segRow = Row(segmented);

  const singleSlot = Labeled(segRow, "single-select");
  const single = AddSegmentedButton(singleSlot, false);
  single.AddSegment("Day");
  single.AddSegment("Week");
  single.AddSegment("Month");

  const multiSlot = Labeled(segRow, "multi-select");
  const multi = AddSegmentedButton(multiSlot, true);
  multi.AddSegment("Bold");
  multi.AddSegment("Italic");
  multi.AddSegment("Underline");

  // ---------------------------------------------------------------- Split
  const split = Section(page, "Split Button", "Primary action with an attached menu for secondary actions.");
  const splitRow = Row(split);
  const splitSlot = Labeled(splitRow, "filled");
  const splitBtn = AddSplitButton(splitSlot, "Reply", "filled");
  splitBtn.SetOnPrimaryClick(() => console.log("reply"));
  splitBtn.SetOnSecondaryClick(() => console.log("reply options"));

  return page;
}
