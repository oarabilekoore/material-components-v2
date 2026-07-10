/** Speech-to-text via the Web Speech API. */
export class SpeechRecElement {
  // deno-lint-ignore no-explicit-any
  private recognition: any;

  constructor() {
    // deno-lint-ignore no-explicit-any
    const SR =
      (globalThis as any).SpeechRecognition ??
      (globalThis as any).webkitSpeechRecognition;
    this.recognition = SR ? new SR() : null;
  }

  /** Fires with the recognized text. */
  SetOnResult(callback: (text: string) => void) {
    if (!this.recognition) return;
    // deno-lint-ignore no-explicit-any
    this.recognition.onresult = (e: any) =>
      callback(e.results[0][0].transcript);
  }

  /** Starts listening. */
  Start() {
    this.recognition?.start();
  }

  /** Stops listening. */
  Stop() {
    this.recognition?.stop();
  }

  /** True if speech recognition is supported in this browser. */
  IsSupported(): boolean {
    return this.recognition !== null;
  }
}

/** Creates a speech recognizer. */
export function CreateSpeechRec(): SpeechRecElement {
  return new SpeechRecElement();
}

/** Text-to-speech via the Web Speech API. */
export class SynthElement {
  /** Speaks the given text. */
  Speak(text: string, lang = "en-US") {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }

  /** Stops all speech. */
  Stop() {
    speechSynthesis.cancel();
  }
}

/** Creates a text-to-speech synthesizer. */
export function CreateSynth(): SynthElement {
  return new SynthElement();
}
