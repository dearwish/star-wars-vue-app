export default class Utils {
  public static getId(url: string ): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
  }
  public static getPageNumber(url: string): number {
    return Number(url.substring(url.lastIndexOf('page=') + 5, url.length));
  }
}
