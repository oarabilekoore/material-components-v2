/** Records audio from the microphone. */
export class AudioRecorderElement {
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /** Starts recording. */
  async Start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recorder = new MediaRecorder(this.stream);
    this.chunks = [];
    this.recorder.ondataavailable = (e) => this.chunks.push(e.data);
    this.recorder.start();
  }

  /** Stops recording. Resolves with the recorded audio as a Blob. */
  Stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.recorder) return resolve(new Blob());
      this.recorder.onstop = () => {
        this.stream?.getTracks().forEach((t) => t.stop());
        resolve(new Blob(this.chunks, { type: "audio/webm" }));
      };
      this.recorder.stop();
    });
  }

  /** True while actively recording. */
  IsRecording(): boolean {
    return this.recorder?.state === "recording";
  }
}

/** Creates an audio recorder. */
export function CreateAudioRecorder(): AudioRecorderElement {
  return new AudioRecorderElement();
}
