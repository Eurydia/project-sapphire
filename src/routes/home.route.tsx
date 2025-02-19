import { redirect, RouteObject } from "react-router";
import { getVault } from "~services/home.services";
import { HomeLoaderData } from "~types/home.types";
import { HomeStartupView } from "~views/Home/HomeStartupView";
import { HomeView } from "~views/Home/HomeView";

export const HOME_CONTROLLER: RouteObject = {
  path: "/",
  children: [
    {
      index: true,
      element: <HomeView />,
      loader: async () => {
        const data = await getVault();
        if (data === null) {
          return redirect("/home/startup");
        }
        const loaderData: HomeLoaderData = {
          data,
        };
        return loaderData;
      },
    },
    {
      path: "/home/startup",
      element: <HomeStartupView />,
      action: async ({ request }) => {},
    },
  ],
};
