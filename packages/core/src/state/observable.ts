import type { Unsubscribe } from "./signals.ts";

export type ObservableCallback<T> = (
  key: keyof T,
  value: T[keyof T],
  target: T,
) => void;

/** Wraps an object so any property assignment notifies subscribers. */
export function MakeObservable<T extends object>(
  target: T,
): T & { Subscribe(callback: ObservableCallback<T>): Unsubscribe } {
  const subscribers = new Set<ObservableCallback<T>>();
  const withSubscribe = target as T & {
    Subscribe(callback: ObservableCallback<T>): Unsubscribe;
  };

  Object.defineProperty(withSubscribe, "Subscribe", {
    value: (callback: ObservableCallback<T>): Unsubscribe => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    enumerable: false,
  });

  return new Proxy(withSubscribe, {
    set(obj, prop, value) {
      if (prop === "Subscribe") return true;
      const key = prop as keyof T;
      if (obj[key] === value) return true;
      obj[key] = value;
      subscribers.forEach((cb) => cb(key, value, obj));
      return true;
    },
  });
}
