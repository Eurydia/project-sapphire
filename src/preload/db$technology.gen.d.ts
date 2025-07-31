export declare global {
      interface Window {
        ["db$technology"]: {
          list: (...args: any[]) => Promise<unknown>,listByNames: (...args: any[]) => Promise<unknown>,listByUuids: (...args: any[]) => Promise<unknown>
        }
      }
    }