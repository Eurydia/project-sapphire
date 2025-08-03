import { registerIpcRendererServices } from "./register"

registerIpcRendererServices("fs")
registerIpcRendererServices("db$project")
registerIpcRendererServices("db$tags")
registerIpcRendererServices("db$project-tree")
