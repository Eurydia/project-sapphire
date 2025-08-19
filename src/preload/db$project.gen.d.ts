export declare global {
      interface Window {
        ["db$project"]: {
          list: (...args: any[]) => Promise<unknown>,listNames: (...args: any[]) => Promise<unknown>,listByUuids: (...args: any[]) => Promise<unknown>,listByNames: (...args: any[]) => Promise<unknown>,unpin: (...args: any[]) => Promise<unknown>,pin: (...args: any[]) => Promise<unknown>,findByUuid: (...args: any[]) => Promise<unknown>,create: (...args: any[]) => Promise<unknown>,upsertProject: (...args: any[]) => Promise<unknown>,createManyFromPaths: (...args: any[]) => Promise<unknown>
        }
      }
    }