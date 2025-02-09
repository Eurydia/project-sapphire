import { invoke } from "@tauri-apps/api/core";
import { RouteObject } from "react-router";
import { RepositoryView } from "./repository.view";

export const REPOSITORY_CONTROLLER: RouteObject = {
  path: "/repository/:repo",
  element: <RepositoryView />,
  loader: async ({ params }) => {
    const { repo } = params;
    if (repo === undefined) {
      throw new Response("", { status: 400 });
    }
    const repository = (await invoke(
      "get_repository",
      {}
    )) as {
      path: string;
      files: string[];
      directories: string[];
    };
    return repository;
  },
};
