import { invoke } from "@tauri-apps/api/core";
import { RouteObject } from "react-router";
import { HomeLoaderData } from "./home.entity";
import { HomeView } from "./home.view";

export const HOME_CONTROLLER: RouteObject = {
  path: "/",
  element: <HomeView />,
  loader: async () => {
    const items = (await invoke(
      "get_top_level_repository_all"
    )) as any;
    const loaderData: HomeLoaderData = {
      repositories: items,
    };
    return loaderData;
  },
};
