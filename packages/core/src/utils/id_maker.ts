export function uniqueId(str: string): string {
  let hash = 5321;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return String(str + hash);
}
