// @ts-nocheck
// @ts-ignore
import "../../../global.css";
import { MountRoot } from "../../../packages/core/index.ts";
import { SetSeedColor } from "../../../packages/mui/index.ts";
import { App } from "./App.ts";

// Set up the default material theme
SetSeedColor("#6750A4");

// The main entry point
const appLayout = App();
MountRoot(appLayout, "root");
