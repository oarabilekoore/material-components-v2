import { LayoutElement, LayoutType } from "./Layout.ts";
import { ButtonElement } from "./Button.ts";
import { TextElement } from "./Text.ts";
import { ImageElement } from "./Image.ts";
import { VideoViewElement } from "./Video.ts";
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
/**
 * MountRoot function.
 * @param {LayoutElement} layout - The layout parameter
 * @param {any} rootId - The rootId parameter
 * @returns {boolean}
 *
 */
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
