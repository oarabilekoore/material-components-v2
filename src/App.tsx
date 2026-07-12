import { CreateBrowserRouter, CreateLayout, AddText } from "../packages/core/index.ts";
import { AddNavigationDrawer, AddList, AddTopAppBar, AddIconButton } from "../packages/mui/index.ts";
import { Icons } from "../packages/mui/src/icons/Icon.ts";
import { CreateButtonDemoPage } from "./pages/ButtonDemo.ts";
import { CreateInputDemoPage } from "./pages/InputDemo.ts";
import { CreateDisplayDemoPage } from "./pages/DisplayDemo.ts";
import { CreateFeedbackDemoPage } from "./pages/FeedbackDemo.ts";
import { CreateNavigationDemoPage } from "./pages/NavigationDemo.ts";

export default {
  OnStart: () => {
    const root = document.getElementById("root");
    if (!root) return;
    
    // Make root span the whole screen
    root.style.width = "100vw";
    root.style.height = "100vh";
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.margin = "0";

    // Create Main layout container
    const mainLayout = CreateLayout("Linear", "FillXY");
    mainLayout.element.style.flexDirection = "row";
    mainLayout.element.style.height = "100%";
    mainLayout.element.style.width = "100%";
    
    // Create Sidebar
    const drawer = AddNavigationDrawer(mainLayout, "standard");
    drawer.element.style.width = "250px";
    
    // Add Brand header via a raw element or just rely on items
    const brand = document.createElement("div");
    brand.textContent = "Material UI Demo";
    brand.style.fontSize = "1.25rem";
    brand.style.padding = "16px 24px";
    brand.style.fontWeight = "500";
    drawer.element.insertBefore(brand, drawer.element.firstChild);

    const navItems = [
      { title: "Buttons & FABs", path: "/buttons", icon: Icons.add },
      { title: "Inputs & Controls", path: "/inputs", icon: Icons.check },
      { title: "Display Elements", path: "/display", icon: Icons.menu },
      { title: "Feedback & Dialogs", path: "/feedback", icon: Icons.search },
      { title: "Navigation Elements", path: "/navigation", icon: Icons.menu }
    ];

    navItems.forEach((item, index) => {
      drawer.AddItem(item.title, item.icon);
    });
    
    drawer.SetOnSelect((index) => {
      const selectedItem = navItems[index];
      if (selectedItem) {
        router.Navigate(selectedItem.path);
      }
    });

    const contentLayout = CreateLayout("Linear", "FillXY");
    contentLayout.element.style.flex = "1";
    contentLayout.element.style.overflow = "auto";
    contentLayout.element.style.padding = "24px";
    contentLayout.element.style.boxSizing = "border-box";
    mainLayout.AddChild(contentLayout);
    
    // Router Setup
    const router = CreateBrowserRouter(contentLayout);
    
    // Define Routes
    router.addRoute("/", () => {
      const page = CreateLayout("Linear", "VCenter,FillXY");
      AddText(page, "Welcome to the MUI Demo!").SetFontSize("2rem");
      AddText(page, "Select a component category from the sidebar.");
      return page;
    });
    
    router.addRoute("/buttons", () => CreateButtonDemoPage());
    router.addRoute("/inputs", () => CreateInputDemoPage());
    router.addRoute("/display", () => CreateDisplayDemoPage());
    router.addRoute("/feedback", () => CreateFeedbackDemoPage());
    router.addRoute("/navigation", () => CreateNavigationDemoPage());
    
    root.appendChild(mainLayout.element);
  }
};
