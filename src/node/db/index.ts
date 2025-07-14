import { DATA_SOURCE } from "./data-source";
export {
  getRegisteredDatasourceServiceChannels,
  getRegisteredDatasourceServices,
} from "./services";

export const initDataSource = async () => {
  await DATA_SOURCE.initialize();
};
