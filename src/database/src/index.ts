import { DATA_SOURCE } from "./data-source";
import "./services/project.services";
import {
  getRegisteredDatasourceServiceChannels,
  getRegisteredDatasourceServices,
} from "./services/registry";
// import "./services/technology.services";
// import "./services/topic.services";

export const initDataSource = async () => {
  await DATA_SOURCE.initialize();
};

console.debug(
  getRegisteredDatasourceServices(),
  getRegisteredDatasourceServiceChannels()
);
