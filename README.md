# material-deno

A complete Material Design 3 UI framework for web apps, written in TypeScript.

## Features

- **All M3 components**: FABs, dialogs, navigation, inputs, feedback, and more
- **Dynamic theming**: light/dark, custom tokens, CSS variables
- **Framework-agnostic**: use with vanilla JS or compile with TSRX
- **Reactive state**: signals and observable objects
- **Client-side routing**: path-based router
- **Accessible**: ARIA, keyboard, focus management
- **Responsive**: mobile-first design

## Setup Instructions

### Using Deno

Add the library to your `deno.json`:

```json
{
  "imports": {
    "material-deno": "jsr:@scope/material-deno"
  }
}
```

### Using npm/Yarn/pnpm

Install the package via npm:

```bash
npm install material-deno
```

### TSRX Mode

TSRX is a TypeScript language extension for building declarative UIs. material-deno supports being compiled with TSRX plugins.

To use TSRX, configure your `vite.config.ts` to include the TSRX plugin (for example, targeting React, Preact, or Ripple), and name your files with the `.tsrx` extension.

## Quick Start

```typescript
import * as app from "material-deno/core";
import * as ui from "material-deno";

function OnStart() {
  ui.SetThemeMode("dark");

  const root = app.CreateLayout("Linear", "FillXY,Vertical");
  ui.AddTopAppBar(root, "My App", "small");

  const body = app.AddScroller(root, -1, -1, "FillX,Vertical");
  ui.AddButton(body, "Click me", "filled").SetOnClick(() => {
    console.log("Hello!");
  });

  app.MountRoot(root);
}

export default { OnStart };
```

## License

MIT
