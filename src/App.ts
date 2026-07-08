/*
 * Test app entry point – demonstrates all Material 3 components.
 */
import * as app from "../packages/core/index.ts";
import * as ui from "../packages/mui/index.ts";

let root: ReturnType<typeof app.CreateLayout> | null = null;
let dialog: ui.Dialog | null = null;
let snackbar: ui.Snackbar | null = null;
let bottomSheet: ui.BottomSheet | null = null;
let drawer: ui.NavigationDrawer | null = null;
let menu: ui.Menu | null = null;

function OnStart() {
  ui.SetThemeMode("dark");

  root = app.CreateLayout("Linear", "FillXY");
  root.SetBackColor(ui.GetTheme().surface);

  // --- Top App Bar (stays fixed, outside the scroller) ---
  const topAppBar = ui.AddTopAppBar(root, "Material 3 Showcase", "large");

  // --- Navigation Bar (also fixed) ---
  const navBar = ui.AddNavigationBar(root);
  navBar.AddItem("home", "Home", "home");
  navBar.AddItem("explore", "Explore", "explore");
  navBar.AddItem("person", "Profile", "profile");

  // --- Scrollable body: everything else lives in here ---
  const scroller = app.AddScroller(root, -1, -1, "FillX,Vertical");
  const body = app.CreateLayout("Linear");
  scroller.AddChild(body);

  topAppBar.AttachScrollable(scroller.element);

  // --- Buttons ---
  const btnGroup = app.CreateLayout("Linear", "Wrap");
  btnGroup.SetSize(-1, -1);
  btnGroup.SetMargins(8);
  body.AddChild(btnGroup);

  ui.AddButton(btnGroup, "Elevated", "elevated");
  ui.AddButton(btnGroup, "Filled", "filled");
  ui.AddButton(btnGroup, "Tonal", "filled-tonal");
  ui.AddButton(btnGroup, "Outlined", "outlined");
  ui.AddButton(btnGroup, "Text", "text");

  // --- Segmented Button ---
  const segButton = ui.AddSegmentedButton(body, false);
  segButton.AddSegment("Day", "day", "lightmode");
  segButton.AddSegment("Night", "night", "darkmode");
  segButton.SetOnSelect((idx, val) => console.log("Segment:", val));

  // --- Card ---
  const card = ui.AddCard(body, "elevated");
  card.SetHeader("Card Title");
  card.SetContent("This is a Material 3 card. You can put any content here.");
  card.SetOnClick(() => console.log("Card clicked"));

  // --- FAB ---
  ui.AddFab(body, "add", "medium");

  // --- IconButton & Tooltip ---
  const iconRow = app.CreateLayout("Linear", "Horizontal");
  iconRow.SetSize(-1, -1);
  body.AddChild(iconRow);

  const favBtn = ui.AddIconButton(iconRow, "favorite");
  ui.CreateTooltip(favBtn, "Add to favorites");
  ui.AddIconButton(iconRow, "search");
  ui.AddIconButton(iconRow, "settings");

  // --- Menu ---
  menu = ui.CreateMenu();
  menu.AddItem(
    "Profile Settings",
    () => console.log("Menu: Profile"),
    "person",
  );
  menu.AddItem("App Preferences", () => console.log("Menu: Prefs"), "settings");
  const menuBtn = ui.AddButton(btnGroup, "Open Menu", "outlined");
  menuBtn.SetOnClick(() => {
    menu?.ShowAtElement(menuBtn.element);
  });

  const radioGroup = ui.AddRadio(body, "options", "opt1", "Option Alpha");
  radioGroup.SetOnChange((checked, val) => console.log("Radio:", val));

  const sw = ui.AddSwitch(body);
  sw.SetOnChange((checked) => console.log("Switch:", checked));

  // --- Progress Indicators & Badge ---
  const linearProg = ui.AddLinearProgress(body);
  linearProg.SetProgress(65);

  const circProg = ui.AddCircularProgress(body);
  circProg.SetProgress(null); // Indeterminate

  const badgeAnchor = ui.AddButton(btnGroup, "Notifications", "text");
  ui.AddBadge(badgeAnchor.element, "large", "5");
  // --- Extended FAB ---
  ui.AddExtendedFab(root, "edit", "Compose", "medium").SetOnClick(() =>
    console.log("compose"),
  );

  // --- FAB Menu (fixed overlay, bottom-right) ---
  const fabMenu = ui.CreateFabMenu("add", "close");
  fabMenu.AddItem("photo_camera", "Photo", () => console.log("photo"));
  fabMenu.AddItem("mic", "Voice note", () => console.log("voice"));
  fabMenu.AddItem("edit_note", "Text note", () => console.log("text"));
  // --- Divider ---
  ui.AddDivider(body);

  // --- Dialogs ---
  const dialogHeading = app.AddText(body, "Dialogs");
  dialogHeading
    .SetTextColor(ui.GetTheme().onSurface)
    .SetTextSize(20)
    .SetMargins(0, 16, 0, 8);

  const dialogRow = app.CreateLayout("Linear", "Horizontal,Wrap");
  body.AddChild(dialogRow);

  // Alert dialog — Basic type, icon + neutral/negative/positive actions
  const alertBtn = ui.AddButton(dialogRow, "Alert dialog", "outlined");
  alertBtn.SetOnClick(() => {
    dialog = ui.CreateDialog("basic");
    dialog.SetIcon("warning");
    dialog.SetTitle("Delete photo?");
    dialog.SetContent("This action can't be undone once confirmed.");
    dialog.AddAction("Cancel", () => dialog?.Close());
    dialog.AddAction("Learn more", () => console.log("learn more clicked"));
    dialog.AddAction("Delete", () => {
      console.log("deleted");
      dialog?.Close();
    });
    dialog.SetOnCancel(() => console.log("alert dismissed via scrim/escape"));
    dialog.Show();
  });

  // Confirmation dialog — Basic type, custom content
  const confirmBtn = ui.AddButton(dialogRow, "Confirmation dialog", "outlined");
  confirmBtn.SetOnClick(() => {
    dialog = ui.CreateDialog("basic");
    dialog.SetTitle("Choose ringtone");

    const options = app.CreateLayout("Linear");
    const ringtoneRadio = ui.AddRadio(options, "ringtone", "chime", "Chime");
    dialog.AddContent(options);

    dialog.AddAction("Cancel", () => dialog?.Close());
    dialog.AddAction("OK", () => {
      console.log("confirmed:", ringtoneRadio.IsChecked());
      dialog?.Close();
    });
    dialog.Show();
  });

  // Full-screen dialog — header with close icon + single confirm action
  const fullscreenBtn = ui.AddButton(
    dialogRow,
    "Full-screen dialog",
    "outlined",
  );
  fullscreenBtn.SetOnClick(() => {
    dialog = ui.CreateDialog("full-screen");
    dialog.SetTitle("New event");
    dialog.AddAction("Save", () => {
      console.log("event saved");
      dialog?.Close();
    });

    const form = app.CreateLayout("Linear");
    ui.AddTextField(form, "Event title").SetMargins(0, 0, 0, 16);
    ui.AddTextField(form, "Location").SetMargins(0, 0, 0, 16);
    ui.AddTextField(form, "Description");
    dialog.AddContent(form);

    dialog.Show();
  });

  // Mount the root layout
  app.MountRoot(root);
}

function OnBack(): boolean {
  console.log("back pressed — showing confirm dialog");
  return confirm("Are you sure you want to go back?");
}

function OnPause() {
  console.log("app paused — tab hidden or minimized");
}

function OnResume() {
  console.log("app resumed — tab visible again");
}

function OnConfig() {
  console.log("viewport resized or orientation changed");
  root?.Resize();
}

export default { OnStart, OnBack, OnPause, OnResume, OnConfig };
