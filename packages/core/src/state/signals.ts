export type Unsubscribe = () => void;

/** A single reactive value with subscribable change notifications. */
export interface Signal<T> {
  Get(): T;
  Set(value: T): void;
  Subscribe(callback: (value: T) => void): Unsubscribe;
}

/** Creates a reactive value that notifies subscribers on change. */
export function CreateSignal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<(value: T) => void>();

  return {
    Get(): T {
      return value;
    },
    Set(newValue: T) {
      if (newValue === value) return;
      value = newValue;
      subscribers.forEach((cb) => cb(value));
    },
    Subscribe(callback: (value: T) => void): Unsubscribe {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
  };
}
/**
 * Bind function.
 * @param {Signal<T>} signal - The signal parameter
 * @param {(value: T) => void} apply - The apply parameter
 * @returns {Unsubscribe}
 *
 */
export function Bind<T>(
  signal: Signal<T>,
  apply: (value: T) => void,
): Unsubscribe {
  apply(signal.Get()); // apply immediately so UI starts in sync
  return signal.Subscribe(apply);
}

/**
 * CreateComputed function.
 * @param {Signal<T>} source - The source parameter
 * @param {(value: T) => R} compute - The compute parameter
 * @returns {Signal<R>}
 *
 */
export function CreateComputed<T, R>(
  source: Signal<T>,
  compute: (value: T) => R,
): Signal<R> {
  const computed = CreateSignal(compute(source.Get()));
  source.Subscribe((v) => computed.Set(compute(v)));
  return computed;
}
