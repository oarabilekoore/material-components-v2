export interface Location {
  lat: number;
  lon: number;
  accuracy: number;
}

/** GPS/network location via the browser Geolocation API. */
export class LocatorElement {
  private watchId: number | null = null;

  /** Gets the current location once. */
  GetLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }),
        (err) => reject(err),
      );
    });
  }

  /** Watches location changes, firing callback on each update. */
  Watch(callback: (loc: Location) => void) {
    this.watchId = navigator.geolocation.watchPosition((pos) => {
      callback({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
    });
  }

  /** Stops watching location changes. */
  ClearWatch() {
    if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId);
    this.watchId = null;
  }
}

/** Creates a location provider. */
export function CreateLocator(): LocatorElement {
  return new LocatorElement();
}
