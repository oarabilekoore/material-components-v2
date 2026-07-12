import { CreateLayout, AddText } from "../../packages/core/index.ts";
import { Dialog } from "../../packages/mui/index.ts";
import { AddButton, AddSnackbar, AddDialog, AddBottomSheet, AddSideSheet, AddTooltip, AddMenu } from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";

export function CreateFeedbackDemoPage() {
  const page = CreateLayout("Linear", "FillXY");
  page.element.style.alignItems = "flex-start";
  page.element.style.gap = "24px";
  
  AddText(page, "Feedback Elements").SetFontSize("2rem").SetFontWeight(600).SetColor("var(--md-primary)");
  AddText(page, "Dialogs, Snackbars, and Tooltips.").SetFontSize("1rem").SetColor("var(--md-on-surface-variant)");

  // Dialogs
  const dialogSection = CreateLayout("Linear");
  dialogSection.element.style.gap = "16px";
  AddText(dialogSection, "Dialogs").SetFontSize("1.5rem").SetFontWeight(500);
  
  const dialogBtn = AddButton(dialogSection, "Show Basic Dialog", "filled");
  
  const basicDialog = new Dialog("basic");
  basicDialog.SetTitle("Dialog Title");
  basicDialog.SetContent("This is a basic dialog with some supporting text to explain its purpose.");
  basicDialog.SetIcon(Icons.menu);
  
  // Note: AddDialog creates the element. To show it, we call Show().
  // AddDialog does not immediately display if it's structured properly, or maybe we append it to body.
  // Actually, Dialog automatically appends itself to document.body when shown, or is controlled via Show().
  
  dialogBtn.SetOnClick(() => {
    basicDialog.Show();
  });

  page.AddChild(dialogSection);

  // Snackbars
  const snackSection = CreateLayout("Linear");
  snackSection.element.style.gap = "16px";
  AddText(snackSection, "Snackbars").SetFontSize("1.5rem").SetFontWeight(500);
  
  const snackRow = CreateLayout("Linear");
  snackRow.element.style.flexDirection = "row";
  snackRow.element.style.gap = "16px";

  const snackBtnSingle = AddButton(snackRow, "Single Line Snackbar", "elevated");
  snackBtnSingle.SetOnClick(() => {
    AddSnackbar("Message sent.");
  });

  const snackBtnAction = AddButton(snackRow, "Snackbar with Action", "elevated");
  snackBtnAction.SetOnClick(() => {
    const snack = AddSnackbar("Message deleted.", "Undo", () => {
      console.log("Undo clicked");
      snack.Hide();
    });
  });
  
  snackSection.AddChild(snackRow);
  page.AddChild(snackSection);

  // Sheets
  const sheetSection = CreateLayout("Linear");
  sheetSection.element.style.gap = "16px";
  AddText(sheetSection, "Sheets").SetFontSize("1.5rem").SetFontWeight(500);
  
  const sheetRow = CreateLayout("Linear");
  sheetRow.element.style.flexDirection = "row";
  sheetRow.element.style.gap = "16px";
  
  const bSheetBtn = AddButton(sheetRow, "Show Bottom Sheet", "elevated");
  const bSheet = AddBottomSheet(page);
  bSheet.SetContent("This is the content of the bottom sheet.");
  bSheetBtn.SetOnClick(() => bSheet.Show());

  const sSheetBtn = AddButton(sheetRow, "Show Side Sheet", "elevated");
  const sSheet = AddSideSheet(page);
  sSheet.SetTitle("Side Sheet");
  sSheetBtn.SetOnClick(() => sSheet.Show());
  
  sheetSection.AddChild(sheetRow);
  page.AddChild(sheetSection);

  // Menu & Tooltip
  const miscSection = CreateLayout("Linear");
  miscSection.element.style.gap = "16px";
  AddText(miscSection, "Menus & Tooltips").SetFontSize("1.5rem").SetFontWeight(500);
  
  const miscRow = CreateLayout("Linear");
  miscRow.element.style.flexDirection = "row";
  miscRow.element.style.gap = "16px";

  const tBtn = AddButton(miscRow, "Hover me", "outlined");
  AddTooltip(tBtn, "This is a tooltip!");

  const mBtn = AddButton(miscRow, "Open Menu", "outlined");
  const menu = AddMenu(miscRow);
  menu.SetAnchor(mBtn);
  menu.AddItem("Item 1", () => console.log("Item 1"), Icons.add);
  menu.AddItem("Item 2", () => console.log("Item 2"), Icons.check);
  mBtn.SetOnClick(() => menu.Show());

  miscSection.AddChild(miscRow);
  page.AddChild(miscSection);

  return page;
}
