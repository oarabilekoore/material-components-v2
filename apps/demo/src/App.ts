import { Layout, EndAutoBind, Text, Navigate } from "../../../packages/core/index.ts";
import { NavigationRail, NavigationBar, NavigationDrawer, Icons } from "../../../packages/mui/index.ts";
import { CreateHome } from "./pages/Home.ts";
import { CreateFoundations } from "./pages/Foundations.ts";
import { CreateMorphDemo } from "./pages/Morph.ts";
import { CreateActions } from "./pages/components/Actions.ts";
import { CreateNavigation } from "./pages/components/Navigation.ts";
import { CreateInputs } from "./pages/components/Inputs.ts";
import { CreateOverlays } from "./pages/components/Overlays.ts";
import { CreateDisplay } from "./pages/components/Display.ts";

export function App() {
  const root = Layout("Linear");
  root.element.style.width = "100vw";
  root.element.style.height = "100vh";
  root.element.style.overflow = "hidden";
  root.element.style.flexDirection = "row";

  // Navigation Drawer for Expanded (Desktop)
  const drawer = NavigationDrawer("standard");
  setupNav(drawer);
  drawer.Morph({
    Compact: { SetVisibility: ["Gone"] },
    Medium: { SetVisibility: ["Gone"] },
    Expanded: { SetVisibility: ["Show"] }
  });

  // Navigation Rail for Medium (Tablet)
  const rail = NavigationRail();
  setupNav(rail);
  rail.Morph({
    Compact: { SetVisibility: ["Gone"] },
    Medium: { SetVisibility: ["Show"] },
    Expanded: { SetVisibility: ["Gone"] }
  });

  // Main Content Area
  const contentArea = Layout("Linear", "Fill");
  contentArea.element.style.overflowY = "auto";
  contentArea.element.style.padding = "16px";
  
  // This layout will act as the router outlet.
  Layout("Linear", "Fill Outlet", undefined, { into: contentArea });
  
  // Register Routes inside the Outlet
  CreateHome();
  CreateFoundations();
  CreateMorphDemo();
  CreateActions();
  CreateNavigation();
  CreateInputs();
  CreateOverlays();
  CreateDisplay();
  
  EndAutoBind(); // contentArea

  // Navigation Bar for Compact (Mobile) - goes at the bottom!
  const navBar = NavigationBar();
  setupNav(navBar); // Will naturally only take first 4-5 items
  navBar.Morph({
    Compact: { SetVisibility: ["Show"] },
    Medium: { SetVisibility: ["Gone"] },
    Expanded: { SetVisibility: ["Gone"] }
  });

  EndAutoBind(); // End contentContainer
  EndAutoBind(); // End root

  return root;
}

function setupNav(nav: any) {
  nav.AddItem(Icons.add, "Home", "/");
  nav.AddItem(Icons.add, "Foundations", "/foundations");
  nav.AddItem(Icons.add, "Morph", "/foundations/morph");
  nav.AddItem(Icons.add, "Actions", "/components/actions");
  nav.AddItem(Icons.menu, "Navigation", "/components/navigation");
  nav.AddItem(Icons.add, "Inputs", "/components/inputs");
  nav.AddItem(Icons.add, "Display", "/components/display");
  nav.AddItem(Icons.add, "Overlays", "/components/overlays");
  
  if (nav.SetOnSelect) {
    nav.SetOnSelect((index: number, value: string) => {
      Navigate(value);
    });
  }
}
