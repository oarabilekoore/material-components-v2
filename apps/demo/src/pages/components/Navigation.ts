import { Layout, Text, EndAutoBind } from "../../../../../packages/core/index.ts";
import { TopAppBar, BottomAppBar, NavigationBar, NavigationDrawer, NavigationRail, Tabs, Toolbar, Icons, Button } from "../../../../../packages/mui/index.ts";
import type { TopAppBarVariant, DrawerVariant } from "../../../../../packages/mui/src/theme.ts";

export function CreateNavigation() {
  Layout("Linear", "Fit", "/components/navigation");
  
  Text("Navigation").SetTextSize(24).SetTextColor("var(--core-primary)");
  
  // TopAppBar
  Text("Top App Bars").SetTextSize(20);
  const topAppVariants: Record<TopAppBarVariant, true> = {
    small: true,
    medium: true,
    large: true,
    "center-aligned": true
  };
  Object.keys(topAppVariants).forEach(variant => {
    const container = Layout("Linear");
    container.element.style.height = "120px";
    container.element.style.position = "relative";
    container.element.style.border = "1px solid var(--core-outline)";
    container.element.style.overflow = "hidden";
    TopAppBar(`Title (${variant})`, variant as TopAppBarVariant, { into: container });
    EndAutoBind(); // container
  });

  // BottomAppBar
  Text("Bottom App Bar").SetTextSize(20);
  const bContainer = Layout("Linear");
  bContainer.element.style.height = "120px";
  bContainer.element.style.position = "relative";
  bContainer.element.style.border = "1px solid var(--core-outline)";
  bContainer.element.style.overflow = "hidden";
  BottomAppBar({ into: bContainer });
  EndAutoBind();

  // NavigationBar
  Text("Navigation Bar").SetTextSize(20);
  const nbContainer = Layout("Linear");
  nbContainer.element.style.height = "120px";
  nbContainer.element.style.position = "relative";
  nbContainer.element.style.border = "1px solid var(--core-outline)";
  nbContainer.element.style.overflow = "hidden";
  const nb = NavigationBar({ into: nbContainer });
  nb.AddItem(Icons.add, "Home", "home");
  nb.AddItem(Icons.search, "Search", "search");
  EndAutoBind();

  // NavigationRail
  Text("Navigation Rail").SetTextSize(20);
  const nrContainer = Layout("Linear");
  nrContainer.element.style.height = "200px";
  nrContainer.element.style.position = "relative";
  nrContainer.element.style.border = "1px solid var(--core-outline)";
  nrContainer.element.style.overflow = "hidden";
  const nr = NavigationRail({ into: nrContainer });
  nr.AddItem(Icons.add, "Home", "home");
  nr.AddItem(Icons.search, "Search", "search");
  EndAutoBind();

  // NavigationDrawer
  Text("Navigation Drawers").SetTextSize(20);
  const drawerVariants: Record<DrawerVariant, true> = {
    standard: true,
    modal: true
  };
  
  Object.keys(drawerVariants).forEach(variant => {
    if (variant === "modal") {
      Text("Modal drawer is triggered via button below.");
    } else {
      const ndContainer = Layout("Linear");
      ndContainer.element.style.height = "300px";
      ndContainer.element.style.border = "1px solid var(--core-outline)";
      ndContainer.element.style.overflow = "hidden";
      const nd = NavigationDrawer(variant as DrawerVariant);
      nd.AddItem("Standard Item", Icons.check);
      EndAutoBind(); // ndContainer
    }
  });

  // Since modal covers the screen, we only construct it, but we provide a button to open it.
  const modalDrawer = NavigationDrawer("modal"); // Binds to top level layout, but wait it's an overlay
  modalDrawer.AddItem("Modal Item 1", Icons.check);
  Button("Open Modal Drawer").SetOnClick(() => modalDrawer.Show());
  
  // Tabs
  Text("Tabs").SetTextSize(20);
  const tabStatus = Text("Active Tab: 0");
  const tabs = Tabs();
  tabs.AddTab("Tab 1");
  tabs.AddTab("Tab 2");
  tabs.SetOnSelect((index) => {
    tabStatus.SetText(`Active Tab: ${index}`);
  });

  // Toolbar
  Text("Toolbar").SetTextSize(20);
  Toolbar();

  EndAutoBind(); // End /components/navigation
}
