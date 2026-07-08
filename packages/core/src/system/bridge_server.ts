import * as Files from "./files.ts";

// deno-lint-ignore no-explicit-any
const handlers: Record<string, (...args: any[]) => Promise<unknown>> = {
  FileExists: Files.FileExists,
  ReadFile: Files.ReadFile,
  WriteFile: Files.WriteFile,
  DeleteFile: Files.DeleteFile,
  CopyFile: Files.CopyFile,
  RenameFile: Files.RenameFile,
  GetFileSize: Files.GetFileSize,
  GetFileDate: async (path: string) =>
    (await Files.GetFileDate(path))?.toISOString() ?? null,
  FolderExists: Files.FolderExists,
  MakeFolder: Files.MakeFolder,
  ListFolder: Files.ListFolder,
  DeleteFolder: Files.DeleteFolder,
};

/** Handles /__bridge__/* requests inside your Deno.serve() handler. Returns null if not a bridge request. */
export async function handleBridgeRequest(
  req: Request,
): Promise<Response | null> {
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/__bridge__/")) return null;

  const method = url.pathname.replace("/__bridge__/", "");
  if (method === "ping") return new Response("ok");

  const handler = handlers[method];
  if (!handler)
    return new Response(`Unknown bridge method: ${method}`, { status: 404 });

  const { args } = await req.json();
  const result = await handler(...args);
  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
  });
}
