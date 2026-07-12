import { CreateLayout, AddText } from "../../packages/core/index.ts";
import { AddCard, AddChip, AddBadge, AddCircularProgress, AddLinearProgress, AddAccordion, AddList, AddListItem, AddTabs, AddCarousel, AddDivider } from "../../packages/mui/index.ts";
import { Icons } from "../../packages/mui/src/icons/Icon.ts";

export function CreateDisplayDemoPage() {
  const page = CreateLayout("Linear", "FillXY");
  page.element.style.alignItems = "flex-start";
  page.element.style.gap = "24px";
  
  AddText(page, "Display Elements").SetFontSize("2rem").SetFontWeight(600).SetColor("var(--md-primary)");
  AddText(page, "Cards, chips, badges, and progress indicators.").SetFontSize("1rem").SetColor("var(--md-on-surface-variant)");

  // Cards
  const cardSection = CreateLayout("Linear");
  cardSection.element.style.gap = "16px";
  AddText(cardSection, "Cards").SetFontSize("1.5rem").SetFontWeight(500);
  
  const cardRow = CreateLayout("Linear");
  cardRow.element.style.flexDirection = "row";
  cardRow.element.style.gap = "16px";
  
  const elevatedCard = AddCard(cardRow, "elevated");
  elevatedCard.element.style.padding = "16px";
  elevatedCard.element.style.width = "200px";
  const elLayout = CreateLayout("Linear", "FillXY"); elevatedCard.element.appendChild(elLayout.element); AddText(elLayout, "Elevated Card").SetFontSize("1.2rem"); AddText(elLayout, "This is a basic elevated card with shadow.");

  const outlinedCard = AddCard(cardRow, "outlined");
  outlinedCard.element.style.padding = "16px";
  outlinedCard.element.style.width = "200px";
  const outLayout = CreateLayout("Linear", "FillXY"); outlinedCard.element.appendChild(outLayout.element); AddText(outLayout, "Outlined Card").SetFontSize("1.2rem"); AddText(outLayout, "This is an outlined card with a border.");
  
  cardSection.AddChild(cardRow);
  page.AddChild(cardSection);

  // Chips
  const chipSection = CreateLayout("Linear");
  chipSection.element.style.gap = "16px";
  AddText(chipSection, "Chips").SetFontSize("1.5rem").SetFontWeight(500);
  
  const chipRow = CreateLayout("Linear");
  chipRow.element.style.flexDirection = "row";
  chipRow.element.style.gap = "8px";
  
  AddChip(chipRow, "Assist Chip", "assist");
  AddChip(chipRow, "Filter Chip", "filter");
  AddChip(chipRow, "Input Chip", "input");
  AddChip(chipRow, "Suggestion Chip", "suggestion");
  
  chipSection.AddChild(chipRow);
  page.AddChild(chipSection);

  // Badges
  const badgeSection = CreateLayout("Linear");
  badgeSection.element.style.gap = "16px";
  AddText(badgeSection, "Badges").SetFontSize("1.5rem").SetFontWeight(500);
  
  const badgeRow = CreateLayout("Linear");
  badgeRow.element.style.flexDirection = "row";
  badgeRow.element.style.gap = "32px";
  
  // Create an icon and attach badge
  const iconWrap1 = CreateLayout("Linear");
  iconWrap1.element.style.position = "relative";
  AddText(iconWrap1, "Notifications");
  AddBadge(iconWrap1, "large", "3");
  badgeRow.AddChild(iconWrap1);

  const iconWrap2 = CreateLayout("Linear");
  iconWrap2.element.style.position = "relative";
  AddText(iconWrap2, "Messages");
  AddBadge(iconWrap2, "small");
  badgeRow.AddChild(iconWrap2);

  badgeSection.AddChild(badgeRow);
  page.AddChild(badgeSection);

  // Progress
  const progSection = CreateLayout("Linear");
  progSection.element.style.gap = "16px";
  progSection.element.style.width = "400px";
  AddText(progSection, "Progress Indicators").SetFontSize("1.5rem").SetFontWeight(500);
  
  AddLinearProgress(progSection).SetProgress(0.4);
  
  const circRow = CreateLayout("Linear");
  circRow.element.style.flexDirection = "row";
  circRow.element.style.gap = "16px";
  circRow.element.style.marginTop = "16px";
  
  AddCircularProgress(circRow).SetProgress(0.6);
  // Indeterminate progress
  const indet = AddCircularProgress(circRow);
  // indet.SetIndeterminate(true);
  
  progSection.AddChild(circRow);
  page.AddChild(progSection);

  // Divider
  AddDivider(page);

  // Lists
  const listSection = CreateLayout("Linear");
  listSection.element.style.gap = "16px";
  listSection.element.style.width = "400px";
  AddText(listSection, "Lists").SetFontSize("1.5rem").SetFontWeight(500);
  
  const list = AddList(listSection);
  const li1 = AddListItem(list, "List Item 1");
  li1.SetSupportingText("Supporting text").SetLeadingIcon(Icons.add);
  const li2 = AddListItem(list, "List Item 2");
  li2.SetSupportingText("More supporting text").SetLeadingIcon(Icons.check);
  
  page.AddChild(listSection);

  // Accordion
  const accSection = CreateLayout("Linear");
  accSection.element.style.gap = "16px";
  accSection.element.style.width = "400px";
  AddText(accSection, "Accordion").SetFontSize("1.5rem").SetFontWeight(500);
  
  const acc = AddAccordion(accSection, "Accordion Title");
  acc.SetContent("This is the hidden content inside the accordion.");
  
  page.AddChild(accSection);

  // Tabs
  const tabSection = CreateLayout("Linear");
  tabSection.element.style.gap = "16px";
  tabSection.element.style.width = "400px";
  AddText(tabSection, "Tabs").SetFontSize("1.5rem").SetFontWeight(500);
  
  const tabs = AddTabs(tabSection);
  tabs.AddTab("Tab 1");
  tabs.AddTab("Tab 2");
  tabs.AddTab("Tab 3");
  
  page.AddChild(tabSection);

  // Carousel
  const carSection = CreateLayout("Linear");
  carSection.element.style.gap = "16px";
  carSection.element.style.width = "400px";
  AddText(carSection, "Carousel").SetFontSize("1.5rem").SetFontWeight(500);
  
  const car = AddCarousel(carSection);
  const slide1 = CreateLayout("Linear", "Center,FillXY"); slide1.element.style.backgroundColor = "var(--md-primary-container)"; AddText(slide1, "Slide 1");
  const slide2 = CreateLayout("Linear", "Center,FillXY"); slide2.element.style.backgroundColor = "var(--md-secondary-container)"; AddText(slide2, "Slide 2");
  car.AddItem(slide1);
  car.AddItem(slide2);
  
  page.AddChild(carSection);

  return page;
}
