import { DATA_SOURCE } from "./data-source";
import "./services/project.services";
import "./services/technology.services";
import "./services/topic.services";

export const initDataSource = async () => {
  await DATA_SOURCE.initialize();
};
