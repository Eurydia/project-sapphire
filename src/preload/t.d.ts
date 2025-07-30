export declare global {
  interface Window {
    ["text"]: {
      ping: () => Promise<unknown>
    }
  }
}
