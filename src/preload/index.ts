import { registerIpcRendererServices } from "./register"

registerIpcRendererServices("fs")
registerIpcRendererServices("db$project")
registerIpcRendererServices("db$technology")
registerIpcRendererServices("db$topic")
registerIpcRendererServices("db$group")
registerIpcRendererServices("db$project-tree")
