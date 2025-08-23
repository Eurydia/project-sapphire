export declare global {
      interface Window {
        ["fs"]: {
          openDirDialog: (...args: any[]) => Promise<unknown>,openPath: (...args: any[]) => Promise<unknown>,openURL: (...args: any[]) => Promise<unknown>,openDatabasePath: (...args: any[]) => Promise<unknown>
        }
      }
    }