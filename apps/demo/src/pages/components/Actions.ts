import { Layout, Text, EndAutoBind } from "../../../../../packages/core/index.ts";
import { Button, IconButton, SegmentedButton, SplitButton, Fab, FabMenu, ExtendedFab, Icons } from "../../../../../packages/mui/index.ts";
import type { ButtonVariant, FabSize } from "../../../../../packages/mui/src/theme.ts";

export function CreateActions() {
  Layout("Linear", "Fit", "/components/actions");
  
  Text("Actions").SetTextSize(24).SetTextColor("var(--core-primary)");
  
  // Buttons
  Text("Common Buttons").SetTextSize(20);
  const buttonVariants: Record<ButtonVariant, true> = {
    filled: true,
    elevated: true,
    outlined: true,
    text: true,
    "filled-tonal": true
  };
  const bRow = Layout("Linear");
  bRow.element.style.flexDirection = "row";
  bRow.element.style.gap = "8px";
  bRow.element.style.flexWrap = "wrap";
  Object.keys(buttonVariants).forEach(variant => {
    Button(`Button (${variant})`, variant as ButtonVariant);
  });
  EndAutoBind(); // bRow

  // Icon Buttons
  Text("Icon Buttons").SetTextSize(20);
  const iconRow = Layout("Linear");
  iconRow.element.style.flexDirection = "row";
  iconRow.element.style.gap = "8px";
  IconButton(Icons.add);
  IconButton(Icons.close);
  EndAutoBind(); // iconRow

  // Segmented Button
  Text("Segmented Button").SetTextSize(20);
  const segmented = SegmentedButton();
  segmented.AddSegment("Day");
  segmented.AddSegment("Week");
  segmented.AddSegment("Month");

  // SplitButton
  Text("Split Button").SetTextSize(20);
  SplitButton("Publish", "filled", Icons.add);

  // FAB
  Text("FABs").SetTextSize(20);
  const fabSizes: Record<FabSize, true> = {
    small: true,
    medium: true,
    large: true
  };
  const fRow = Layout("Linear");
  fRow.element.style.flexDirection = "row";
  fRow.element.style.gap = "16px";
  fRow.element.style.alignItems = "center";
  Object.keys(fabSizes).forEach(size => {
    Fab(Icons.add, size as FabSize);
  });
  EndAutoBind(); // fRow

  // Extended FAB
  Text("Extended FAB").SetTextSize(20);
  ExtendedFab("Create", Icons.add);

  // FabMenu
  Text("FAB Menu").SetTextSize(20);
  const fmenu = FabMenu();
  fmenu.AddItem(Icons.add, "Edit", () => {});
  fmenu.AddItem(Icons.close, "Delete", () => {});

  // Morph Example for Actions
  Text("Morph Example").SetTextSize(20);
  const morphBtn = Button("I'm Filled on Mobile, Outlined on Desktop", "filled");
  morphBtn.Morph({
    Compact: { SetStyle: [{ backgroundColor: "var(--core-primary)", color: "var(--core-on-primary)" }] }, // Like filled
    Expanded: { SetStyle: [{ backgroundColor: "transparent", border: "1px solid var(--core-outline)", color: "var(--core-primary)" }] } // Like outlined
  });

  EndAutoBind(); // End /components/actions
}
