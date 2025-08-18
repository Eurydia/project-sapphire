export declare global {
  interface Window {
    ["native$web-utils"]: {
      getPathForFile: (a: File) => Promise<string>
    }
  }
}
