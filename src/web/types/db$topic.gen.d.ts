export declare global {
      interface Window {
        ["db$topic"]: {
          create: (...args: any[]) => Promise<unknown>,createManyByNames: (...args: any[]) => Promise<unknown>,getAll: (...args: any[]) => Promise<unknown>
        }
      }
    }