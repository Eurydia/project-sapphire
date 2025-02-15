import { RouteObject } from "react-router";
import { HomeLoaderData } from "./home.entity";
import { getVaultData } from "./home.service";
import { HomeView } from "./home.view";

export const HOME_CONTROLLER: RouteObject = {
  path: "/",
  element: <HomeView />,
  loader: async () => {
    const data = await getVaultData();
    const loaderData: HomeLoaderData = {
      data,
    };
    return loaderData;
  },
};
