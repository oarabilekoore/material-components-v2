import { CreateLayout, AddText } from "../../packages/core/index.ts";
import { AddTopAppBar, AddBottomAppBar, AddNavigationBar, AddNavigationRail, IconButton, Fab } from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";

export function CreateNavigationDemoPage() {
  const page = CreateLayout("Linear", "FillXY");
  page.element.style.alignItems = "stretch";
  page.element.style.gap = "24px";
  
  const header = CreateLayout("Linear");
  header.element.style.padding = "0 24px";
  AddText(header, "Navigation Elements").SetFontSize("2rem").SetFontWeight(600).SetColor("var(--md-primary)");
  AddText(header, "App bars, nav bars, and rails.").SetFontSize("1rem").SetColor("var(--md-on-surface-variant)");
  page.AddChild(header);

  // Top App Bar
  const topSection = CreateLayout("Linear");
  topSection.element.style.position = "relative";
  topSection.element.style.height = "150px";
  topSection.element.style.border = "1px solid var(--md-outline-variant)";
  topSection.element.style.borderRadius = "8px";
  topSection.element.style.overflow = "hidden";
  
  const topBar = AddTopAppBar(topSection, "Page Title", "center-aligned");
  topBar.SetNavigationIcon(new IconButton(Icons.menu).SetOnClick(() => console.log("Menu")));
  topBar.AddAction(new IconButton(Icons.search).SetOnClick(() => console.log("Search")));
  topBar.AddAction(new IconButton(Icons.menu).SetOnClick(() => console.log("More")));
  
  page.AddChild(topSection);

  // Bottom App Bar
  const bottomSection = CreateLayout("Linear");
  bottomSection.element.style.position = "relative";
  bottomSection.element.style.height = "150px";
  bottomSection.element.style.border = "1px solid var(--md-outline-variant)";
  bottomSection.element.style.borderRadius = "8px";
  bottomSection.element.style.overflow = "hidden";
  bottomSection.element.style.justifyContent = "flex-end";
  
  const bottomBar = AddBottomAppBar(bottomSection);
  bottomBar.AddAction(new IconButton(Icons.check).SetOnClick(() => console.log("check")));
  bottomBar.AddAction(new IconButton(Icons.search).SetOnClick(() => console.log("search")));
  bottomBar.SetFab(new Fab(Icons.add, "medium").SetOnClick(() => console.log("fab")));
  
  page.AddChild(bottomSection);

  const rowLayout = CreateLayout("Linear");
  rowLayout.element.style.flexDirection = "row";
  rowLayout.element.style.gap = "24px";
  rowLayout.element.style.flex = "1";
  
  // Navigation Rail
  const railSection = CreateLayout("Linear");
  railSection.element.style.position = "relative";
  railSection.element.style.width = "150px";
  railSection.element.style.border = "1px solid var(--md-outline-variant)";
  railSection.element.style.borderRadius = "8px";
  railSection.element.style.overflow = "hidden";
  
  const rail = AddNavigationRail(railSection);
  rail.AddItem(Icons.menu, "Home", "home");
  rail.AddItem(Icons.search, "Search", "search");
  rail.AddItem(Icons.check, "Settings", "settings");
  rail.SetFab(new Fab(Icons.add, "medium"));
  
  rowLayout.AddChild(railSection);

  // Navigation Bar
  const navBarSection = CreateLayout("Linear");
  navBarSection.element.style.position = "relative";
  navBarSection.element.style.flex = "1";
  navBarSection.element.style.border = "1px solid var(--md-outline-variant)";
  navBarSection.element.style.borderRadius = "8px";
  navBarSection.element.style.overflow = "hidden";
  navBarSection.element.style.justifyContent = "flex-end";
  
  const navBar = AddNavigationBar(navBarSection);
  navBar.AddItem(Icons.menu, "Home", "home");
  navBar.AddItem(Icons.search, "Search", "search");
  navBar.AddItem(Icons.check, "Settings", "settings");
  
  rowLayout.AddChild(navBarSection);

  page.AddChild(rowLayout);

  return page;
}
