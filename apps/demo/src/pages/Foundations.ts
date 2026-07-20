import { Layout, Text, EndAutoBind } from "../../../../packages/core/index.ts";
import { Button, Card } from "../../../../packages/mui/index.ts";

export function CreateFoundations() {
  Layout("Linear", "Fit", "/foundations");
  
  Text("Foundations: Auto-Bind Stack").SetTextSize(20).SetTextColor("var(--core-primary)");
  Text("The framework uses an implicit call-order stack. Components automatically append themselves to the current top of the stack, without explicitly passing parent layout references.");

  // Example 1: No variables nesting
  Text("Example 1: Visual nesting with NO variables").SetTextSize(16);
  Layout("Linear");
    Card("outlined");
      Text("This Card and its Text were created without variables!");
    EndAutoBind(); // Ends Card
  EndAutoBind(); // Ends Layout

  // Example 2: The `into` escape hatch
  Text("Example 2: The `into` escape hatch for deferred construction").SetTextSize(16);
  Text("If we didn't pass `{ into: targetContainer }` when clicking the button, the new element would try to append to whatever layout is currently at the top of the stack (which might be a completely unrelated layout, or even the document body!), rather than our designated container.").SetTextSize(14).SetTextColor("var(--core-on-surface-variant)");

  const targetContainer = Layout("Linear");
  targetContainer.element.style.padding = "16px";
  targetContainer.element.style.border = "1px dashed var(--core-outline)";
  Text("Items will be injected below:");
  EndAutoBind(); // Pop it from stack

  Button("Inject Item via `into`").SetOnClick(() => {
    Text("Injected Item!", -1, -1, undefined, { into: targetContainer });
  });

  EndAutoBind();
}
