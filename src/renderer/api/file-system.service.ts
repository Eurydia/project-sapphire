import { openDirDialogResultSchema } from "#/results/open-dir-dialog.result"

export class FileSystemService {
  static async openPath(...segments: string[]) {
    return window.fs.openPath(...segments)
  }
  static async openDirDialog() {
    return window.fs
      .openDirDialog()
      .then((response) =>
        openDirDialogResultSchema.parseAsync(response),
      )
  }
}
