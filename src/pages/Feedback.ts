import { CreateLayout, AddText } from "../../packages/core/index.ts";
import {
  Dialog,
  AddButton,
  AddSnackbar,
  AddBottomSheet,
  AddSideSheet,
  AddTooltip,
  AddMenu,
} from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";
import { PageHeader, Section, Row, Labeled, Style } from "./_shared.ts";

export function CreateFeedbackPage() {
  const page = CreateLayout("Linear", "FillX");
  Style(page, { alignItems: "stretch", gap: "24px" });

  PageHeader(page, "Feedback & Overlays", "Dialogs, transient messages, sheets, and popovers that sit above the page.");

  // ------------------------------------------------------------- Dialogs
  const dialogs = Section(page, "Dialogs", "Basic (centered) and full-screen.");
  const dialogRow = Row(dialogs);

  const basicSlot = Labeled(dialogRow, "basic");
  const basicDialog = new Dialog("basic");
  basicDialog.SetIcon(Icons.check);
  basicDialog.SetTitle("Delete file?");
  basicDialog.SetContent("This action can't be undone. The file will be permanently removed.");
  basicDialog.AddAction("Cancel", () => basicDialog.Close());
  basicDialog.AddAction("Delete", () => basicDialog.Close());
  AddButton(basicSlot, "Open dialog", "filled").SetOnClick(() => basicDialog.Show());

  const fullSlot = Labeled(dialogRow, "full-screen");
  const fullDialog = new Dialog("full-screen");
  fullDialog.SetTitle("Edit profile");
  fullDialog.SetContent("Full-screen dialogs take over the whole viewport \u2014 useful for focused editing flows on small screens.");
  fullDialog.AddAction("Save", () => fullDialog.Close());
  AddButton(fullSlot, "Open full-screen", "outlined").SetOnClick(() => fullDialog.Show());

  // ------------------------------------------------------------ Snackbar
  const snackbars = Section(page, "Snackbars", "Brief, non-blocking status messages, with or without an action.");
  const snackRow = Row(snackbars);

  const plainSlot = Labeled(snackRow, "message only");
  AddButton(plainSlot, "Show snackbar", "elevated").SetOnClick(() => {
    AddSnackbar("Changes saved.");
  });

  const actionSlot = Labeled(snackRow, "with action");
  AddButton(actionSlot, "Show with undo", "elevated").SetOnClick(() => {
    const snack = AddSnackbar("Conversation archived.", "Undo", () => snack.Hide());
  });

  // -------------------------------------------------------------- Sheets
  const sheets = Section(page, "Sheets", "Bottom sheet, plus standard and modal side sheets.");
  const sheetRow = Row(sheets);

  const bottomSlot = Labeled(sheetRow, "bottom sheet");
  const bSheet = AddBottomSheet(page);
  bSheet.SetContent("Bottom sheets surface supplementary content or actions without leaving the current screen.");
  AddButton(bottomSlot, "Open bottom sheet", "elevated").SetOnClick(() => bSheet.Show());

  const modalSideSlot = Labeled(sheetRow, "side sheet \u2014 modal");
  const modalSheet = AddSideSheet(page, "Details", "modal");
  modalSheet.SetContent("Modal side sheets sit above the content with a scrim, like a drawer for detail views.");
  AddButton(modalSideSlot, "Open modal sheet", "elevated").SetOnClick(() => modalSheet.Show());

  const standardSideSlot = Labeled(sheetRow, "side sheet \u2014 standard");
  const standardSheet = AddSideSheet(page, "Filters", "standard");
  standardSheet.SetContent("Standard side sheets push adjacent content aside instead of floating above it.");
  AddButton(standardSideSlot, "Open standard sheet", "elevated").SetOnClick(() => standardSheet.Show());

  // ---------------------------------------------------------- Menu / tip
  const popovers = Section(page, "Tooltip & Menu", "Anchored popovers for hints and contextual actions.");
  const popRow = Row(popovers);

  const tipSlot = Labeled(popRow, "tooltip (hover)");
  const tipBtn = AddButton(tipSlot, "Hover me", "outlined");
  AddTooltip(tipBtn, "This action can't be undone");

  const menuSlot = Labeled(popRow, "menu (click)");
  const menuBtn = AddButton(menuSlot, "Open menu", "outlined");
  const menu = AddMenu(menuSlot);
  menu.SetAnchor(menuBtn);
  menu.AddItem("Rename", () => console.log("rename"), Icons.check);
  menu.AddItem("Duplicate", () => console.log("duplicate"), Icons.add);
  menu.AddItem("Delete", () => console.log("delete"), Icons.close);
  menuBtn.SetOnClick(() => menu.Show());

  return page;
}
