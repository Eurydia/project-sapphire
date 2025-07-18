import { z } from "zod/v4";

export const openPath = (path: string) => window.fs.openPath(path);

export const openDirDialog = () =>
  window.fs
    .openDirDialog()
    .then(
      z.object({ canceled: z.boolean(), filePaths: z.string().array() })
        .parseAsync
    );
