import { Layout, Text, EndAutoBind } from "../../../../../packages/core/index.ts";
import { Card, Badge, Chip, CircularProgress, LinearProgress, Accordion, List, ListItem, Carousel, Icons } from "../../../../../packages/mui/index.ts";
import type { CardVariant, BadgeVariant, ChipVariant, ProgressVariant } from "../../../../../packages/mui/src/theme.ts";

export function CreateDisplay() {
  Layout("Linear", "Fit", "/components/display");
  
  Text("Display").SetTextSize(24).SetTextColor("var(--core-primary)");
  
  // Cards
  Text("Cards").SetTextSize(20);
  const cardVariants: Record<CardVariant, true> = {
    elevated: true,
    filled: true,
    outlined: true
  };
  const cRow = Layout("Linear");
  cRow.element.style.flexDirection = "row";
  cRow.element.style.gap = "16px";
  Object.keys(cardVariants).forEach(variant => {
    const c = Card(variant as CardVariant);
    c.SetHeader(`Card (${variant})`);
    c.SetContent("This is the card content. It can contain anything.");
    EndAutoBind(); // c
  });
  EndAutoBind(); // cRow

  // Badges
  Text("Badges").SetTextSize(20);
  const badgeVariants: Record<BadgeVariant, true> = {
    small: true,
    large: true
  };
  const bRow = Layout("Linear");
  bRow.element.style.flexDirection = "row";
  bRow.element.style.gap = "16px";
  Object.keys(badgeVariants).forEach(variant => {
    const container = Layout("Linear");
    container.element.style.position = "relative";
    container.element.style.padding = "8px";
    container.element.style.border = "1px solid var(--core-outline)";
    Text("Anchor");
    Badge(variant as BadgeVariant, variant === "large" ? "3" : "", { into: container });
    EndAutoBind(); // container
  });
  EndAutoBind(); // bRow

  // Chips
  Text("Chips").SetTextSize(20);
  const chipVariants: Record<ChipVariant, true> = {
    assist: true,
    filter: true,
    input: true,
    suggestion: true
  };
  const chRow = Layout("Linear");
  chRow.element.style.flexDirection = "row";
  chRow.element.style.gap = "8px";
  chRow.element.style.flexWrap = "wrap";
  Object.keys(chipVariants).forEach(variant => {
    Chip(`Chip (${variant})`, variant as ChipVariant);
  });
  EndAutoBind(); // chRow

  // Progress
  Text("Progress Indicators").SetTextSize(20);
  const pRow = Layout("Linear");
  pRow.element.style.gap = "16px";
  LinearProgress().SetProgress(50);
  CircularProgress().SetProgress(75);
  EndAutoBind(); // pRow

  // Accordion
  Text("Accordion").SetTextSize(20);
  const acc = Accordion("Accordion Section 1");
  acc.SetContent("This content is hidden until the accordion is expanded.");
  EndAutoBind();

  // List
  Text("Lists").SetTextSize(20);
  const l = List();
  ListItem("Item 1", "Supporting text", Icons.add);
  ListItem("Item 2", "Supporting text", Icons.check);
  EndAutoBind();

  // Carousel
  Text("Carousel").SetTextSize(20);
  const car = Carousel();
  car.element.style.height = "200px";
  // Add 3 dummy slides
  for (let i = 1; i <= 3; i++) {
    const slide = Layout("Linear");
    car.AddItem(slide);
    slide.element.style.minWidth = "80%";
    slide.element.style.height = "100%";
    slide.element.style.backgroundColor = "var(--core-surface-variant)";
    slide.element.style.borderRadius = "16px";
    slide.element.style.alignItems = "center";
    slide.element.style.justifyContent = "center";
    Text(`Slide ${i}`, -1, -1, undefined, { into: slide }).SetTextSize(24);
  }

  EndAutoBind(); // End /components/display
}
