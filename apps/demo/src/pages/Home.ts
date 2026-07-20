import { Layout, Text, EndAutoBind, Navigate } from "../../../../packages/core/index.ts";
import { Button } from "../../../../packages/mui/index.ts";

export function CreateHome() {
  Layout("Linear", "Fit", "/");
  
  Text("Welcome to the materiald Framework Showcase").SetTextSize(24).SetTextColor("var(--core-primary)");
  Text("This application demonstrates the auto-bind layout stack and Morph responsive system in action.").SetTextSize(16);

  Button("View Foundations").SetOnClick(() => Navigate("/foundations"));
  Button("View Components").SetOnClick(() => Navigate("/components/actions"));

  EndAutoBind();
}
