export declare global {
      interface Window {
        ["db$tags"]: {
          list: (...args: any[]) => Promise<unknown>,listByNames: (...args: any[]) => Promise<unknown>,listByUuids: (...args: any[]) => Promise<unknown>,findByUUID: (...args: any[]) => Promise<unknown>,update: (...args: any[]) => Promise<unknown>,pin: (...args: any[]) => Promise<unknown>,unpin: (...args: any[]) => Promise<unknown>
        }
      }
    }