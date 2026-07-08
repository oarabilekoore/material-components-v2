import { LayoutElement, LayoutType } from "./layout_element.ts";
import { ButtonElement } from "./button_element.ts";
import { TextElement } from "./text_element.ts";
import { ImageElement } from "./image_element.ts";
import { CheckBoxElement } from "./checkbox_element.ts";
import { SwitchElement } from "./switch_element.ts";
import { SeekBarElement } from "./seekbar_element.ts";
import { SpinnerElement } from "./spinner_element.ts";
import { TextEditElement } from "./textedit_element.ts";
import { ListElement } from "./list_element.ts";
import { ScrollerElement } from "./scroller_element.ts";
import { WebViewElement } from "./webview_element.ts";
import { VideoViewElement } from "./videoview_element.ts";
type SizeOptions = { px?: boolean };

/** Creates a Layout container. */
export function CreateLayout(
  type: LayoutType = "Linear",
  options?: string,
): LayoutElement {
  const layout = new LayoutElement(type);
  return LayoutElement.withOptions(layout, options);
}
//** Mounts a Layout as the app's root, appending it to the #root element. */
export function MountRoot(layout: LayoutElement, rootId = "root"): boolean {
  const root = document.getElementById(rootId);
  if (!root) {
    console.error(`MountRoot: element #${rootId} not found`);
    return false;
  }
  root.appendChild(layout.element);
  return true;
}

/** Creates and adds a Layout to a parent Layout. */
export function AddLayout(
  parent: LayoutElement,
  type: LayoutType = "Linear",
  options?: string,
): LayoutElement {
  const layout = CreateLayout(type, options);
  parent.AddChild(layout);
  return layout;
}

/** Creates a Button. */
export function CreateButton(
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): ButtonElement {
  const btn = new ButtonElement("button");
  btn.SetText(text);
  if (width !== -1 || height !== -1) btn.SetSize(width, height, options);
  return btn;
}

/** Creates and adds a Button to a Layout. */
export function AddButton(
  parent: LayoutElement,
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): ButtonElement {
  const btn = CreateButton(text, width, height, options);
  parent.AddChild(btn);
  return btn;
}

/** Creates a Text label. */
export function CreateText(
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): TextElement {
  const txt = new TextElement("span");
  txt.SetText(text);
  if (width !== -1 || height !== -1) txt.SetSize(width, height, options);
  return txt;
}

/** Creates and adds a Text label to a Layout. */
export function AddText(
  parent: LayoutElement,
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): TextElement {
  const txt = CreateText(text, width, height, options);
  parent.AddChild(txt);
  return txt;
}

/** Creates an Image. */
export function CreateImage(
  path: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): ImageElement {
  const img = new ImageElement();
  img.SetSrc(path);
  if (width !== -1 || height !== -1) img.SetSize(width, height, options);
  return img;
}

/** Creates and adds an Image to a Layout. */
export function AddImage(
  parent: LayoutElement,
  path: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): ImageElement {
  const img = CreateImage(path, width, height, options);
  parent.AddChild(img);
  return img;
}

/** Creates a CheckBox. */
export function CreateCheckBox(
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): CheckBoxElement {
  const box = new CheckBoxElement();
  box.SetText(text);
  if (width !== -1 || height !== -1) box.SetSize(width, height, options);
  return box;
}

/** Creates and adds a CheckBox to a Layout. */
export function AddCheckBox(
  parent: LayoutElement,
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): CheckBoxElement {
  const box = CreateCheckBox(text, width, height, options);
  parent.AddChild(box);
  return box;
}

/** Creates a Switch. */
export function CreateSwitch(
  width = -1,
  height = -1,
  options?: SizeOptions,
): SwitchElement {
  const sw = new SwitchElement();
  if (width !== -1 || height !== -1) sw.SetSize(width, height, options);
  return sw;
}

/** Creates and adds a Switch to a Layout. */
export function AddSwitch(
  parent: LayoutElement,
  width = -1,
  height = -1,
  options?: SizeOptions,
): SwitchElement {
  const sw = CreateSwitch(width, height, options);
  parent.AddChild(sw);
  return sw;
}

/** Creates a Toggle (alias for Switch). */
export const CreateToggle = CreateSwitch;
/** Creates and adds a Toggle to a Layout (alias for AddSwitch). */
export const AddToggle = AddSwitch;

/** Creates a SeekBar (draggable slider). */
export function CreateSeekBar(
  width = -1,
  height = -1,
  options?: SizeOptions,
): SeekBarElement {
  const bar = new SeekBarElement();
  if (width !== -1 || height !== -1) bar.SetSize(width, height, options);
  return bar;
}

/** Creates and adds a SeekBar to a Layout. */
export function AddSeekBar(
  parent: LayoutElement,
  width = -1,
  height = -1,
  options?: SizeOptions,
): SeekBarElement {
  const bar = CreateSeekBar(width, height, options);
  parent.AddChild(bar);
  return bar;
}

/** Creates a Spinner (dropdown). */
export function CreateSpinner(
  items: string[] = [],
  width = -1,
  height = -1,
  options?: SizeOptions,
): SpinnerElement {
  const spin = new SpinnerElement(items);
  if (width !== -1 || height !== -1) spin.SetSize(width, height, options);
  return spin;
}

/** Creates and adds a Spinner to a Layout. */
export function AddSpinner(
  parent: LayoutElement,
  items: string[] = [],
  width = -1,
  height = -1,
  options?: SizeOptions,
): SpinnerElement {
  const spin = CreateSpinner(items, width, height, options);
  parent.AddChild(spin);
  return spin;
}

/** Creates a TextEdit field. multiLine=true for a textarea. */
export function CreateTextEdit(
  hint = "",
  multiLine = false,
  width = -1,
  height = -1,
  options?: SizeOptions,
): TextEditElement {
  const edit = new TextEditElement(multiLine);
  edit.SetHint(hint);
  if (width !== -1 || height !== -1) edit.SetSize(width, height, options);
  return edit;
}

/** Creates and adds a TextEdit field to a Layout. */
export function AddTextEdit(
  parent: LayoutElement,
  hint = "",
  multiLine = false,
  width = -1,
  height = -1,
  options?: SizeOptions,
): TextEditElement {
  const edit = CreateTextEdit(hint, multiLine, width, height, options);
  parent.AddChild(edit);
  return edit;
}

/** Creates a scrollable List. */
export function CreateList(
  width = -1,
  height = -1,
  options?: SizeOptions,
): ListElement {
  const list = new ListElement();
  if (width !== -1 || height !== -1) list.SetSize(width, height, options);
  return list;
}

/** Creates and adds a List to a Layout. */
export function AddList(
  parent: LayoutElement,
  width = -1,
  height = -1,
  options?: SizeOptions,
): ListElement {
  const list = CreateList(width, height, options);
  parent.AddChild(list);
  return list;
}
/** Creates a Scroller. */
export function CreateScroller(
  width = -1,
  height = -1,
  options?: string,
): ScrollerElement {
  const scroller = new ScrollerElement();
  scroller.applyScrollerOptions(options);
  if (width !== -1 || height !== -1) scroller.SetSize(width, height);
  return scroller;
}

/** Creates and adds a Scroller to a Layout. */
export function AddScroller(
  parent: LayoutElement,
  width = -1,
  height = -1,
  options?: string,
): ScrollerElement {
  const scroller = CreateScroller(width, height, options);
  parent.AddChild(scroller);
  return scroller;
}
/** Creates a WebView. */
export function CreateWebView(
  url = "",
  width = -1,
  height = -1,
  options?: SizeOptions,
): WebViewElement {
  const web = new WebViewElement();
  if (url) web.LoadUrl(url);
  if (width !== -1 || height !== -1) web.SetSize(width, height, options);
  return web;
}

/** Creates and adds a WebView to a Layout. */
export function AddWebView(
  parent: LayoutElement,
  url = "",
  width = -1,
  height = -1,
  options?: SizeOptions,
): WebViewElement {
  const web = CreateWebView(url, width, height, options);
  parent.AddChild(web);
  return web;
}

/** Creates a VideoView. */
export function CreateVideoView(
  path = "",
  width = -1,
  height = -1,
  options?: SizeOptions,
): VideoViewElement {
  const video = new VideoViewElement();
  if (path) video.SetSrc(path);
  if (width !== -1 || height !== -1) video.SetSize(width, height, options);
  return video;
}

/** Creates and adds a VideoView to a Layout. */
export function AddVideoView(
  parent: LayoutElement,
  path = "",
  width = -1,
  height = -1,
  options?: SizeOptions,
): VideoViewElement {
  const video = CreateVideoView(path, width, height, options);
  parent.AddChild(video);
  return video;
}
