import { projectPaginationQuerySchema } from "#/models/project/dto/pagination-project.dto"
import { ProjectTagService } from "@/api/project-tag.service"
import { ProjectService } from "@/api/project.service"
import { ProjectList } from "@/components/data-display/project-list"
import { ProjectListPaginationControl } from "@/components/data-display/project-list-pagination-control"
import { ProjectQueryForm } from "@/components/form/project-query-form"
import { StyledLink } from "@/components/navigation/styled-link"
import { Divider, Grid, Paper, Stack } from "@mui/material"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { type FC } from "react"
type DroppedDir = { name: string; path: string }

const RouteComponent: FC = () => {
  const { paginationResult, formOptions } = Route.useLoaderData()
  const search = Route.useSearch()

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()

    const uriList = e.dataTransfer.getData("text/uri-list")

    const items = Array.from(e.dataTransfer.items || [])
    console.debug(items, uriList, e.dataTransfer)
    console.debug(
      items
        .map((e) => e.webkitGetAsEntry())
        .filter((e) => e !== null)
        .filter(
          (e): e is FileSystemDirectoryEntry => e.isDirectory,
        )
        .map((e, i) => e),
    )
    // const dirHandles: FileSystemDirectoryHandle[] = []
    // for (const it of items) {
    //   if ("getAsFileSystemHandle" in it) {
    //     const handle = await (it as any).getAsFileSystemHandle()
    //     if (handle && handle.kind === "directory") {
    //       dirHandles.push(handle)
    //     }
    //   }
    // }

    // const picked: DroppedDir[] = []
    // for (let i = 0; i < dirHandles.length; i++) {
    //   const h = dirHandles[i]
    //   const uri = uris[i]
    //   if (uri?.startsWith("file://")) {
    //     picked.push({
    //       name: h.name,
    //       path: window.folders.fileURLToPath(uri),
    //     })
    //   }
    // }

    // setDirs((prev) => [...prev, ...picked])
  }

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Paper variant="outlined">
          <ProjectQueryForm
            search={search}
            formOptions={formOptions}
          />
        </Paper>
      </Grid>
      <Grid size={{ sm: 12, md: 4 }}>
        <Paper variant="outlined">
          <Stack spacing={2} divider={<Divider flexItem />}>
            <div onDragOver={onDragOver} onDrop={onDrop}>
              Drop folder(s) here
            </div>
            <StyledLink to="/projects/create">{`[ADD]`}</StyledLink>
            <ProjectListPaginationControl
              search={search}
              pagination={paginationResult}
            />
          </Stack>
        </Paper>
      </Grid>
      <Grid size="grow">
        <ProjectList projects={paginationResult.items} />
      </Grid>
    </Grid>
  )
}

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
  validateSearch: zodValidator(projectPaginationQuerySchema),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    return {
      paginationResult: await ProjectService.list(search),
      formOptions: {
        projects: await ProjectService.listNames(),
        tags: await ProjectTagService.listNames(),
      },
    }
  },
})
