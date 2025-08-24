import { openDirDialogResultSchema } from "#/results/open-dir-dialog.result"
import { left, right } from "fp-ts/lib/Either"
import z from "zod/v4"

export class FileSystemService {
  private static provider = window["fs"]
  static async openPath(...segments: string[]) {
    return this.provider.openPath(...segments)
  }
  static async openDirDialog() {
    return this.provider
      .openDirDialog()
      .then((res) => openDirDialogResultSchema.parseAsync(res))
      .then((res) => right(res))
      .catch((err) => left(err))
  }

  static async openURL(url: string) {
    return this.provider
      .openURL(url)
      .then((resp) => right(resp))
      .catch((err) => left(err))
  }

  static async openDbPath() {
    return this.provider
      .openDatabasePath()
      .then((resp) => right(resp))
      .catch((err) => left(err))
  }
  static async readFileContent() {
    return this.provider
      .readFileContent()
      .then((resp) =>
        z
          .string()
          .trim()
          .normalize()
          .nullable()
          .parseAsync(resp),
      )
      .then((resp) => right(resp))
      .catch((err) => left(err))
  }
}
