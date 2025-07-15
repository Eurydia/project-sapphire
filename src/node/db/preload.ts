import { registerIpcRendererServices } from "../core/services/preload";

registerIpcRendererServices("db$project");
registerIpcRendererServices("db$tech");
registerIpcRendererServices("db$topic");
