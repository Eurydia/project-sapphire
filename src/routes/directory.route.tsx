import { RouteObject } from "react-router";
import { DirectoryLoaderData } from "~types/directory.types";
import { DirectoryView } from "~views/DirectoryView";

export const DIRECTORY_CONTROLLER: RouteObject = {
  path: "/dir",
  element: <DirectoryView />,
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
