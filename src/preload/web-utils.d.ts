export declare global {
  interface Window {
    ["webUtils"]: {
      getPathForFile: (a: File) => Promise<string>
    }
  }
}
