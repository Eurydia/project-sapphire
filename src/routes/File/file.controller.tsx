import { RouteObject } from "react-router";
import { FileLoaderData } from "./file.entity";
import { getFileData } from "./file.service";
import { FileView } from "./file.view";

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
