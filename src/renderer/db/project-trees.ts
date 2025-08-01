import { readDir, readFile } from "~/api/fs"
import type { ProjectTree } from "../../shared/services/project-tree/project-tree"
import type { ProjectTreeDto } from "../../shared/services/project-tree/project-tree-dto"
import type { Project } from "../../shared/services/project/project"

export const upsertTree = async (dto: ProjectTreeDto) => {
  const db = await getDb()
  const tx = db.transaction("project-trees", "readwrite")
  const store = tx.objectStore("project-trees")
  await store.put(dto)
  await tx.done
}

export const getProjectTree = async (
  project: Project,
  path: string, // relative to root
) => {
  const db = await getDb()
  const tx = db.transaction("project-trees")
  const treeStore = tx.objectStore("project-trees")
  const item = await treeStore.get([project.uuid, path])
  await tx.done
  const dirData = await readDir(project.root.path, path)
  let readme: ProjectTree["readme"] = null
  if (item !== undefined && item.readme !== null) {
    const content = await readFile(
      project.root.path,
      path,
      item.readme,
    )
    if (content !== null) {
      readme = {
        name: item.readme,
        content,
      }
    }
  }

  return {
    projectUuid: project.uuid,
    path,
    readme,
    parentPath: dirData?.path ?? "",
    files: dirData?.files ?? [],
    dirs: dirData?.dirs ?? [],
  } satisfies ProjectTree
}
