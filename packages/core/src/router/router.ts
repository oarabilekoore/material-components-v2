import { BaseElement } from "../elements/BaseElement.ts";
import { LayoutElement } from "../elements/Layout.ts";

export interface RouteParams {
  [key: string]: string;
}

export interface Route {
  path: string;
  render: (params: RouteParams) => BaseElement;
}

/** Path-based client-side router rendering into an outlet Layout. */
export class BrowserRouter {
  private routes: Route[];
  private outlet: LayoutElement;
  private notFound?: (params: RouteParams) => BaseElement;

  constructor(
    routes: Route[],
    outlet: LayoutElement,
    options?: { notFound?: (params: RouteParams) => BaseElement },
  ) {
    this.routes = routes;
    this.outlet = outlet;
    this.notFound = options?.notFound;

    if (typeof globalThis !== "undefined" && globalThis.addEventListener) {
      globalThis.addEventListener("popstate", () => this.render());
      
      // Intercept all local anchor link clicks
      globalThis.document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest("a");
        if (anchor && anchor.href) {
          const url = new URL(anchor.href);
          if (url.origin === globalThis.location.origin) {
            e.preventDefault();
            this.Navigate(url.pathname + url.search + url.hash);
          }
        }
      });
    }

    this.render();
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

  private render() {
    if (typeof globalThis === "undefined" || !globalThis.location) return;
    const pathname = globalThis.location.pathname;
    const matched = this.matchRoute(pathname);
    this.outlet.element.innerHTML = "";

    if (matched) {
      this.outlet.AddChild(matched.route.render(matched.params));
    } else if (this.notFound) {
      this.outlet.AddChild(this.notFound({}));
    }
  }

  /** Navigates to a new path without a full page reload. */
  Navigate(path: string) {
    if (typeof globalThis === "undefined" || !globalThis.history) return;
    if (globalThis.location.pathname !== path) {
      globalThis.history.pushState({}, "", path);
      this.render();
    }
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
  routes: Route[],
  outlet: LayoutElement,
  options?: { notFound?: (params: RouteParams) => BaseElement },
): BrowserRouter {
  return new BrowserRouter(routes, outlet, options);
}
