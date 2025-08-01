export declare global {
      interface Window {
        ["db$project-tree"]: {
          getRootTree: (...args: any[]) => Promise<unknown>,getTree: (...args: any[]) => Promise<unknown>
        }
      }
    }