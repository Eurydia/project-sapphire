export declare global {
      interface Window {
        ["db$tech"]: {
          getAll: (...args: any[]) => Promise<unknown>,create: (...args: any[]) => Promise<unknown>,createManyByNames: (...args: any[]) => Promise<unknown>
        }
      }
    }