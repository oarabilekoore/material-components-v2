const DEV = Deno.env.get("APP_ENV") === "development";
const VITE_ORIGIN = "http://localhost:5173";
const DIST_DIR = new URL("./dist", import.meta.url).pathname;

Deno.serve(async (req) => {
  if (DEV) {
    const url = new URL(req.url);
    const target = VITE_ORIGIN + url.pathname + url.search;

    try {
      const upgrade = req.headers.get("upgrade");
      if (upgrade === "websocket") {
        return fetch(target, { headers: req.headers });
      }

      const viteRes = await fetch(target, {
        method: req.method,
        headers: req.headers,
        body:
          req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
      });

      return new Response(viteRes.body, {
        status: viteRes.status,
        headers: viteRes.headers,
      });
    } catch {
      return new Response(
        "Vite dev server not reachable on :5173 — run `deno task vite:dev` first.",
        { status: 502 },
      );
    }
  }

  const url = new URL(req.url);
  let path = url.pathname === "/" ? "/index.html" : url.pathname;
  path = decodeURIComponent(path);

  try {
    const file = await Deno.readFile(DIST_DIR + path);
    return new Response(file, {
      headers: { "content-type": contentType(path) },
    });
  } catch {
    const index = await Deno.readFile(DIST_DIR + "/index.html");
    return new Response(index, { headers: { "content-type": "text/html" } });
  }
});

function contentType(path: string): string {
  if (path.endsWith(".js")) return "application/javascript";
  if (path.endsWith(".css")) return "text/css";
  if (path.endsWith(".html")) return "text/html";
  if (path.endsWith(".json")) return "application/json";
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}
