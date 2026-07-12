# material-deno

A Material Design 3 UI framework for web apps, written in TypeScript, built on
Deno + Vite. This repo is both the framework source (`packages/core`,
`packages/mui`) and a runnable demo app (`src/App.tsx`) that exercises it.

> **Status:** this package is **not yet published** to npm or JSR. The only
> supported way to use it today is by cloning this repo directly (see below).
> Known setup/build issues are tracked at the bottom of this file — check there
> if a command doesn't work as expected.

## Features

- **M3 component set**: buttons, FABs, dialogs, navigation, inputs, feedback, and more
- **Dynamic theming**: light/dark, custom tokens, CSS variables
- **Framework-agnostic**: use with vanilla JS/TS, no framework required
- **Reactive state**: signals and observable objects
- **Client-side routing**: path-based router
- **Accessible**: ARIA, keyboard, focus management
- **Responsive**: mobile-first design

## Prerequisites

- [Deno](https://deno.com/) 2.x
- Node.js (only needed if you'd rather drive things through `npm`/`vite` directly instead of Deno tasks)

## Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/oarabilekoore/material-components-v2.git
cd material-components-v2
deno install
```

### Running the demo app

The demo app (`src/App.tsx` → mounted via `index.html`) is served through Vite,
with `main.ts` acting as a Deno-based dev proxy / static file server in front
of it.

Start the Vite dev server:

```bash
deno task vite:dev
```

This serves the app directly on `http://localhost:5173`.

If you want to go through the `main.ts` proxy (e.g. to test its dev-proxy or
static-serving logic specifically), run it alongside Vite in a second
terminal:

```bash
APP_ENV=development deno run -A --allow-net --allow-env --allow-read main.ts
```

> **Note:** `INTRODUCTION.md` currently references a `deno task dev` and a
> `deno task desktop:dev` command. As of this writing, `deno.json` does not
> define a `dev` task, and `desktop:dev`/`build` invoke `deno desktop`, which
> is not a standard Deno subcommand in this project — those two tasks
> currently do not work. Use the `vite:dev` command above until this is fixed.
> Refer to `INTRODUCTION.md` in the root directory for full setup and usage details.

### Using the library in your own project

Since this isn't published yet, import directly from a cloned/vendored copy of
this repo:

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

Your entry module should export a default object with an `OnStart` function —
see `src/App.tsx` for a full working example, and `docs/INTRODUCTION.md` for
the fuller API reference.

## Documentation

See [`docs/INTRODUCTION.md`](./docs/INTRODUCTION.md) for the full API
reference (components, theming, state, routing).

## Known issues

This is an actively developed repo and a few things are currently broken or
inconsistent — worth knowing before you dig in:

- `deno task dev` (referenced in `docs/INTRODUCTION.md`) doesn't exist yet — use `deno task vite:dev`.
- `deno task desktop:dev` and `deno task build` call `deno desktop`, which isn't a valid Deno subcommand in this project.
- `main_test.ts` doesn't currently match `main.ts`'s real behavior and won't pass as-is.
- `app.SetThemeMode` (from `packages/core`) and `ui.SetThemeMode` (from `packages/mui`) are two separate functions with separate state — prefer `ui.SetThemeMode` for app-level theming.

These are being worked through; see the repo's issues for status.

## License

MIT
