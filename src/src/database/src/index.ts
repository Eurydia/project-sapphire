import { ipcMain } from "electron";
import { DATA_SOURCE } from "./data-source";
import {
  project$getAll,
  project$getByUuid,
  project$create,
  project$getMetadata,
  project$pin,
  project$unpin,
  project$update,
} from "./services/project.services";
import {
  technology$create,
  technology$createManyByNames,
  technology$getAll,
} from "./services/technology.services";
import {
  topic$create,
  topic$createManyByNames,
  topic$getAll,
} from "./services/topic.services";

export const registerDataSourceServices = async () => {
  await DATA_SOURCE.initialize();
  ipcMain.handle("project:getMetadata", async (_, uuid) =>
    project$getMetadata(uuid)
  );
  ipcMain.handle("project:create", async (_, data) => project$create(data));
  ipcMain.handle("project:update", async (_, uuid, data) =>
    project$update(uuid, data)
  );
  ipcMain.handle("project:pin", async (_, uuid) => project$pin(uuid));
  ipcMain.handle("project:unpin", async (_, uuid) => project$unpin(uuid));
  ipcMain.handle("project:getAll", async () => project$getAll());
  ipcMain.handle("project:getByUuid", async (_, uuid) =>
    project$getByUuid(uuid)
  );

  ipcMain.handle("technology:create", async (_, data) =>
    technology$create(data)
  );
  ipcMain.handle("technology:createManyByNames", async (_, names) =>
    technology$createManyByNames(names)
  );
  ipcMain.handle("technology:getAll", async () => technology$getAll());

  ipcMain.handle("topic:create", async (_, data) => topic$create(data));
  ipcMain.handle("topic:createManyByNames", async (_, names) =>
    topic$createManyByNames(names)
  );
  ipcMain.handle("topic:getAll", async () => topic$getAll());
};
