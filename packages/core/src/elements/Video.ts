import { BaseElement } from "./BaseElement.ts";

/** Plays video content. */
export class VideoViewElement extends BaseElement {
  declare element: HTMLVideoElement;

  constructor() {
    super("video");
    this.element.controls = true;
  }

  /** Sets the video source. */
  SetSrc(path: string) {
    this.element.src = path;
    return this;
  }

  /** Starts playback. */
  Play() {
    this.element.play();
    return this;
  }

  /** Pauses playback. */
  Pause() {
    this.element.pause();
    return this;
  }
}
