import { CreateLayout, AddText } from "../../packages/core/index.ts";
import {
  AddCard,
  AddChip,
  AddBadge,
  AddLinearProgress,
  AddCircularProgress,
  AddDivider,
  AddList,
  AddListItem,
  AddAccordion,
  AddTabs,
  AddCarousel,
  AddShimmer,
} from "../../packages/mui/index.ts";
import { PageHeader, Section, Row, Labeled, Style } from "./_shared.ts";

export function CreateDataPage() {
  const page = CreateLayout("Linear", "FillX");
  Style(page, { alignItems: "stretch", gap: "24px" });

  PageHeader(
    page,
    "Data & Display",
    "Cards, chips, progress indicators, lists, and other ways to present content.",
  );

  // -------------------------------------------------------------- Cards
  const cards = Section(page, "Cards", "Elevated, filled, and outlined.");
  const cardRow = Row(cards);
  (
    [
      ["elevated", "Elevated", "Sits above the surface with a soft shadow."],
      ["filled", "Filled", "Uses a solid container color, no shadow."],
      ["outlined", "Outlined", "A hairline border instead of elevation."],
    ] as const
  ).forEach(([variant, title, body]) => {
    const card = AddCard(cardRow, variant);
    Style(card, { width: "220px" });
    card.SetHeader(title);
    card.SetContent(body);
  });

  // -------------------------------------------------------------- Chips
  const chips = Section(
    page,
    "Chips",
    "Assist, filter, input, and suggestion variants.",
  );
  const chipRow = Row(chips, "8px");
  AddChip(chipRow, "Assist", "assist");
  AddChip(chipRow, "Filter", "filter");
  AddChip(chipRow, "Input", "input");
  AddChip(chipRow, "Suggestion", "suggestion");

  // ------------------------------------------------------------- Badges
  const badges = Section(
    page,
    "Badges",
    "Small (dot) and large (with content), for flagging notifications.",
  );
  const badgeRow = Row(badges, "40px");
  const smallSlot = Labeled(badgeRow, "small");
  const smallWrap = CreateLayout("Linear");
  Style(smallWrap, { position: "relative" });
  AddText(smallWrap, "Inbox");
  AddBadge(smallWrap, "small");
  smallSlot.AddChild(smallWrap);

  const largeSlot = Labeled(badgeRow, "large");
  const largeWrap = CreateLayout("Linear");
  Style(largeWrap, { position: "relative" });
  AddText(largeWrap, "Alerts");
  AddBadge(largeWrap, "large", "12");
  largeSlot.AddChild(largeWrap);

  // ----------------------------------------------------------- Progress
  const progress = Section(
    page,
    "Progress Indicators",
    "Linear and circular, each in determinate and indeterminate form.",
  );
  const progCol = CreateLayout("Linear", "FillX");
  Style(progCol, { gap: "16px", alignItems: "flex-start" });

  const linearRow = CreateLayout("Linear", "FillX");
  Style(linearRow, { gap: "8px", maxWidth: "360px" });
  AddText(linearRow, "Linear \u2014 determinate (65%)")
    .SetFontSize("0.75rem")
    .SetColor("var(--md-on-surface-variant)");
  AddLinearProgress(linearRow).SetProgress(0.65);
  AddText(linearRow, "Linear \u2014 indeterminate")
    .SetFontSize("0.75rem")
    .SetColor("var(--md-on-surface-variant)");
  AddLinearProgress(linearRow).SetProgress(null);
  progCol.AddChild(linearRow);

  const circularRow = Row(progCol, "32px");
  const detSlot = Labeled(circularRow, "determinate (70%)");
  const detWrap = CreateLayout("Linear");
  AddCircularProgress(detWrap).SetProgress(0.7);
  detSlot.AddChild(detWrap);
  const indetSlot = Labeled(circularRow, "indeterminate");
  const indetWrap = CreateLayout("Linear");
  AddCircularProgress(indetWrap).SetProgress(null);
  indetSlot.AddChild(indetWrap);

  progress.AddChild(progCol);

  // ------------------------------------------------------------- Divider
  const dividerSection = Section(
    page,
    "Divider",
    "A hairline separator between content groups.",
  );
  AddDivider(dividerSection);

  // ---------------------------------------------------------------- List
  const lists = Section(
    page,
    "Lists",
    "Leading icons, supporting text, and multi-line items.",
  );
  const list = AddList(lists);
  const item1 = AddListItem(list, "Project Falcon");
  item1.SetSupportingText("Updated 2 hours ago").SetLeadingIcon(Icons.check);
  const item2 = AddListItem(list, "Design review");
  item2
    .SetSupportingText("3 comments \u00b7 due Friday", 2)
    .SetLeadingIcon(Icons.search);
  const item3 = AddListItem(list, "Archived thread");
  item3.SetLeadingIcon(Icons.close);

  // ----------------------------------------------------------- Accordion
  const accordions = Section(page, "Accordion", "Expandable content panel.");
  const accordionCol = CreateLayout("Linear", "FillX");
  Style(accordionCol, { gap: "8px" });
  const acc1 = AddAccordion(accordionCol, "What is materiald?");
  acc1.SetContent(
    "A Material Design 3 component library for TypeScript, built on top of a DroidScript-style imperative API.",
  );
  const acc2 = AddAccordion(accordionCol, "Does it support theming?");
  acc2.SetContent(
    "Yes \u2014 seed colors, light/dark mode, and shape scale are all runtime-adjustable via SetSeedColor / SetThemeMode.",
  );
  accordions.AddChild(accordionCol);

  // ---------------------------------------------------------------- Tabs
  const tabs = Section(
    page,
    "Tabs",
    "Primary (equal-width) and secondary (content-width).",
  );
  const tabsCol = CreateLayout("Linear", "FillX");
  Style(tabsCol, { gap: "24px" });

  const primarySlot = Labeled(tabsCol, "primary");
  const primaryTabs = CreateLayout("Linear", "FillX");
  const pTabs = AddTabs(primaryTabs, "primary");
  pTabs.AddTab("Overview").AddTab("Specs").AddTab("Reviews");
  primarySlot.AddChild(primaryTabs);

  const secondarySlot = Labeled(tabsCol, "secondary");
  const secondaryTabs = CreateLayout("Linear", "FillX");
  const sTabs = AddTabs(secondaryTabs, "secondary");
  sTabs.AddTab("All").AddTab("Unread").AddTab("Flagged").AddTab("Archived");
  secondarySlot.AddChild(secondaryTabs);

  tabs.AddChild(tabsCol);

  // ------------------------------------------------------------ Carousel
  const carousels = Section(
    page,
    "Carousel",
    "Multi-browse, uncontained, and hero layouts.",
  );
  const carouselCol = CreateLayout("Linear", "FillX");
  Style(carouselCol, { gap: "20px" });

  (["multi-browse", "uncontained", "hero"] as const).forEach((layout) => {
    const slot = Labeled(carouselCol, layout);
    const wrap = CreateLayout("Linear", "FillX");
    const car = AddCarousel(wrap, layout);
    const colors = [
      "primary-container",
      "secondary-container",
      "tertiary-container",
    ];
    for (let i = 0; i < 3; i++) {
      const slide = CreateLayout("Linear", "Center,FillXY");
      Style(slide, { backgroundColor: `var(--md-${colors[i]})` });
      AddText(slide, `Slide ${i + 1}`).SetFontWeight(500);
      car.AddItem(slide);
    }
    slot.AddChild(wrap);
  });

  carousels.AddChild(carouselCol);

  // -------------------------------------------------------------- Shimmer
  const shimmer = Section(
    page,
    "Shimmer",
    "Loading placeholders: shape and animation are independent options.",
  );
  const shimmerRow = Row(shimmer, "24px");
  (
    [
      ["rect", "wave"],
      ["circle", "pulse"],
      ["text", "static"],
    ] as const
  ).forEach(([shape, anim]) => {
    const slot = Labeled(shimmerRow, `${shape} \u00b7 ${anim}`);
    const wrap = CreateLayout("Linear");
    Style(wrap, { width: shape === "circle" ? "56px" : "160px" });
    AddShimmer(wrap).SetShape(shape).SetAnimation(anim);
    slot.AddChild(wrap);
  });

  return page;
}
