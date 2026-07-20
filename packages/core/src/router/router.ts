import { BaseElement } from "../elements/BaseElement.ts";
import { LayoutElement } from "../elements/Layout.ts";

export interface RouteParams {
  [key: string]: string;
}

export interface Route {
  path: string;
  render: (params: RouteParams) => BaseElement;
}

/** Matches a pattern against the start of a pathname. Returns matched params + unconsumed remainder, or null. */
export function matchPathPrefix(pattern: string, pathname: string): { params: RouteParams; remainder: string } | null {
  const patternSegments = pattern.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);
  if (pathSegments.length < patternSegments.length) return null;

  const params: RouteParams = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const p = patternSegments[i];
    const seg = pathSegments[i];
    if (p.startsWith(":")) params[p.slice(1)] = seg;
    else if (p !== seg) return null;
  }

  const remainder = "/" + pathSegments.slice(patternSegments.length).join("/");
  return { params, remainder };
}

export function getHashPathname(): string {
  if (typeof globalThis === "undefined" || !globalThis.location) return "/";
  let hash = globalThis.location.hash;
  if (hash.startsWith("#")) hash = hash.substring(1);
  return hash || "/";
}

/** Navigates to a new path without a full page reload. Any mounted Outlet reacts via hashchange. */
export function Navigate(path: string) {
  if (typeof globalThis === "undefined" || !globalThis.location) return;
  if (getHashPathname() !== path) {
    globalThis.location.hash = path;
  }
}

let anchorInterceptInstalled = false;

/** Installs global anchor-click interception once, regardless of how many Outlets exist. */
export function ensureAnchorIntercept() {
  if (anchorInterceptInstalled || typeof globalThis === "undefined" || !globalThis.addEventListener) return;
  anchorInterceptInstalled = true;
  globalThis.document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (anchor && anchor.href) {
      const url = new URL(anchor.href, globalThis.location.href);
      if (url.origin === globalThis.location.origin) {
        e.preventDefault();
        Navigate(url.pathname === "/" ? "/" : url.pathname);
      }
    }
  });
}


/** Path-based client-side router rendering into an outlet Layout. */
export class BrowserRouter {
  private routes: Route[] = [];
  private outlet: LayoutElement;
  private notFound?: (params: RouteParams) => BaseElement;

  constructor(
    outlet: LayoutElement,
    options?: { notFound?: (params: RouteParams) => BaseElement },
  ) {
    this.outlet = outlet;
    this.notFound = options?.notFound;

    if (typeof globalThis !== "undefined" && globalThis.addEventListener) {
      globalThis.addEventListener("hashchange", () => this.render());
      ensureAnchorIntercept();
    }

    this.render();
  }

  addRoute(path: string, render: (params: RouteParams) => BaseElement): this {
    this.routes.push({ path, render });
    this.render();
    return this;
  }

  private matchRoute(
    pathname: string,
  ): { route: Route; params: RouteParams } | null {
    for (const route of this.routes) {
      const paramNames: string[] = [];
      const pattern = route.path.replace(/:([^/]+)/g, (_m, name: string) => {
        paramNames.push(name);
        return "([^/]+)";
      });
      const match = pathname.match(new RegExp(`^${pattern}$`));
      if (match) {
        const params: RouteParams = {};
        paramNames.forEach((name, i) => (params[name] = match[i + 1]));
        return { route, params };
      }
    }
    return null;
  }

  private getPathname(): string {
    return getHashPathname();
  }

  private render() {
    if (typeof globalThis === "undefined" || !globalThis.location) return;
    const pathname = this.getPathname();
    const matched = this.matchRoute(pathname);
    this.outlet.Clear();

    if (matched) {
      this.outlet._internalMount(matched.route.render(matched.params));
    } else if (this.notFound) {
      this.outlet._internalMount(this.notFound({}));
    }
  }

  /** Navigates to a new path without a full page reload. */
  Navigate(path: string) {
    Navigate(path);
  }

  /** Goes back in browser history. */
  Back() {
    if (typeof globalThis !== "undefined" && globalThis.history) {
      globalThis.history.back();
    }
  }

  /** Goes forward in browser history. */
  Forward() {
    if (typeof globalThis !== "undefined" && globalThis.history) {
      globalThis.history.forward();
    }
  }
}

/** Creates a browser router that renders matched routes into an outlet Layout. */
export function CreateBrowserRouter(
  outlet: LayoutElement,
  options?: { notFound?: (params: RouteParams) => BaseElement },
): BrowserRouter {
  return new BrowserRouter(outlet, options);
}
