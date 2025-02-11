import { RouteObject } from "react-router";
import { DirectoryLoaderData } from "./directory.entity";
import { getDirectory as getDirectoryEntry } from "./directory.service";
import { RepositoryView } from "./directory.view";

export const DIRECTORY_CONTROLLER: RouteObject = {
  path: "/dir",
  element: <RepositoryView />,
  loader: async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    const response = await getDirectoryEntry(path);
    const loaderData: DirectoryLoaderData = {
      data: response,
    };
    return loaderData;
  },
};
