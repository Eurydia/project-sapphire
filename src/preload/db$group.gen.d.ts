export declare global {
      interface Window {
        ["db$group"]: {
          list: (...args: any[]) => Promise<unknown>,listByNames: (...args: any[]) => Promise<unknown>,listByUuids: (...args: any[]) => Promise<unknown>
        }
      }
    }