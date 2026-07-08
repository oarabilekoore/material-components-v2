import { callBridge, isServerRuntime } from "./bridge.ts";

/** Checks whether a file exists. */
export async function FileExists(path: string): Promise<boolean> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      return (await fs.stat(path)).isFile();
    } catch {
      return false;
    }
  }
  return callBridge("FileExists", [path], false);
}

/** Reads a file's contents as text. */
export async function ReadFile(path: string): Promise<string | null> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      return await fs.readFile(path, "utf-8");
    } catch {
      return null;
    }
  }
  return callBridge("ReadFile", [path], null);
}

/** Writes text to a file, creating it if needed. */
export async function WriteFile(
  path: string,
  content: string,
): Promise<boolean> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      await fs.writeFile(path, content, "utf-8");
      return true;
    } catch {
      return false;
    }
  }
  return callBridge("WriteFile", [path, content], false);
}

/** Deletes a file. */
export async function DeleteFile(path: string): Promise<boolean> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      await fs.unlink(path);
      return true;
    } catch {
      return false;
    }
  }
  return callBridge("DeleteFile", [path], false);
}

/** Copies a file to a new path. */
export async function CopyFile(src: string, dest: string): Promise<boolean> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      await fs.copyFile(src, dest);
      return true;
    } catch {
      return false;
    }
  }
  return callBridge("CopyFile", [src, dest], false);
}

/** Renames/moves a file. */
export async function RenameFile(
  oldPath: string,
  newPath: string,
): Promise<boolean> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      await fs.rename(oldPath, newPath);
      return true;
    } catch {
      return false;
    }
  }
  return callBridge("RenameFile", [oldPath, newPath], false);
}

/** Gets a file's size in bytes, or -1 if it doesn't exist. */
export async function GetFileSize(path: string): Promise<number> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      return (await fs.stat(path)).size;
    } catch {
      return -1;
    }
  }
  return callBridge("GetFileSize", [path], -1);
}

/** Gets a file's last-modified date, or null if it doesn't exist. */
export async function GetFileDate(path: string): Promise<Date | null> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      return (await fs.stat(path)).mtime;
    } catch {
      return null;
    }
  }
  const iso = await callBridge<string | null>("GetFileDate", [path], null);
  return iso ? new Date(iso) : null;
}

/** Checks whether a folder exists. */
export async function FolderExists(path: string): Promise<boolean> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      return (await fs.stat(path)).isDirectory();
    } catch {
      return false;
    }
  }
  return callBridge("FolderExists", [path], false);
}

/** Creates a folder, including any missing parent folders. */
export async function MakeFolder(path: string): Promise<boolean> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      await fs.mkdir(path, { recursive: true });
      return true;
    } catch {
      return false;
    }
  }
  return callBridge("MakeFolder", [path], false);
}

/** Lists entries in a folder. */
export async function ListFolder(path: string): Promise<string[]> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      return await fs.readdir(path);
    } catch {
      return [];
    }
  }
  return callBridge("ListFolder", [path], [] as string[]);
}

/** Deletes a folder and its contents. */
export async function DeleteFolder(path: string): Promise<boolean> {
  if (isServerRuntime) {
    const fs = await import("node:fs/promises");
    try {
      await fs.rm(path, { recursive: true, force: true });
      return true;
    } catch {
      return false;
    }
  }
  return callBridge("DeleteFolder", [path], false);
}
