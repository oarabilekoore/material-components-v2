/*
 * Demo App – Material Design 3 Component Showcase
 * Displays all components with live interactions and a theme toggle.
 */
import * as app from "../packages/core/index.ts";
import * as ui from "../packages/mui/index.ts";

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------
const themeMode = app.CreateSignal<"light" | "dark">("dark");
let dialog: ui.Dialog | null = null;
let bottomSheet: ui.BottomSheet | null = null;
let snackbar: ui.Snackbar | null = null;
let drawer: ui.NavigationDrawer | null = null;
let menu: ui.Menu | null = null;

// -----------------------------------------------------------------------------
// Helper: create a section with title and description
// -----------------------------------------------------------------------------
function createSection(
  parent: app.LayoutElement,
  title: string,
  description: string,
): app.LayoutElement {
  const section = app.CreateLayout("Linear");
  section.SetMargins(0, 24, 0, 12);
  parent.AddChild(section);

  const heading = app.AddText(section, title);
  heading.SetTextColor(ui.GetTheme().onSurface);
  heading.SetTextSize(20);
  heading.SetMargins(0, 0, 0, 4);

  const desc = app.AddText(section, description);
  desc.SetTextColor(ui.GetTheme().onSurfaceVariant);
  desc.SetTextSize(14);
  desc.SetMargins(0, 0, 0, 12);

  // Horizontal separator – use ui.CreateDivider (MUI component)
  const divider = ui.CreateDivider();
  divider.element.style.margin = "8px 0 12px 0";
  section.AddChild(divider);

  return section;
}

// -----------------------------------------------------------------------------
// Main entry
// -----------------------------------------------------------------------------
function OnStart() {
  // Apply initial theme
  ui.SetThemeMode(themeMode.Get());

  // Root layout (fills screen, vertical)
  const root = app.CreateLayout("Linear", "FillXY,Vertical");
  root.SetBackColor(ui.GetTheme().surface);

  // ---------------------------------------------------------------------------
  // Top App Bar (fixed, outside scroller)
  // ---------------------------------------------------------------------------
  const appBar = ui.AddTopAppBar(root, "M3 Component Showcase", "large");

  // Theme toggle icon in the actions area
  const themeIcon = ui.CreateAppBarIcon(
    themeMode.Get() === "dark" ? "dark_mode" : "light_mode",
    () => {
      const newMode = themeMode.Get() === "dark" ? "light" : "dark";
      themeMode.Set(newMode);
      ui.SetThemeMode(newMode);
      // Update the icon
      themeIcon.element.textContent =
        newMode === "dark" ? "dark_mode" : "light_mode";
      // Update root background
      root.SetBackColor(ui.GetTheme().surface);
    },
  );
  appBar.AddAction(themeIcon);

  // ---------------------------------------------------------------------------
  // Main scrollable body
  // ---------------------------------------------------------------------------
  const scroller = app.AddScroller(root, -1, -1, "FillX,Vertical");
  const body = app.CreateLayout("Linear", "FillX");
  scroller.AddChild(body);

  // Attach scroll behavior to app bar
  appBar.AttachScrollable(scroller.element);

  // ---------------------------------------------------------------------------
  // BUTTONS
  // ---------------------------------------------------------------------------
  const btnSection = createSection(
    body,
    "Buttons",
    "All Material 3 button variants.",
  );
  const btnRow = app.CreateLayout("Linear", "Horizontal,Wrap");
  btnRow.SetMargins(0, 0, 0, 8);
  btnSection.AddChild(btnRow);

  const variants: ui.ButtonVariant[] = [
    "elevated",
    "filled",
    "filled-tonal",
    "outlined",
    "text",
  ];
  for (const v of variants) {
    const btn = ui.AddButton(btnRow, v.charAt(0).toUpperCase() + v.slice(1), v);
    btn.SetMargins(4, 4, 4, 4);
    btn.SetOnClick(() => console.log(`${v} button clicked`));
  }

  // ---------------------------------------------------------------------------
  // FABs
  // ---------------------------------------------------------------------------
  const fabSection = createSection(
    body,
    "Floating Action Buttons",
    "Regular, extended, and menu FABs.",
  );
  const fabRow = app.CreateLayout("Linear", "Horizontal,Wrap");
  fabRow.SetMargins(0, 0, 0, 8);
  fabSection.AddChild(fabRow);

  // Regular FAB
  const fab = ui.AddFab(fabRow, "add", "medium");
  fab.SetMargins(4, 4, 4, 4);

  // Extended FAB
  const extFab = ui.AddExtendedFab(fabRow, "edit", "Compose", "medium");
  extFab.SetMargins(4, 4, 4, 4);
  extFab.Extend();

  // FAB Menu (floating, bottom-right, but we place it here for demo)
  const fabMenu = ui.CreateFabMenu("add", "close");
  fabMenu.AddItem("photo_camera", "Photo", () => console.log("Photo"));
  fabMenu.AddItem("mic", "Voice", () => console.log("Voice"));
  fabMenu.AddItem("edit_note", "Note", () => console.log("Note"));
  // We'll open it via a button
  const openFabMenuBtn = ui.AddButton(fabRow, "Open FAB Menu", "outlined");
  openFabMenuBtn.SetMargins(4, 4, 4, 4);
  openFabMenuBtn.SetOnClick(() => fabMenu.Toggle());

  // ---------------------------------------------------------------------------
  // INPUTS
  // ---------------------------------------------------------------------------
  const inputSection = createSection(
    body,
    "Inputs",
    "Text fields, checkboxes, switches, radios, sliders, chips.",
  );
  const inputGrid = app.CreateLayout("Linear", "Horizontal,Wrap");
  inputGrid.SetMargins(0, 0, 0, 8);
  inputSection.AddChild(inputGrid);

  // TextField
  const textField = ui.AddTextField(inputGrid, "Username", "filled");
  textField.SetMargins(4, 4, 4, 4);
  textField.SetPlaceholder("Enter name");
  textField.SetSupportingText("Helper text");
  textField.SetOnChange((val) => console.log("Text:", val));

  const textFieldOutlined = ui.AddTextField(inputGrid, "Email", "outlined");
  textFieldOutlined.SetMargins(4, 4, 4, 4);
  textFieldOutlined.SetPlaceholder("user@example.com");

  // Checkbox
  const cb = ui.AddCheckbox(inputGrid, "Accept terms");
  cb.SetMargins(4, 4, 4, 4);
  cb.SetOnChange((checked) => console.log("Checkbox:", checked));

  // Switch
  const sw = ui.AddSwitch(inputGrid);
  sw.SetMargins(4, 4, 4, 4);
  sw.SetOnChange((checked) => console.log("Switch:", checked));

  // Radio group
  const radioGroup = app.CreateLayout("Linear");
  radioGroup.SetMargins(4, 4, 4, 4);
  inputGrid.AddChild(radioGroup);

  const radio1 = ui.AddRadio(radioGroup, "theme", "dark", "Dark");
  radio1.SetChecked(true);
  const radio2 = ui.AddRadio(radioGroup, "theme", "light", "Light");
  radio2.SetOnChange((checked, val) => console.log("Radio:", val));

  // Slider
  const slider = ui.AddSlider(inputGrid, 0, 100, 50, "continuous");
  slider.SetMargins(4, 4, 4, 4);
  slider.SetSize(200, -1);
  slider.ShowValueLabel();
  slider.SetOnChange((val) => console.log("Slider:", val));

  // Chips
  const chipRow = app.CreateLayout("Linear", "Horizontal,Wrap");
  chipRow.SetMargins(0, 8, 0, 0);
  inputSection.AddChild(chipRow);

  const chipAssist = ui.AddChip(chipRow, "Assist", "assist");
  chipAssist.SetMargins(4, 4, 4, 4);

  const chipFilter = ui.AddChip(chipRow, "Filter", "filter");
  chipFilter.SetMargins(4, 4, 4, 4);
  chipFilter.SetOnSelect((selected) => console.log("Filter chip:", selected));

  const chipInput = ui.AddChip(chipRow, "Input", "input");
  chipInput.SetMargins(4, 4, 4, 4);
  chipInput.SetOnRemove(() => console.log("Input chip removed"));

  const chipSuggestion = ui.AddChip(chipRow, "Suggestion", "suggestion");
  chipSuggestion.SetMargins(4, 4, 4, 4);

  // ---------------------------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------------------------
  const navSection = createSection(
    body,
    "Navigation",
    "Tabs, bottom nav, rail, drawer.",
  );
  const navRow = app.CreateLayout("Linear", "Vertical");
  navRow.SetMargins(0, 0, 0, 8);
  navSection.AddChild(navRow);

  // Tabs
  const tabs = ui.AddTabs(navRow, "primary");
  tabs.SetMargins(0, 0, 0, 12);
  tabs.AddTab("Tab 1");
  tabs.AddTab("Tab 2");
  tabs.AddTab("Tab 3");
  tabs.SetActiveIndex(0);
  tabs.SetOnSelect((idx) => console.log("Tab:", idx));

  // Bottom Navigation Bar (inside demo, not fixed)
  const navBar = ui.AddNavigationBar(navRow);
  navBar.SetMargins(0, 8, 0, 8);
  navBar.AddItem("home", "Home", "home");
  navBar.AddItem("search", "Search", "search");
  navBar.AddItem("person", "Profile", "profile");
  navBar.SetOnSelect((idx, val) => console.log("Nav bar:", val));

  // Navigation Rail (inline, limited height for demo)
  const rail = ui.AddNavigationRail(navRow);
  rail.element.style.height = "200px";
  rail.element.style.width = "100%";
  rail.element.style.flexDirection = "row";
  rail.element.style.paddingTop = "8px";
  rail.AddItem("home", "Home", "home");
  rail.AddItem("favorite", "Fav", "fav");
  rail.AddItem("settings", "Settings", "settings");
  rail.SetOnSelect((idx, val) => console.log("Rail:", val));

  // Navigation Drawer opener
  const drawerBtn = ui.AddButton(navRow, "Open Navigation Drawer", "outlined");
  drawerBtn.SetMargins(0, 8, 0, 0);
  drawerBtn.SetOnClick(() => {
    if (!drawer) {
      drawer = ui.CreateNavigationDrawer("modal");
      drawer.AddItem("Home", "home");
      drawer.AddItem("Profile", "person");
      drawer.AddItem("Settings", "settings");
      drawer.SetOnSelect((idx, label) => console.log("Drawer:", label));
    }
    drawer.Open();
  });

  // ---------------------------------------------------------------------------
  // FEEDBACK
  // ---------------------------------------------------------------------------
  const feedbackSection = createSection(
    body,
    "Feedback",
    "Dialogs, bottom sheets, snackbars, tooltips, menus.",
  );
  const feedbackRow = app.CreateLayout("Linear", "Horizontal,Wrap");
  feedbackRow.SetMargins(0, 0, 0, 8);
  feedbackSection.AddChild(feedbackRow);

  // Dialog
  const dialogBtn = ui.AddButton(feedbackRow, "Alert Dialog", "outlined");
  dialogBtn.SetMargins(4, 4, 4, 4);
  dialogBtn.SetOnClick(() => {
    dialog = ui.CreateDialog("basic");
    dialog.SetIcon("warning");
    dialog.SetTitle("Delete file?");
    dialog.SetContent("This action cannot be undone.");
    dialog.AddAction("Cancel", () => dialog?.Close());
    dialog.AddAction("Delete", () => {
      console.log("Deleted");
      dialog?.Close();
    });
    dialog.SetOnCancel(() => console.log("Dialog dismissed"));
    dialog.Show();
  });

  // Full-screen dialog
  const fsDialogBtn = ui.AddButton(
    feedbackRow,
    "Full-screen Dialog",
    "outlined",
  );
  fsDialogBtn.SetMargins(4, 4, 4, 4);
  fsDialogBtn.SetOnClick(() => {
    dialog = ui.CreateDialog("full-screen");
    dialog.SetTitle("New Event");
    dialog.AddAction("Save", () => {
      console.log("Saved");
      dialog?.Close();
    });
    const form = app.CreateLayout("Linear");
    ui.AddTextField(form, "Title").SetMargins(0, 0, 0, 12);
    ui.AddTextField(form, "Description").SetMargins(0, 0, 0, 12);
    dialog.AddContent(form);
    dialog.Show();
  });

  // BottomSheet
  const sheetBtn = ui.AddButton(feedbackRow, "Bottom Sheet", "outlined");
  sheetBtn.SetMargins(4, 4, 4, 4);
  sheetBtn.SetOnClick(() => {
    bottomSheet = ui.CreateBottomSheet();
    bottomSheet.SetContent("This is a bottom sheet with some content.");
    bottomSheet.Show();
  });

  // Snackbar
  const snackBtn = ui.AddButton(feedbackRow, "Snackbar", "outlined");
  snackBtn.SetMargins(4, 4, 4, 4);
  snackBtn.SetOnClick(() => {
    snackbar = ui.CreateSnackbar("Item deleted", "Undo", () => {
      console.log("Undo");
    });
    snackbar.Show();
  });

  // Tooltip – we'll attach to a button
  const tooltipBtn = ui.AddButton(feedbackRow, "Hover for tooltip", "outlined");
  tooltipBtn.SetMargins(4, 4, 4, 4);
  ui.CreateTooltip(tooltipBtn, "This is a tooltip");

  // Menu
  const menuBtn = ui.AddButton(feedbackRow, "Open Menu", "outlined");
  menuBtn.SetMargins(4, 4, 4, 4);
  menuBtn.SetOnClick(() => {
    if (!menu) {
      menu = ui.CreateMenu();
      menu.AddItem("Copy", () => console.log("Copy"), "content_copy");
      menu.AddItem("Paste", () => console.log("Paste"), "content_paste");
      menu.AddItem("Delete", () => console.log("Delete"), "delete");
    }
    menu.ShowAtElement(menuBtn);
  });

  // ---------------------------------------------------------------------------
  // DISPLAY
  // ---------------------------------------------------------------------------
  const displaySection = createSection(
    body,
    "Display",
    "Cards, lists, dividers, badges.",
  );
  const displayRow = app.CreateLayout("Linear", "Horizontal,Wrap");
  displayRow.SetMargins(0, 0, 0, 8);
  displaySection.AddChild(displayRow);

  // Card
  const card = ui.AddCard(displayRow, "elevated");
  card.SetMargins(4, 4, 4, 4);
  card.SetHeader("Card Title");
  card.SetContent("This is a Material 3 card. You can put any content here.");
  card.SetOnClick(() => console.log("Card clicked"));

  // List
  const listContainer = app.CreateLayout("Linear");
  listContainer.SetMargins(4, 4, 4, 4);
  displayRow.AddChild(listContainer);
  const list = ui.CreateList();
  listContainer.AddChild(list);
  const item1 = ui.CreateListItem("List Item 1");
  item1.SetSupportingText("Supporting text");
  item1.SetLeadingIcon("folder");
  list.element.appendChild(item1.element);
  const item2 = ui.CreateListItem("List Item 2");
  item2.SetTrailingContent(ui.CreateSwitch());
  list.element.appendChild(item2.element);

  // Divider – use ui.CreateDivider
  const divider = ui.CreateDivider();
  divider.element.style.margin = "12px 0";
  displaySection.AddChild(divider);

  // Badge
  const badgeContainer = app.CreateLayout("Linear", "Horizontal,Wrap");
  badgeContainer.SetMargins(0, 8, 0, 0);
  displaySection.AddChild(badgeContainer);
  const badgeAnchor = ui.AddButton(badgeContainer, "Notifications", "text");
  ui.AddBadge(badgeAnchor.element, "large", "5");

  // ---------------------------------------------------------------------------
  // PROGRESS
  // ---------------------------------------------------------------------------
  const progressSection = createSection(
    body,
    "Progress",
    "Linear and circular progress indicators.",
  );
  const progressRow = app.CreateLayout("Linear", "Horizontal,Wrap");
  progressRow.SetMargins(0, 0, 0, 8);
  progressSection.AddChild(progressRow);

  const linearProg = ui.AddLinearProgress(progressRow);
  linearProg.SetMargins(4, 4, 4, 4);
  linearProg.SetSize(200, -1);
  linearProg.SetProgress(65);

  const circProg = ui.AddCircularProgress(progressRow);
  circProg.SetMargins(4, 4, 4, 4);
  circProg.SetProgress(null); // indeterminate

  // ---------------------------------------------------------------------------
  // MISC
  // ---------------------------------------------------------------------------
  const miscSection = createSection(
    body,
    "Miscellaneous",
    "Segmented button, icon buttons.",
  );
  const miscRow = app.CreateLayout("Linear", "Horizontal,Wrap");
  miscRow.SetMargins(0, 0, 0, 8);
  miscSection.AddChild(miscRow);

  // Segmented Button
  const seg = ui.AddSegmentedButton(miscRow, false);
  seg.SetMargins(4, 4, 4, 4);
  seg.AddSegment("Day", "day", "today");
  seg.AddSegment("Week", "week", "week");
  seg.AddSegment("Month", "month", "date_range");
  seg.SetOnSelect((idx, val) => console.log("Segment:", val));

  // Icon Buttons
  const iconBtn1 = ui.AddIconButton(miscRow, "favorite");
  iconBtn1.SetMargins(4, 4, 4, 4);
  iconBtn1.SetOnClick(() => console.log("Favorite"));
  const iconBtn2 = ui.AddIconButton(miscRow, "search");
  iconBtn2.SetMargins(4, 4, 4, 4);
  const iconBtn3 = ui.AddIconButton(miscRow, "more_vert");
  iconBtn3.SetMargins(4, 4, 4, 4);

  // ---------------------------------------------------------------------------
  // Mount the app
  // ---------------------------------------------------------------------------
  app.MountRoot(root);
}

// -----------------------------------------------------------------------------
// Lifecycle hooks (optional)
// -----------------------------------------------------------------------------
function OnBack(): boolean {
  console.log("Back pressed");
  return true; // allow back navigation
}

function OnPause() {
  console.log("App paused");
}

function OnResume() {
  console.log("App resumed");
}

function OnConfig() {
  console.log("Screen config changed");
}

export default { OnStart, OnBack, OnPause, OnResume, OnConfig };
