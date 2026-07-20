import { LayoutElement, LayoutType, currentAutoBindTarget } from "./Layout.ts";
export { currentAutoBindTarget };
import { ButtonElementEl } from "./Button.ts";
import { TextElementEl } from "./Text.ts";
import { ImageElement } from "./Image.ts";
import { VideoViewElement } from "./Video.ts";
type SizeOptions = { px?: boolean };

/** Creates a Layout container. */
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


/** Creates a Button. */
export function CreateButton(
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): ButtonElementEl {
  const btn = new ButtonElementEl("button");
  btn.SetText(text);
  if (width !== -1 || height !== -1) btn.SetSize(width, height, options);
  return btn;
}

/** Creates and adds a Button to a Layout. */
export function Button(
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
  bindOptions?: { into?: LayoutElement; mountTarget?: HTMLElement },
): ButtonElementEl {
  const btn = CreateButton(text, width, height, options);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
  if (parentTarget) parentTarget._internalMount(btn);
  else document.body.appendChild(btn.element);
  return btn;
}

/** Creates a Text label. */
export function CreateText(
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
): TextElementEl {
  const txt = new TextElementEl("span");
  txt.SetText(text);
  if (width !== -1 || height !== -1) txt.SetSize(width, height, options);
  return txt;
}

/** Creates and adds a Text label to a Layout. */
export function Text(
  text: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
  bindOptions?: { into?: LayoutElement; mountTarget?: HTMLElement },
): TextElementEl {
  const txt = CreateText(text, width, height, options);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
  if (parentTarget) parentTarget._internalMount(txt);
  else document.body.appendChild(txt.element);
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
export function Image(
  path: string,
  width = -1,
  height = -1,
  options?: SizeOptions,
  bindOptions?: { into?: LayoutElement; mountTarget?: HTMLElement },
): ImageElement {
  const img = CreateImage(path, width, height, options);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
  if (parentTarget) parentTarget._internalMount(img);
  else document.body.appendChild(img.element);
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
export function VideoView(
  path = "",
  width = -1,
  height = -1,
  options?: SizeOptions,
  bindOptions?: { into?: LayoutElement; mountTarget?: HTMLElement },
): VideoViewElement {
  const video = CreateVideoView(path, width, height, options);
  const parentTarget = bindOptions?.into ?? currentAutoBindTarget();
  if (parentTarget) parentTarget._internalMount(video);
  else document.body.appendChild(video.element);
  return video;
}
