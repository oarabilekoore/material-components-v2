import { CreateLayout, AddText } from "../../packages/core/index.ts";
import {
  AddTopAppBar,
  AddBottomAppBar,
  AddNavigationBar,
  AddNavigationRail,
  AddNavigationDrawer,
  AddButton,
  IconButton,
  Fab,
} from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";
import { PageHeader, Section, Labeled, Style } from "./_shared.ts";

/** A bordered "device frame" so app bars/bars/rails read as isolated previews. */
function Frame(height: string) {
  const frame = CreateLayout("Linear", "FillX");
  Style(frame, {
    position: "relative",
    height,
    border: "1px solid var(--md-outline-variant)",
    borderRadius: "12px",
    overflow: "hidden",
  });
  return frame;
}

export function CreateNavigationPage() {
  const page = CreateLayout("Linear", "FillX");
  Style(page, { alignItems: "stretch", gap: "24px" });

  PageHeader(page, "Navigation", "App bars, bottom navigation, rails, and drawers for moving around an app.");

  // ---------------------------------------------------------- Top App Bar
  const topBars = Section(page, "Top App Bar", "Small, medium, large, and center-aligned.");
  const topBarCol = CreateLayout("Linear", "FillX");
  Style(topBarCol, { gap: "16px" });

  (["small", "center-aligned", "medium", "large"] as const).forEach((variant) => {
    const slot = Labeled(topBarCol, variant);
    const frame = Frame(variant === "large" ? "128px" : variant === "medium" ? "112px" : "72px");
    const bar = AddTopAppBar(frame, "Screen title", variant);
    bar.SetNavigationIcon(new IconButton(Icons.menu));
    bar.AddAction(new IconButton(Icons.search));
    bar.AddAction(new IconButton(Icons.check));
    slot.AddChild(frame);
  });
  topBars.AddChild(topBarCol);

  // ------------------------------------------------------- Bottom App Bar
  const bottomBars = Section(page, "Bottom App Bar", "Actions plus an attached FAB, anchored to the bottom.");
  const bottomFrame = Frame("120px");
  Style(bottomFrame, { justifyContent: "flex-end" });
  const bottomBar = AddBottomAppBar(bottomFrame);
  bottomBar.AddAction(new IconButton(Icons.search));
  bottomBar.AddAction(new IconButton(Icons.check));
  bottomBar.SetFab(new Fab(Icons.add, "medium"));
  bottomBars.AddChild(bottomFrame);

  // ------------------------------------------------------- Rail / bottom nav
  const navSection = Section(page, "Navigation Rail & Bar", "Rail for wide (tablet/desktop) layouts, bar for narrow (phone) layouts.");
  const navRow = CreateLayout("Linear", "FillX");
  Style(navRow, { flexDirection: "row", gap: "24px", flexWrap: "wrap" });

  const railSlot = Labeled(navRow, "navigation rail");
  const railFrame = Frame("220px");
  Style(railFrame, { width: "96px" });
  const rail = AddNavigationRail(railFrame);
  rail.AddItem(Icons.menu, "Home", "home");
  rail.AddItem(Icons.search, "Search", "search");
  rail.AddItem(Icons.check, "Tasks", "tasks");
  rail.SetFab(new Fab(Icons.add, "medium"));
  railSlot.AddChild(railFrame);

  const navBarSlot = Labeled(navRow, "navigation bar");
  const navBarFrame = Frame("220px");
  Style(navBarFrame, { width: "280px", justifyContent: "flex-end" });
  const navBar = AddNavigationBar(navBarFrame);
  navBar.AddItem(Icons.menu, "Home", "home");
  navBar.AddItem(Icons.search, "Search", "search");
  navBar.AddItem(Icons.check, "Tasks", "tasks");
  navBarSlot.AddChild(navBarFrame);

  navSection.AddChild(navRow);

  // ------------------------------------------------------------- Drawer
  const drawerSection = Section(page, "Navigation Drawer", "Modal drawer that slides over the content (the app's own sidebar, on the left, is the standard variant).");
  const drawerRow = CreateLayout("Linear");
  const drawerSlot = Labeled(drawerRow, "modal");
  const drawer = AddNavigationDrawer(page, "modal");
  drawer.AddItem("Inbox", Icons.menu);
  drawer.AddItem("Starred", Icons.check);
  drawer.AddItem("Sent", Icons.search);
  drawer.SelectItem(0);
  AddButton(drawerSlot, "Open drawer", "outlined").SetOnClick(() => drawer.Show());
  drawerRow.AddChild(drawerSlot);
  drawerSection.AddChild(drawerRow);

  return page;
}
