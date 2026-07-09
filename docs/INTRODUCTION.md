# Material Design 3 Framework – Complete Documentation

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
   - [BaseElement](#baseelement)
   - [LayoutElement](#layoutelement)
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

  const body = app.AddScroller(root, -1, -1, "FillX,Vertical");
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

All UI components inherit from `BaseElement`, which wraps an `HTMLElement`. It provides methods for:

- Styling (colors, gradients, backgrounds, shadows)
- Sizing & positioning (fractions or pixels)
- Visibility (show, hide, gone)
- Interactivity (click, long‑press, focus, enable/disable)
- Animations (Web Animations API, tweening)
- Measurement & collision detection

Every component returns `this` from most methods, enabling **method chaining**.

### LayoutElement

`LayoutElement` extends `BaseElement` and acts as a container for child components. It supports four layout types:

- **Linear** – flexbox layout (horizontal or vertical) with gravity and wrapping
- **Absolute** – absolute positioning (like Android’s `FrameLayout`)
- **Frame** – stacked children with z‑order (similar to `FrameLayout`)
- **Card** – a card with rounded corners and elevation

`LayoutElement` manages child addition/removal, ordering, and child‑wide defaults (margins, text size).

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
