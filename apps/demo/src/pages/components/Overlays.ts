import { Layout, Text, EndAutoBind } from "../../../../../packages/core/index.ts";
import { Dialog, Menu, BottomSheet, SideSheet, Snackbar, Tooltip, Button, Icons } from "../../../../../packages/mui/index.ts";
import type { DialogType } from "../../../../../packages/mui/src/theme.ts";

export function CreateOverlays() {
  Layout("Linear", "Fit", "/components/overlays");
  
  Text("Overlays").SetTextSize(24).SetTextColor("var(--core-primary)");
  
  Text("Note: Overlay components (Dialog, Menu, Snackbar, BottomSheet, SideSheet, Tooltip) are documented exceptions to the standard auto-bind rule. Since they must portal to the top level of the DOM and float above all content, they manage their own DOM mounting independently. They do not accept child content via the standard layout stack, but instead provide explicit `SetContent` or `AddItem` APIs per the framework specification.").SetTextSize(14).SetTextColor("var(--core-on-surface-variant)");
  
  // Dialog
  Text("Dialogs").SetTextSize(20);
  const dialogTypes: Record<DialogType, true> = {
    basic: true,
    "full-screen": true
  };
  const dRow = Layout("Linear");
  dRow.element.style.flexDirection = "row";
  dRow.element.style.gap = "8px";
  Object.keys(dialogTypes).forEach(type => {
    const dialog = Dialog(type as DialogType);
    dialog.SetTitle(`Dialog (${type})`);
    dialog.SetContent("This is the dialog content.");
    Button(`Show ${type} Dialog`).SetOnClick(() => dialog.Show());
  });
  EndAutoBind(); // dRow

  // Menu
  Text("Menu").SetTextSize(20);
  const menuContainer = Layout("Linear");
  const menuBtn = Button("Show Menu");
  const menu = Menu();
  menu.AddItem("Item 1", () => {}, Icons.check);
  menu.AddItem("Item 2", () => {}, Icons.close);
  menu.SetAnchor(menuBtn);
  menuBtn.SetOnClick(() => menu.Show());
  EndAutoBind(); // menuContainer

  // BottomSheet
  Text("Bottom Sheet").SetTextSize(20);
  const bs = BottomSheet();
  bs.element.innerHTML = "Bottom Sheet Content";
  Button("Show Bottom Sheet").SetOnClick(() => bs.Show());

  // SideSheet
  Text("Side Sheet").SetTextSize(20);
  const ss = SideSheet("Side Sheet", "modal");
  ss.element.innerHTML = "Side Sheet Content";
  Button("Show Side Sheet").SetOnClick(() => ss.Show());

  // Snackbar
  Text("Snackbar").SetTextSize(20);
  const sb = Snackbar("This is a snackbar message!", "Dismiss", () => sb.Hide());
  Button("Show Snackbar").SetOnClick(() => sb.Show());

  // Tooltip
  Text("Tooltip").SetTextSize(20);
  const ttBtn = Button("Hover or Focus Me");
  Tooltip(ttBtn, "This is a helpful tooltip!");

  EndAutoBind(); // End /components/overlays
}
