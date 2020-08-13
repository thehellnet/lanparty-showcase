export class PathUtility {
  public static basename(path: string): string {
    return path.replace(/.*\//, "");
  }
}
