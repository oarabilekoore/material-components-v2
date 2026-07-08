export type SensorType = "motion" | "orientation";

/** Device motion/orientation sensor access. */
export class SensorElement {
  /** Listens for motion or orientation updates. */
  SetOnChange(
    type: SensorType,
    callback: (event: DeviceMotionEvent | DeviceOrientationEvent) => void,
  ) {
    const eventName = type === "motion" ? "devicemotion" : "deviceorientation";
    globalThis.addEventListener(eventName, callback as EventListener);
  }

  /** Requests permission for motion/orientation access (required on iOS 13+). */
  async RequestPermission(): Promise<boolean> {
    // deno-lint-ignore no-explicit-any
    const DME = DeviceMotionEvent as any;
    if (typeof DME?.requestPermission === "function") {
      const result = await DME.requestPermission();
      return result === "granted";
    }
    return true; // no permission gate needed on this platform
  }
}

/** Creates a sensor reader. */
export function CreateSensor(): SensorElement {
  return new SensorElement();
}
