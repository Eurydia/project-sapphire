import { left, right, type Either } from "fp-ts/lib/Either"
import { z } from "zod/v4"

export const openPath = (path: string) =>
  window.fs.openPath(path)

export const openDirDialog = () =>
  window.fs.openDirDialog().then(
    z.object({
      canceled: z.boolean(),
      filePaths: z.string().array(),
    }).parseAsync,
  )

const statDirResultSchema = z.object({
  birthtimeMs: z.number().nonnegative(),
  atimeMs: z.number().nonnegative(),
  mtimeMs: z.number().nonnegative(),
})
export type StatDirResult = z.infer<typeof statDirResultSchema>

export const statDir = async (
  path: string,
): Promise<Either<Error, StatDirResult>> => {
  return window.fs
    .statDir(path)
    .then((result) => statDirResultSchema.parseAsync(result))
    .then((result) => right(result))
    .catch((err) => left(err))
}

const readDirResultSchema = z.object({
  path: z.string(),
  dirs: z.string().array(),
  files: z.string().array(),
})
export type ReadDirResult = z.infer<typeof readDirResultSchema>
export const readDir = async (
  root: string,
  ...segments: string[]
) => {
  return window.fs
    .readDir(root, ...segments)
    .then((result) => readDirResultSchema.parseAsync(result))
    .catch(() => null)
}
