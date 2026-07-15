# Material Design 3 Framework – Complete Documentation

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
   - [BaseElement](#baseelement)
   - [LayoutElement](#layoutelement)
   - [Styling with sva()](#styling-with-sva)
   - [Creating Elements from BaseElement](#creating-elements-from-baseelement)
   - [Theming](#theming)
   - [State Management (Signals & Observable)](#state-management-signals--observable)
   - [Routing](#routing)
4. [Components](#components)
   - [Navigation](#navigation)
   - [Buttons & FABs](#buttons--fabs)
   - [Inputs & Forms](#inputs--forms)
   - [Feedback & Overlays](#feedback--overlays)
   - [Display & Layout](#display--layout)
   - [Progress & Badges](#progress--badges)
5. [Utilities](#utilities)
   - [CreateLayout & AddLayout](#createlayout--addlayout)
   - [MountRoot](#mountroot)
   - [Development Server](#development-server)
6. [API Reference](#api-reference)
   - [BaseElement API](#baseelement-api-1)
   - [LayoutElement API](#layoutelement-api-1)
   - [Signal API](#signal-api)
   - [Observable API](#observable-api)
   - [Router API](#router-api)

---

## Overview

This is a **complete Material Design 3 (M3)** UI framework written in TypeScript. It provides a full set of components following Google’s M3 specifications, including dynamic theming, elevation, shape, typography, motion, and accessibility.

**Key features:**

- 🧩 **Full M3 component set** – all standard components
- 🎨 **Dynamic theming** – light/dark modes, custom tokens
- 📦 **Framework‑agnostic** – works with vanilla JS or any framework
- 🔌 **Reactive state** – Signals and observable objects
- 🧭 **Client‑side routing** – path‑based router
- ♿ **Accessible** – ARIA, keyboard, focus management
- 📱 **Responsive** – mobile‑first design

The framework is built on a lightweight `BaseElement` wrapper around native DOM elements, providing a consistent API for styling, positioning, and interaction.

---

## Getting Started

### Installation

Copy the framework source into your project or import from a package manager (if published). The main entry points are:

```typescript
import * as app from "./packages/core/index.ts";
import * as ui from "./packages/mui/index.ts";
```

### Minimal Example

```typescript
import * as app from "./packages/core/index.ts";
import * as ui from "./packages/mui/index.ts";

function OnStart() {
  ui.SetThemeMode("dark");

  const root = app.CreateLayout("Linear", "FillXY,Vertical");
  root.SetBackColor(ui.GetTheme().surface);

  ui.AddTopAppBar(root, "My App", "small");

  const body = app.AddLayout(root, "Linear", "FillX,Vertical");
  ui.AddButton(body, "Click me", "filled").SetOnClick(() => {
    console.log("Hello!");
  });

  app.MountRoot(root);
}

export default { OnStart };
```

The entry point expects an `OnStart` function to be exported (see `App.ts` example).

---

## Core Concepts

### BaseElement

`BaseElement` (`packages/core/src/elements/BaseElement.ts`) is the foundation
every component in the framework is built on. It does one job: wrap a single
real `HTMLElement` and give it a consistent, chainable API for styling it,
sizing it, showing/hiding it, and wiring up interaction — regardless of
whether the underlying tag is a `<div>`, a `<button>`, or an `<input>`.

```typescript
class BaseElement {
  element: HTMLElement;              // the real DOM node — always accessible
  data: Record<string, unknown> = {}; // free-form bag for your own metadata

  constructor(tag: string) {
    this.element = document.createElement(tag);
    // ...
  }
}
```

Two things to know before anything else:

- **`.element` is never hidden from you.** Every `BaseElement` (and therefore
  every component built on it) exposes the underlying DOM node directly, so
  you can always drop down to raw `element.style.*` or
  `element.addEventListener(...)` for anything the framework doesn't wrap.
- **Almost every setter returns `this`.** This is what makes the fluent,
  chainable style used throughout the framework possible:

```typescript
const box = new BaseElement("div")
  .SetSize(0.5, -1)            // 50% of parent width, auto height
  .SetBackColor("#6750A4")
  .SetPadding(16, 16, 16, 16)
  .SetBorderRadius(12);
```

#### What BaseElement gives you

| Category | Methods | Notes |
|---|---|---|
| **Color & background** | `SetBackColor`, `SetBackAlpha`, `SetBackGradient`, `SetBackGradientRadial`, `SetBackground`, `SetColorFilter`, `AdjustColor` | `SetBackAlpha` accepts either a 0–1 fraction or a 1–256 "Android-style" alpha and normalizes it internally. |
| **Raw styling** | `SetStyle(styleObject)` | Attaches an arbitrary style object via the same CSS-injection engine that powers `sva()` (see below) — useful for one-off styling that doesn't need a reusable variant set. |
| **Size & position** | `SetSize`, `GetWidth`/`GetHeight`, `GetAbsWidth`/`GetAbsHeight`, `SetPosition`, `GetLeft`/`GetTop`/`GetPosition`, `SetScale` | Sizes are given as a **0–1 fraction of the parent** by default (e.g. `0.5` = 50% width); pass `-1` for auto, or `{ px: true }` to use literal pixels instead. |
| **Spacing** | `SetMargins`, `SetPadding` | Left/top/right/bottom order, with an optional unit (`"px"` by default). |
| **Appearance** | `SetColor`, `SetBackgroundColor`, `SetBorderRadius`, `SetBoxShadow`, `SetOutline`, `SetTransition`, `SetOpacity`, `SetZIndex` | |
| **Visibility** | `Show()`, `Hide()`, `Gone()`, `SetVisibility(mode)`, `GetVisibility()`, `IsVisible()` | These three are deliberately different: `Hide()` sets `visibility: hidden` (the element keeps its layout space); `Gone()` sets `display: none` (space collapses entirely); `Show()` restores whichever `display` value the element originally had. |
| **Interaction** | `SetEnabled`/`IsEnabled`, `Focus`/`ClearFocus`, `SetDescription` | `SetEnabled(false)` disables native form controls (`<button>`, `<input>`, etc.) *and* sets `pointer-events: none` + dims opacity, so it works even on non-form elements. `SetDescription` sets `aria-label`. |
| **Events** | `SetOnTouch(callback)`, `SetOnLongTouch(callback, holdMs?)` | Despite the "touch" naming, these are wired to mouse events (`click`, `mousedown`/`mouseup`/`mouseleave`) under the hood, not the Pointer/Touch Events API. |
| **Measurement** | `GetType()`, `GetParent()`, `IsOverlap(other, depth?)` | `GetType()` returns the tag name by default; components override it to return a friendly name (`ButtonElement` overrides it to return `"Button"`, `LayoutElement` to return `"Layout"`, etc.). `IsOverlap` does an AABB collision check against another `BaseElement`'s bounding rect. |
| **Animation** | `Animate(keyframes, options?, callback?)`, `Tween(target, duration?, callback?)`, `MorphShape(r1, r2, duration?, callback?)` | Thin wrappers around the native Web Animations API (`element.animate(...)`). |
| **Lifecycle** | `RegisterCleanup(task)`, `Dispose()` | `Dispose()` runs any registered cleanup tasks, detaches event listeners it added, and removes the element from the DOM. `LayoutElement` overrides `Dispose()` to also dispose all of its children first. |
| **Bulk updates** | `Batch({ MethodName: [args] })` | Calls several setter methods in one go from a plain object — handy for data-driven configuration, e.g. `el.Batch({ SetBackColor: ["red"], SetSize: [0.5, -1] })`. |

Because every concrete component (`ButtonElement`, `TextElement`,
`LayoutElement`, every `mui` component, etc.) *extends* `BaseElement`, all of
the above is available on every single element in the framework, on top of
whatever that component adds.

### LayoutElement

`LayoutElement` (`packages/core/src/elements/Layout.ts`) extends
`BaseElement` and is the container type everything else gets placed into. It
wraps a single `<div>` and, depending on which `LayoutType` you construct it
with, applies a different base CSS regime:

| Type | Behavior |
|---|---|
| `"Linear"` (default) | `display: flex`, defaults to a **column**, with default gravity `Top,Center` already applied (`justify-content: flex-start`, `align-items: center`). Reorient with `SetOrientation("Horizontal" \| "Vertical")`. |
| `"Absolute"` | A `position: relative` block container — children you position with `SetPosition(...)` are placed relative to it. |
| `"Frame"` | Like `Absolute`, but `AddChild` automatically stacks each new child with `position: absolute; top: 0; left: 0` and an incrementing `z-index`, so children overlap in insertion order (comparable to Android's `FrameLayout`). |
| `"Card"` | Same stacking behavior as `Frame`, plus rounded corners and a default box-shadow out of the box. |

```typescript
const root = new LayoutElement("Linear"); // or CreateLayout("Linear", "...")
```

In practice you'll almost always create layouts through `CreateLayout` /
`AddLayout` rather than `new LayoutElement(...)` directly, because those
factory functions also parse the shorthand **options string** for you (see
below).

#### Managing children

`LayoutElement` keeps its own internal `children: BaseElement[]` array, kept
in sync with the real DOM — this is what lets it do ordering, z-index
bookkeeping, and lifecycle cleanup that plain `element.appendChild` can't:

```typescript
layout.AddChild(child);        // append, or insert at a specific order:
layout.AddChild(child, 0);     // insert as the first child

layout.RemoveChild(child);     // detach (child instance stays usable elsewhere)
layout.DestroyChild(child);    // detach *and* call child.Dispose()

layout.ChildToFront(child);    // bring to front (also fixes up z-index in Frame/Card mode)
layout.Clear();                // dispose every current child at once
layout.GetChildOrder(child);   // -> index, or -1 if not a child
```

> Because the framework tracks children in that internal array, prefer
> `AddChild`/`RemoveChild`/`DestroyChild` over mutating `layout.element`
> directly (e.g. `layout.element.appendChild(...)`) — bypassing them will
> desync the tracked order and z-index bookkeeping in `Frame`/`Card` layouts.

#### Orientation, gravity & wrapping

```typescript
layout.SetOrientation("Horizontal"); // flex-direction: row
layout.SetGravity("Center");         // justify-content + align-items: center
layout.SetGravity("Top,Right");      // combine multiple tokens
layout.SetWrap(true);                // flex-wrap: wrap
```

`SetGravity` accepts a comma-separated list of `Center`, `HCenter`, `VCenter`,
`Left`, `Right`, `Top`, `Bottom`. It's aware of the current `flex-direction`,
so e.g. `"Top"` maps to `justify-content` in a vertical layout but to
`align-items` in a horizontal one — the token always means the same visual
thing regardless of orientation.

#### The options string

`CreateLayout(type, options)` (and the `AddX(parent, ..., options)` factories
in general) accepts a single comma-separated string as shorthand for common
setup, parsed by `LayoutElement`'s internal `applyOptions`:

| Token | Effect |
|---|---|
| `FillX`, `FillY`, `FillXY` | 100% width / height / both |
| `Horizontal`, `Vertical` | Sets orientation |
| `Wrap` | Enables flex-wrap |
| `TouchThrough` | Makes the layout pass pointer events through to whatever is behind it |
| `Left`, `Right`, `Top`, `Bottom`, `Center`, `HCenter`, `VCenter` | Forwarded to `SetGravity` |
| `Surface`, `SurfaceContainer`, `SurfaceContainerLow`, `SurfaceContainerHigh`, `SurfaceVariant` | Sets the background to the matching theme CSS variable (e.g. `var(--md-surface)`) so the layout stays theme-reactive |

```typescript
const root = CreateLayout("Linear", "FillXY,Vertical,Center");
const row  = AddLayout(root, "Linear", "Horizontal,Wrap,SurfaceContainer");
```

#### Card-specific & child-wide helpers

```typescript
card.SetCornerRadius(16);
card.SetElevation(3);             // approximated as a computed box-shadow

layout.SetChildMargins(8, 8, 8, 8);  // applied once to all *current* children
layout.SetChildTextSize(14);         // (not reactive — re-call after adding more children)

layout.Resize();  // forces a reflow; mainly useful for children (e.g. canvases)
                   // that don't recompute their size automatically on resize
```

`SetTouchable`/`SetTouchThrough` toggle `pointer-events`, and
`SetOnTouchDown`/`SetOnTouchMove`/`SetOnTouchUp` attach raw
`mousedown`/`mousemove`/`mouseup` listeners to the container itself (again,
mouse events under the hood, not the Pointer/Touch Events API).

### Styling with sva()

`sva()` (`packages/core/src/utils/sva.ts`) is the framework's own small,
hand-rolled CSS-in-JS engine — there's no Tailwind or external styling
library involved. It's how every `mui` component (buttons, FABs, chips,
nav bars, etc.) defines its variant-based styling, in the same spirit as
libraries like `class-variance-authority`, but generating real, cached CSS
rules against a single shared stylesheet rather than relying on utility
classes.

`sva(options)` returns a function; calling *that* function with a props
object returns a generated class name you attach to an element:

```typescript
import { sva } from "../../../core/src/utils/sva.ts";

const fabSva = sva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--md-primary-container)",
    "&:hover": {
      boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
    },
  },
  variants: {
    size: {
      small:  { width: "40px", height: "40px", borderRadius: "12px" },
      medium: { width: "56px", height: "56px", borderRadius: "16px" },
      large:  { width: "96px", height: "96px", borderRadius: "28px" },
    },
  },
  defaultVariants: { size: "medium" },
});

// Later, inside a component:
this.element.classList.add(fabSva({ size: "large" }));
```

**`SVAOptions`:**

| Field | Purpose |
|---|---|
| `base` | A style object always applied. |
| `variants` | A map of prop name → `{ value: style object }`. Whichever value you pass for that prop at call time selects the matching style object. |
| `compoundVariants` | An array of `{ ...matchProps, style }` — the `style` is applied only when *every* listed prop matches simultaneously (e.g. `size: "large"` **and** `disabled: true` together). |
| `defaultVariants` | Fallback values used for any variant prop you don't pass. |

**What happens under the hood, in order:**

1. `mergeStyles(...)` deep-merges the active style objects — `base`, then any
   matched `variants`, then any matched `compoundVariants`, then a one-off
   `props.style` if you passed one. Later objects win on conflicting keys;
   nested objects (like `"&:hover"`) are merged key-by-key rather than
   replaced wholesale.
2. `attachStyleObject(...)` hashes the final merged object (`hashCode`) into
   a deterministic class name (`m3-sva-<hash>`). If that exact style
   combination has already been registered, the cached class name is
   returned immediately — no duplicate CSS is inserted.
3. Otherwise, it injects real rules into a single shared
   `<style id="m3-dynamic-stylesheet">` element via the CSSOM
   (`sheet.insertRule`). Keys are handled based on how they start:
   - `&...` → the `&` is replaced with the generated class, producing a
     nested-selector rule (`"&:hover"` → `.m3-sva-abc123:hover { ... }`).
   - `@media`/`@container`/`@supports` → wrapped as an at-rule around the
     base selector.
   - anything else → treated as a descendant selector
     (`.m3-sva-abc123 <key> { ... }`).
4. `styleObjectToCss(...)` converts camelCase keys to kebab-case CSS
   properties and auto-appends `px` to bare numbers, except for a fixed set
   of unitless properties (`opacity`, `zIndex`, `flexGrow`, `lineHeight`,
   etc.).

`BaseElement.SetStyle(styleObject)` uses this same `attachStyleObject`
machinery directly — so `sva` and `SetStyle` share one underlying CSS
engine. The difference is purely about intent: reach for `sva()` when you're
authoring a reusable component with named variants (as every `mui` component
does), and reach for `SetStyle()` when you just need to style one specific
instance ad hoc.

### Creating Elements from BaseElement

There are two complementary ways new element types get built on top of
`BaseElement` in this codebase.

#### 1. Subclassing BaseElement

To create a new kind of component, extend `BaseElement`, call `super(tag)`
with the HTML tag you want to wrap, and add whatever domain-specific methods
your component needs — always returning `this` so it stays chainable. Here's
the shape `ButtonElement` (`packages/core/src/elements/Button.ts`) follows:

```typescript
import { BaseElement } from "./BaseElement.ts";

export class ButtonElement extends BaseElement {
  constructor(text: string, width = -1, height = -1, options = "") {
    super("button");                 // wrap a real <button>

    this.element.style.cursor = "pointer";
    this.element.style.border = "none";

    if (text) this.SetText(text);

    // parse a comma-separated options string for variant-style shorthand
    const optList = options.split(",").map((o) => o.trim());
    if (optList.includes("FillX")) {
      this.element.style.width = "100%";
    } else {
      this.SetSize(width, height);
    }
  }

  SetText(text: string) {
    this.element.textContent = text;
    return this;                     // keep it chainable
  }

  SetTextColor(color: string) {
    this.element.style.color = color;
    return this;
  }

  override GetType(): string {
    return "Button";                 // friendly name instead of "BUTTON"
  }
}
```

Every element in `packages/core/src/elements/` and every component in
`packages/mui/src/components/` follows this same pattern: wrap one tag in the
constructor, add typed setters/getters on top, override `GetType()`, and
(for `mui` components in particular) use `sva()` inside the constructor or a
private `applyVariant()` method to attach a generated class name — see
`Fab.ts` for a compact real example that combines subclassing with `sva()`.

If your component needs to contain children rather than just wrap a leaf
tag, extend `LayoutElement` instead of `BaseElement` directly, so you inherit
`AddChild`/`RemoveChild`/`Dispose` behavior for free.

#### 2. The Create/Add factory convention

You'll rarely see `new ButtonElement(...)` called directly outside of the
element's own module. Instead, every element type exposes a matching pair of
plain factory functions, defined in `packages/core/src/elements/index.ts`
(core elements) or `packages/mui/src/components/*.ts` (mui components):

```typescript
/** Creates a Button, unattached to any parent. */
export function CreateButton(text: string, width = -1, height = -1, options?: SizeOptions): ButtonElement {
  const btn = new ButtonElement(text);
  if (width !== -1 || height !== -1) btn.SetSize(width, height, options);
  return btn;
}

/** Creates a Button *and* appends it to a parent layout in one call. */
export function AddButton(parent: LayoutElement, text: string, width = -1, height = -1, options?: SizeOptions): ButtonElement {
  const btn = CreateButton(text, width, height, options);
  parent.AddChild(btn);
  return btn;
}
```

The convention holds across the whole framework: `CreateText`/`AddText`,
`CreateImage`/`AddImage`, `CreateCheckBox`/`AddCheckBox`, `CreateFab`/`AddFab`,
and so on. `Create*` builds and configures an instance without touching the
DOM tree; `Add*` does the same and immediately appends it to a given
`LayoutElement` parent, returning the created instance either way so you can
keep chaining or store a reference:

```typescript
const root = CreateLayout("Linear", "FillXY,Vertical");

const label = AddText(root, "Hello!");
const btn = AddButton(root, "Click me").SetOnClick(() => {
  label.SetText("Clicked!");
});

MountRoot(root);
```

`CreateLayout` is a special case of the same idea: it constructs a
`LayoutElement` and then runs it through the internal
`LayoutElement.withOptions(layout, options)` static helper to apply the
options-string shorthand described above — which is exactly why you should
generally prefer `CreateLayout(...)` over `new LayoutElement(...)` when you
want to use that shorthand.

### Theming

The framework uses a token‑based theme system with all M3 color tokens, typography, shape, spacing, and elevation. The `currentTheme` object holds the active tokens.

**Available tokens:** `primary`, `onPrimary`, `primaryContainer`, `onPrimaryContainer`, `secondary`, `surface`, `outline`, `fontFamily`, `shapeCornerLarge`, `elevationLevel3`, etc.

**Switching themes:**

```typescript
ui.SetThemeMode("dark"); // or "light"
ui.SetTheme(customTheme, "light");
```

**Retrieving theme values:**

```typescript
const theme = ui.GetTheme();
const mode = ui.GetThemeMode();
```

### State Management (Signals & Observable)

#### Signals

A `Signal<T>` holds a reactive value and notifies subscribers when it changes.

```typescript
import { CreateSignal, Bind } from "./signals.ts";

const count = CreateSignal(0);
count.Set(count.Get() + 1);

// Subscribe
count.Subscribe((val) => console.log("Count:", val));

// Bind to UI – applies initial value and subscribes
const label = app.CreateText("0");
Bind(count, (val) => label.SetText(String(val)));
```

**API:**

- `Get()` – returns current value
- `Set(value)` – updates value and notifies subscribers
- `Subscribe(callback)` – registers a listener, returns `Unsubscribe`

**Computed signals:**

```typescript
const double = CreateComputed(count, (v) => v * 2);
```

#### Observable

`MakeObservable<T>` wraps a plain object so that any property assignment triggers a notification.

```typescript
import { MakeObservable } from "./observable.ts";

const state = MakeObservable({ name: "Alice", age: 30 });
state.Subscribe((key, value) => {
  console.log(`${key} changed to ${value}`);
});
state.name = "Bob"; // fires callback
```

This is useful for complex state objects.

### Routing

The `BrowserRouter` class maps URL paths to render functions.

```typescript
import { CreateBrowserRouter } from "./router.ts";

const routes = [
  { path: "/", render: () => app.CreateText("Home") },
  { path: "/user/:id", render: (params) => app.CreateText(`User ${params.id}`) },
];

const outlet = app.CreateLayout("Linear");
const router = CreateBrowserRouter(routes, outlet, {
  notFound: () => app.CreateText("404"),
});

// Navigate
router.Navigate("/user/42");
```

The router listens to `popstate` and renders the matched route into the outlet layout.

---

## Components

### Navigation

#### TopAppBar

A top bar with support for **small**, **medium**, **large**, and **center‑aligned** variants. It can attach to a scrollable container to collapse/expand and add elevation.

**Creation:**

```typescript
const appBar = ui.CreateTopAppBar("Title", "medium");
// or AddTopAppBar(parent, "Title", "medium")
```

**Methods:**

- `SetNavigationIcon(iconBtn: BaseElement)` – adds a menu/back icon
- `AddAction(iconBtn: BaseElement)` – adds trailing action icons
- `SetTitle(title: string)` – updates the title
- `AttachScrollable(target: HTMLElement)` – wires scroll‑based collapse/elevation

**Helper:**

```typescript
const icon = ui.CreateAppBarIcon("menu", () => drawer.Open());
appBar.SetNavigationIcon(icon);
```

---

#### NavigationBar

Bottom navigation with up to 5 items.

```typescript
const nav = ui.CreateNavigationBar();
nav.AddItem("home", "Home", "home");
nav.AddItem("search", "Search", "search");
nav.SetOnSelect((index, value) => console.log(value));
```

---

#### NavigationRail

Side rail for desktop/tablet. Supports a FAB at the top.

```typescript
const rail = ui.CreateNavigationRail();
rail.AddItem("home", "Home", "home");
rail.SetFab(fabComponent);
```

---

#### NavigationDrawer

Modal or standard drawer with items.

```typescript
const drawer = ui.CreateNavigationDrawer("modal");
drawer.AddItem("Home", "home");
drawer.SetOnSelect((index, label) => {});
drawer.Open();
drawer.Close();
```

---

#### Tabs

Primary (full‑width) or secondary (wrap) tabs with an indicator.

```typescript
const tabs = ui.CreateTabs("primary");
tabs.AddTab("Tab 1");
tabs.AddTab("Tab 2");
tabs.SetActiveIndex(0);
tabs.SetOnSelect((index) => {});
```

---

### Buttons & FABs

#### Button

Five variants: `elevated`, `filled`, `filled‑tonal`, `outlined`, `text`.

```typescript
const btn = ui.CreateButton("Label", "filled");
btn.SetOnClick(() => {});
```

---

#### FAB

Floating action button – sizes: `small`, `medium`, `large`.

```typescript
const fab = ui.CreateFab("add", "medium");
fab.SetIcon("edit");
fab.SetOnClick(() => {});
```

---

#### ExtendedFAB

FAB with a label that can extend/shrink.

```typescript
const extFab = ui.CreateExtendedFab("add", "Create", "medium");
extFab.Extend();  // show label
extFab.Shrink();  // icon only
```

---

#### FabMenu

A FAB that expands into a menu of actions.

```typescript
const menu = ui.CreateFabMenu("add", "close");
menu.AddItem("edit", "Edit", () => {});
menu.AddItem("delete", "Delete", () => {});
menu.Toggle();
```

---

#### IconButton

A circular icon button with hover effect.

```typescript
const iconBtn = ui.CreateIconButton("favorite");
iconBtn.SetOnClick(() => {});
```

---

#### SegmentedButton

A group of toggleable segments (single or multi‑select).

```typescript
const seg = ui.CreateSegmentedButton(false);
seg.AddSegment("Day", "day", "today");
seg.AddSegment("Week", "week", "week");
seg.SetOnSelect((index, value) => {});
```

---

### Inputs & Forms

#### TextField

Filled or outlined text input with label, placeholder, supporting text, and error state.

```typescript
const field = ui.CreateTextField("Username", "filled");
field.SetValue("john");
field.SetPlaceholder("Enter username");
field.SetSupportingText("Required", true); // error
field.SetOnChange((val) => {});
```

---

#### Checkbox

M3 checkbox with label and indeterminate state.

```typescript
const cb = ui.CreateCheckbox("Accept terms");
cb.SetChecked(true);
cb.SetOnChange((checked) => {});
```

---

#### Switch

M3 toggle switch.

```typescript
const sw = ui.CreateSwitch();
sw.SetChecked(true);
sw.SetOnChange((checked) => {});
```

---

#### Radio

Radio button for groups.

```typescript
const radio = ui.CreateRadio("group", "value", "Option");
radio.SetChecked(true);
radio.SetOnChange((checked, value) => {});
```

---

#### Slider

Continuous or discrete slider with value label.

```typescript
const slider = ui.CreateSlider(0, 100, 50, "continuous");
slider.ShowValueLabel();
slider.SetOnChange((val) => {});
```

---

#### Chip

Four variants: `assist`, `filter`, `input`, `suggestion`.

```typescript
const chip = ui.CreateChip("Label", "filter");
chip.SetSelected(true);
chip.SetOnSelect((selected) => {});
// Input chips support remove
chip.SetOnRemove(() => {});
```

---

### Feedback & Overlays

#### Dialog

Basic or full‑screen dialogs with icon, title, content, divider, and actions.

**Basic dialog:**

```typescript
const dialog = ui.CreateDialog("basic");
dialog.SetIcon("warning");
dialog.SetTitle("Title");
dialog.SetContent("Content");
dialog.AddAction("Cancel", () => dialog.Close());
dialog.AddAction("OK", () => {});
dialog.Show();
```

**Full‑screen dialog:**

```typescript
const full = ui.CreateDialog("full-screen");
full.SetTitle("New Event");
full.AddAction("Save", () => {});
full.AddContent(someLayout);
full.Show();
```

---

#### BottomSheet

Modal bottom sheet sliding up from the bottom.

```typescript
const sheet = ui.CreateBottomSheet();
sheet.SetContent("Content");
sheet.Show();
sheet.Close();
```

---

#### Snackbar

Brief notification with optional action.

```typescript
const snack = ui.CreateSnackbar("Message", "Undo", () => {});
snack.Show();
```

---

#### Tooltip

Hover tooltip attached to any `BaseElement`.

```typescript
const tooltip = ui.CreateTooltip(button, "Help text");
```

---

#### Menu

Dropdown menu anchored to a position or element.

```typescript
const menu = ui.CreateMenu();
menu.AddItem("Copy", () => {}, "content_copy");
menu.AddItem("Paste", () => {}, "content_paste");
menu.ShowAtElement(button.element);
menu.Close();
```

---

#### Badge

Small dot or large numeric badge.

```typescript
const badge = ui.CreateBadge("small");
const badgeLarge = ui.CreateBadge("large", "5");
ui.AddBadge(parentElement, "large", "99+");
```

---

### Display & Layout

#### Card

Elevated, filled, or outlined card with header and content.

```typescript
const card = ui.CreateCard("elevated");
card.SetHeader("Header");
card.SetContent("Content");
card.SetOnClick(() => {});
```

---

#### List & ListItem

A scrollable list container and individual items with leading/trailing content.

```typescript
const list = ui.CreateList();
const item = ui.CreateListItem("Headline");
item.SetSupportingText("Supporting");
item.SetLeadingIcon("folder");
item.SetTrailingContent(someElement);
list.element.appendChild(item.element);
```

---

#### Divider

Horizontal divider line.

```typescript
const divider = ui.CreateDivider();
```

---

### Progress & Badges

#### LinearProgress

Determinate or indeterminate.

```typescript
const prog = ui.CreateLinearProgress();
prog.SetProgress(50);   // 0‑100
prog.SetProgress(null); // indeterminate
```

---

#### CircularProgress

Determinate or indeterminate circular indicator.

```typescript
const prog = ui.CreateCircularProgress();
prog.SetProgress(75);
prog.SetProgress(null);
```

---

## Utilities

### CreateLayout & AddLayout

The core factory for creating layouts. The options string supports:

- `FillX`, `FillY`, `FillXY` – fill parent
- `Horizontal`, `Vertical` – orientation
- `Wrap` – flex‑wrap
- `Left`, `Right`, `Top`, `Bottom`, `Center`, `HCenter`, `VCenter` – gravity
- `TouchThrough` – pass‑through events

```typescript
const layout = app.CreateLayout("Linear", "FillXY,Vertical");
// or AddLayout(parent, "Linear", "Horizontal,Wrap")
```

### MountRoot

Mounts a layout into the DOM element with the given ID (default `"root"`).

```typescript
app.MountRoot(root); // mounts to #root
app.MountRoot(root, "app-container");
```

### Development Server

The provided `main.ts` uses Deno to serve the app. In development, it proxies to Vite dev server (port 5173). In production, it serves static files from `./dist`.

Run the dev server:

```bash
deno task dev
```

---

## API Reference

### BaseElement API

| Method | Description |
|--------|-------------|
| `SetBackColor(color)` | Sets background color |
| `SetBackAlpha(alpha)` | Sets opacity (0‑1 or 1‑256 inverted) |
| `SetBackGradient(c1, c2?, c3?, options)` | Linear gradient |
| `SetBackGradientRadial(x, y, radius, c1, c2?, c3?)` | Radial gradient |
| `SetBackground(file, options)` | Image background, optionally repeat |
| `SetColorFilter(color, mode)` | Tints with blend mode |
| `AdjustColor(hue, sat, bright, contrast)` | Adjusts hue/saturation/brightness/contrast |
| `SetScale(x, y)` | Scales element |
| `SetSize(width, height, options)` | Size in fractions or pixels |
| `GetWidth(options?)`, `GetHeight(options?)` | Get size relative to parent |
| `GetAbsWidth()`, `GetAbsHeight()` | Pixel size |
| `SetPosition(left, top, width?, height?, options)` | Absolute positioning |
| `GetLeft(options?)`, `GetTop(options?)`, `GetPosition()` | Position getters |
| `SetMargins(l, t, r, b, mode)` | Outer margins |
| `SetPadding(l, t, r, b, mode)` | Inner padding |
| `Show()`, `Hide()`, `Gone()`, `SetVisibility()` | Visibility control |
| `IsVisible()` | Checks visibility |
| `SetEnabled(enabled)`, `IsEnabled()` | Enable/disable interaction |
| `Focus()`, `ClearFocus()` | Focus management |
| `SetDescription(desc)` | Accessibility label |
| `SetOnTouch(callback)`, `SetOnLongTouch(callback, ms)` | Click/long‑press handlers |
| `Animate(keyframes, options, callback)` | Web Animations |
| `Tween(target, duration, callback)` | Smooth transition |
| `GetType()` | Returns component type (e.g., "Button") |
| `Batch(properties)` | Calls multiple methods in one go |

### LayoutElement API

| Method | Description |
|--------|-------------|
| `AddChild(child, order?)` | Adds a child, optionally at index |
| `RemoveChild(child)`, `DestroyChild(child)` | Removes child |
| `ChildToFront(child)` | Brings to front (changes z‑order) |
| `GetChildOrder(child)` | Returns child index |
| `SetOrientation(orient)` | "Horizontal" or "Vertical" |
| `SetGravity(gravity)` | "Left", "Right", "Top", "Bottom", "Center", "HCenter", "VCenter" |
| `SetWrap(wrap)` | Enable flex‑wrap |
| `SetCornerRadius(radius)`, `SetElevation(elevation)` | For Card layouts |
| `SetChildMargins(l, t, r, b, mode)` | Applies margins to all children |
| `SetChildTextSize(size, mode)` | Applies font size to all children |
| `Resize()` | Forces reflow |
| `SetTouchable(touchable)`, `SetTouchThrough(through)` | Pointer‑events control |
| `SetOnTouchDown/Move/Up(callback)` | Touch event listeners |

### Signal API

```typescript
interface Signal<T> {
  Get(): T;
  Set(value: T): void;
  Subscribe(callback: (value: T) => void): Unsubscribe;
}
```

**Factory:** `CreateSignal<T>(initialValue): Signal<T>`
**Binding helper:** `Bind(signal, applyFn): Unsubscribe`
**Computed:** `CreateComputed(source, computeFn): Signal<R>`

### Observable API

```typescript
function MakeObservable<T extends object>(target: T): T & {
  Subscribe(callback: ObservableCallback<T>): Unsubscribe;
}
```

The callback receives `(key, value, target)` when any property is changed.

### Router API

```typescript
class BrowserRouter {
  constructor(routes: Route[], outlet: LayoutElement, options?: { notFound?: (params) => BaseElement });
  Navigate(path: string): void;
  Back(): void;
  Forward(): void;
}
```

**Route type:**

```typescript
interface Route {
  path: string;            // e.g. "/user/:id"
  render: (params: RouteParams) => BaseElement;
}
```

---

## Example App (App.ts)

The included `App.ts` demonstrates nearly every component in a single page. It shows:

- TopAppBar with scroll‑based collapse
- NavigationBar
- Scroller with body content
- Buttons, SegmentedButton, Card, FAB, ExtendedFAB, FabMenu
- IconButtons with Tooltips
- Menu anchored to a button
- Dialog variants (basic, full‑screen)
- Snackbar, BottomSheet, Drawer (commented)
- Slider, Switch, Radio, Checkbox, Chips, TextField
- Linear and Circular Progress, Badge
- Divider, List, etc.

It also includes lifecycle hooks `OnPause`, `OnResume`, `OnConfig`, and `OnBack`.

---

## Conclusion

This framework provides a robust, M3‑compliant UI toolkit for building modern web applications. Its component‑based architecture, theming system, and reactive state management make it suitable for projects of any size. The extensive API and type safety ensure a smooth development experience.

For further details, refer to the source code and the `App.ts` example for practical usage.
