/** Audio-only playback control, separate from the video-focused VideoViewElement. */
export class MediaPlayerElement {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
  }

  /** Sets the audio source. */
  SetSrc(path: string) {
    this.audio.src = path;
    return this;
  }

  /** Starts playback. */
  Play() {
    this.audio.play();
    return this;
  }

  /** Pauses playback. */
  Pause() {
    this.audio.pause();
    return this;
  }

  /** Stops and resets playback to the start. */
  Stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    return this;
  }

  /** Sets volume, 0..1. */
  SetVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    return this;
  }

  /** Gets total duration in seconds. */
  GetDuration(): number {
    return this.audio.duration || 0;
  }

  /** Gets current playback position in seconds. */
  GetPosition(): number {
    return this.audio.currentTime;
  }

  /** Seeks to a position in seconds. */
  SeekTo(seconds: number) {
    this.audio.currentTime = seconds;
    return this;
  }

  /** Fires when playback finishes. */
  SetOnComplete(callback: () => void) {
    this.audio.addEventListener("ended", callback);
    return this;
  }
}

/** Creates an audio media player. */
export function CreateMediaPlayer(): MediaPlayerElement {
  return new MediaPlayerElement();
}
