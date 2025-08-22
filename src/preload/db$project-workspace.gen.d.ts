export declare global {
      interface Window {
        ["db$project-workspace"]: {
          add: (...args: any[]) => Promise<unknown>,update: (...args: any[]) => Promise<unknown>,deleteByUUID: (...args: any[]) => Promise<unknown>
        }
      }
    }