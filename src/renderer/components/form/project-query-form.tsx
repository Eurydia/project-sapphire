import type { ProjectQuery } from "#/models/project/dto/query-project.dto"
import { Autocomplete, TextField } from "@mui/material"
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react"

type Props = {
  onSubmit: (query: ProjectQuery) => unknown
  formOptions: {
    tags: string[]
    projects: string[]
  }
}
export const ProjectQueryForm: FC<Props> = memo(
  ({ onSubmit, formOptions }) => {
    const options = useMemo(() => {
      return formOptions.tags
        .map((opt) => [
          {
            label: `tag:"${opt}"`,
            value: opt,
            group: "tag",
          },
        ])
        .concat(
          formOptions.projects.map((opt) => [
            {
              label: `name:"${opt}"`,
              value: opt,
              group: "project",
            },
          ]),
        )
        .flat() as {
        label: string
        value: string
        group: "project" | "tag"
      }[]
    }, [formOptions])

    const [value, setValue] = useState<typeof options>([])
    const handleSubmit = useCallback(() => {
      const names: string[] = []
      const tags: string[] = []
      for (const v of value) {
        switch (v.group) {
          case "project":
            names.push(v.value)
            break
          case "tag":
            tags.push(v.value)
            break
        }
      }
      onSubmit({ names, tags })
    }, [onSubmit, value])

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleSubmit()
        }}
      >
        <Autocomplete
          multiple
          value={value}
          onChange={(_, v) => setValue([...v])}
          disableClearable
          fullWidth
          options={options}
          renderInput={(param) => <TextField {...param} />}
        />
      </form>
    )
  },
)
