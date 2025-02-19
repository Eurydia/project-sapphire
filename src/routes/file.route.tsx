import { RouteObject } from "react-router";
import { getFileData } from "~services/file.services";
import { FileLoaderData } from "~types/file.types";
import { FileView } from "~views/FileView";

export const FILE_CONTROLLER: RouteObject = {
  path: "/file",
  element: <FileView />,
  loader: async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");
    if (filePath === null) {
      throw new Response("", {
        status: 400,
        statusText: "bad request",
      });
    }
    const data = await getFileData(filePath);
    const loaderData: FileLoaderData = {
      data,
    };
    return loaderData;
  },
};
