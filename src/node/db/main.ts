import log from "electron-log";
import { registerIpcMainServices } from "../core/services/main";
import { DATA_SOURCE } from "./data-source";
import { PROJECT_SERVICES } from "./services/project";
import { TECH_SERVICES } from "./services/technology";
import { TOPIC_SERVICES } from "./services/topic";

registerIpcMainServices(PROJECT_SERVICES, "db$project");
registerIpcMainServices(TOPIC_SERVICES, "db$topic");
registerIpcMainServices(TECH_SERVICES, "db$tech");

export const initDbServices = () =>
  DATA_SOURCE.initialize()
    .then(() => log.info("db initialized"))
    .catch((err) => log.error("db init failed: " + err));
