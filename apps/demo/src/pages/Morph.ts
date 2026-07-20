import { Layout, Text, EndAutoBind, WindowSizeClass } from "../../../../packages/core/index.ts";
import { Button, Card } from "../../../../packages/mui/index.ts";
import { WindowSizeClassKey } from "../../../../packages/core/src/state/breakpoints.ts";

export function CreateMorphDemo() {
  Layout("Linear", "Fit", "/foundations/morph");
  Text("Morph (Responsive UI)").SetTextSize(24).SetTextColor("var(--core-primary)");
  Text("Try resizing the window to see these elements respond!").SetTextSize(14).SetTextColor("var(--core-on-surface-variant)");

  Text("Current Window Size Class").SetTextSize(16);
  const sizeText = Text("Loading...");
  sizeText.element.style.fontWeight = "bold";
  sizeText.element.style.padding = "16px";
  sizeText.element.style.backgroundColor = "var(--core-surface-variant)";
  
  WindowSizeClass.Get().Subscribe((size: WindowSizeClassKey) => {
    sizeText.SetText(`Current Class: ${size}`);
  });

  // 1. Cascading Morph example
  Text("1. Cascading Styles (Mobile-first)").SetTextSize(16);
  Text("This layout declares a column direction at Compact, which inherits upwards. Then Expanded explicitly overrides it to row.").SetTextSize(14).SetTextColor("var(--core-on-surface-variant)");
  const cascadeLayout = Layout("Linear");
  cascadeLayout.element.style.gap = "8px";
  Button("Item 1");
  Button("Item 2");
  cascadeLayout.Morph({
    Compact: { SetStyle: [{"flexDirection": "column"}] }, // Mobile: Column
    Expanded: { SetStyle: [{"flexDirection": "row"}] }    // Desktop overrides: Row
  });
  EndAutoBind();

  // 3. Toggle-fill example
  Text("2. Toggle-fill Morph").SetTextSize(16);
  Text("Visibility behaves differently than other attributes: if it's explicitly declared for ANY breakpoint, it becomes Gone everywhere else by default (toggle-fill) rather than cascading.").SetTextSize(14).SetTextColor("var(--core-on-surface-variant)");
  const toggleCard = Card("filled");
  toggleCard.SetHeader("I only exist on Medium screens!");
  toggleCard.Morph({
    Medium: { SetVisibility: ["Show"] }
    // No other declarations -> Gone everywhere else by toggle-fill
  });

  // 4. Routed + Morph element (Arbiter)
  Text("3. Visibility Arbiter Resolution").SetTextSize(16);
  const arbiterCard = Card("outlined");
  arbiterCard.SetHeader("I am visible because we are on /foundations/morph!");
  arbiterCard.SetContent("Even if Morph says I should be Visible on all breakpoints, navigating away will hide me because Route has a veto vote.");
  arbiterCard.Morph({
    Compact: { SetVisibility: ["Show"] }
    // Cascades up to all
  });
  EndAutoBind();

  EndAutoBind();
}
