import { CreateBrowserRouter, CreateLayout, AddText, MountRoot } from "../packages/core/index.ts";
import { AddNavigationDrawer, AddButton, AddDivider, SetThemeMode, SetSeedColor } from "../packages/mui/index.ts";
import { Style } from "./pages/_shared.ts";
import { Icons } from "../packages/mui/src/icons/Icon.ts";

import { CreateOverviewPage } from "./pages/Overview.ts";
import { CreateActionsPage } from "./pages/Actions.ts";
import { CreateFormsPage } from "./pages/Forms.ts";
import { CreateDataPage } from "./pages/Data.ts";
import { CreateFeedbackPage } from "./pages/Feedback.ts";
import { CreateNavigationPage } from "./pages/Navigation.ts";

const NAV_ITEMS = [
  { title: "Overview", path: "/" },
  { title: "Actions", path: "/actions" },
  { title: "Forms", path: "/forms" },
  { title: "Data & Display", path: "/data" },
  { title: "Feedback & Overlays", path: "/feedback" },
  { title: "Navigation", path: "/navigation" },
];

const SEED_COLORS = ["#6750A4", "#006874", "#8E4A49", "#3A6847", "#7D5260", "#4C5F7A"];

export default {
  OnStart: () => {
    // ---------------------------------------------------------- App shell
    const shell = CreateLayout("Linear", "FillXY");
    Style(shell, {
      flexDirection: "row",
      height: "100vh",
      width: "100vw",
      margin: "0",
      overflow: "hidden",
    });

    // Sidebar: the app's real navigation, using the standard drawer variant.
    const drawer = AddNavigationDrawer(shell, "standard");
    drawer.element.style.width = "260px";
    drawer.element.style.flexShrink = "0";

    const brand = document.createElement("div");
    brand.textContent = "materiald";
    brand.style.fontSize = "1.25rem";
    brand.style.fontWeight = "600";
    brand.style.padding = "8px 24px 20px";
    brand.style.color = "var(--md-primary)";
    drawer.element.insertBefore(brand, drawer.element.firstChild);

    NAV_ITEMS.forEach((item) => drawer.AddItem(item.title));
    drawer.SelectItem(0);
    drawer.SetOnSelect((index) => router.Navigate(NAV_ITEMS[index].path));

    // Right side: top bar + scrollable content outlet.
    const rightCol = CreateLayout("Linear", "FillXY");
    Style(rightCol, { flex: "1", minWidth: "0" });

    // -------------------------------------------------------------- Top bar
    const topBar = CreateLayout("Linear", "FillX");
    Style(topBar, {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: "64px",
      padding: "0 24px",
      flexShrink: "0",
      borderBottom: "1px solid var(--md-outline-variant)",
    });

    AddText(topBar, "Component Gallery").SetFontSize("1rem").SetFontWeight(500).SetColor("var(--md-on-surface)");

    const controls = CreateLayout("Linear");
    Style(controls, { flexDirection: "row", alignItems: "center", gap: "10px" });

    // Seed color swatches
    const swatchRow = CreateLayout("Linear");
    Style(swatchRow, { flexDirection: "row", gap: "6px" });
    SEED_COLORS.forEach((hex) => {
      const swatch = document.createElement("button");
      swatch.setAttribute("aria-label", `Seed color ${hex}`);
      swatch.style.cssText = `
        width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--md-outline-variant);
        background: ${hex}; cursor: pointer; padding: 0;
      `;
      swatch.addEventListener("click", () => SetSeedColor(hex));
      swatchRow.element.appendChild(swatch);
    });
    controls.AddChild(swatchRow);

    AddDivider(controls).element.style.cssText = "width: 1px; height: 24px; margin: 0 4px;";

    // Light / dark toggle
    let isDark = false;
    const themeBtn = AddButton(controls, "Dark mode", "outlined");
    themeBtn.SetOnClick(() => {
      isDark = !isDark;
      SetThemeMode(isDark ? "dark" : "light");
      themeBtn.SetText(isDark ? "Light mode" : "Dark mode");
    });

    topBar.AddChild(controls);
    rightCol.AddChild(topBar);

    // ----------------------------------------------------------- Content
    const contentLayout = CreateLayout("Linear", "FillX");
    Style(contentLayout, {
      alignItems: "stretch",
      flex: "1",
      overflowY: "auto",
      padding: "32px 40px 80px",
      gap: "24px",
      boxSizing: "border-box",
      maxWidth: "1040px",
      margin: "0 auto",
      width: "100%",
    });
    rightCol.AddChild(contentLayout);

    shell.AddChild(rightCol);

    // -------------------------------------------------------------- Router
    const router = CreateBrowserRouter(contentLayout);

    const syncDrawerSelection = (path: string) => {
      const idx = NAV_ITEMS.findIndex((n) => n.path === path);
      if (idx >= 0) drawer.SelectItem(idx);
    };

    router.addRoute("/", () => {
      syncDrawerSelection("/");
      return CreateOverviewPage((path) => router.Navigate(path));
    });
    router.addRoute("/actions", () => {
      syncDrawerSelection("/actions");
      return CreateActionsPage();
    });
    router.addRoute("/forms", () => {
      syncDrawerSelection("/forms");
      return CreateFormsPage();
    });
    router.addRoute("/data", () => {
      syncDrawerSelection("/data");
      return CreateDataPage();
    });
    router.addRoute("/feedback", () => {
      syncDrawerSelection("/feedback");
      return CreateFeedbackPage();
    });
    router.addRoute("/navigation", () => {
      syncDrawerSelection("/navigation");
      return CreateNavigationPage();
    });

    MountRoot(shell);
  },
};
