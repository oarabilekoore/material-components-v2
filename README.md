# Material Design 3 Framework

A complete Material Design 3 UI framework for web apps, written in TypeScript.

## Features

- 🧩 **All M3 components** – FABs, dialogs, navigation, inputs, feedback, and more
- 🎨 **Dynamic theming** – light/dark, custom tokens, CSS variables
- 📦 **Framework‑agnostic** – use with vanilla JS or any framework
- 🔌 **Reactive state** – signals and observable objects
- 🧭 **Client‑side routing** – path‑based router
- ♿ **Accessible** – ARIA, keyboard, focus management
- 📱 **Responsive** – mobile‑first design

## Quick Start

```typescript
import * as app from "./packages/core/index.ts";
import * as ui from "./packages/mui/index.ts";

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

## Installation

Copy the source into your project, then:

```ts
import * as app from "./packages/core/index.ts";
import * as ui from "./packages/mui/index.ts";
```

> **Note:** The framework is designed to work with a modern build system (Vite, Deno, etc.). See the full docs for setup details.

## Documentation

For complete API reference and component guides, see the [full documentation](./DOCS.md).

## License

MIT
