export declare global {
      interface Window {
        ["db$project"]: {
          getRootMetadata: (...args: any[]) => Promise<unknown>,getAll: (...args: any[]) => Promise<unknown>,getByUuid: (...args: any[]) => Promise<unknown>,update: (...args: any[]) => Promise<unknown>,unpin: (...args: any[]) => Promise<unknown>,pin: (...args: any[]) => Promise<unknown>,softDelete: (...args: any[]) => Promise<unknown>,create: (...args: any[]) => Promise<unknown>,getTableShape: (...args: any[]) => Promise<unknown>
        }
      }
    }