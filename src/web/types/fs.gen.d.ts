export declare global {
      interface Window {
        ["fs"]: {
          openDirDialog: (...args: any[]) => Promise<unknown>,openPath: (...args: any[]) => Promise<unknown>
        }
      }
    }