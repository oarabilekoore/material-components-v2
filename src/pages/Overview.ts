import { CreateLayout, AddText } from "../../packages/core/index.ts";
import { AddCard, AddChip } from "../../packages/mui/index.ts";
import { PageHeader, Section, Style } from "./_shared.ts";

interface CategoryLink {
  title: string;
  description: string;
  count: string;
  path: string;
}

const categories: CategoryLink[] = [
  { title: "Actions", description: "Buttons, FABs, icon buttons, segmented & split buttons.", count: "7 components", path: "/actions" },
  { title: "Forms", description: "Text fields, checkboxes, radios, switches, sliders, search, pickers.", count: "8 components", path: "/forms" },
  { title: "Data & Display", description: "Cards, chips, badges, progress, lists, accordion, tabs, carousel, shimmer.", count: "10 components", path: "/data" },
  { title: "Feedback & Overlays", description: "Dialogs, snackbars, sheets, tooltip, menu.", count: "6 components", path: "/feedback" },
  { title: "Navigation", description: "App bars, bottom nav, rail, and drawer.", count: "5 components", path: "/navigation" },
];

export function CreateOverviewPage(navigate: (path: string) => void) {
  const page = CreateLayout("Linear", "FillX");
  Style(page, { alignItems: "stretch", gap: "24px" });

  PageHeader(
    page,
    "materiald component gallery",
    "Every Material Design 3 component in this library, organized by what it's for. Pick a category to see all of its variants.",
  );

  const grid = CreateLayout("Linear", "FillX");
  Style(grid, {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
    width: "100%",
  });

  categories.forEach((cat) => {
    const card = AddCard(grid, "outlined");
    Style(card, { width: "100%", cursor: "pointer", transition: "border-color 0.15s ease" });
    card.SetHeader(cat.title);
    card.SetContent(cat.description);
    card.SetOnClick(() => navigate(cat.path));

    const tagRow = CreateLayout("Linear");
    Style(tagRow, { flexDirection: "row", marginTop: "12px" });
    AddChip(tagRow, cat.count, "assist");
    card.element.appendChild(tagRow.element);
  });

  page.AddChild(grid);

  const about = Section(
    page,
    "About this build",
    "The colors on this page are generated at runtime from a seed color via Material Color Utilities \u2014 use the swatches in the top bar to try a different one, or the light/dark toggle to switch modes.",
  );

  return page;
}
