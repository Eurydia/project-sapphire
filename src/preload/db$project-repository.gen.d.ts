export declare global {
      interface Window {
        ["db$project-repository"]: {
          add: (...args: any[]) => Promise<unknown>,update: (...args: any[]) => Promise<unknown>
        }
      }
    }