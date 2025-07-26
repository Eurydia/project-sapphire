import { Autocomplete, TextField } from "@mui/material"
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react"
import type { ProjectQuery } from "~/db/models/project/dto/project-dto"

type Props = {
  onSubmit: (query: ProjectQuery) => unknown
  formOptions: {
    topics: string[]
    technologies: string[]
    groups: string[]
    projects: string[]
  }
}
export const ProjectQueryForm: FC<Props> = memo(
  ({ onSubmit, formOptions }) => {
    const options = useMemo(() => {
      return formOptions.technologies
        .map((opt) => [
          {
            label: `tech:"${opt}"`,
            value: opt,
            group: "tech",
          },
        ])
        .concat(
          formOptions.topics.map((opt) => [
            {
              label: `topic:"${opt}"`,
              value: opt,
              group: "topic",
            },
          ]),
        )
        .concat(
          formOptions.groups.map((opt) => [
            {
              label: `group:"${opt}"`,
              value: opt,
              group: "group",
            },
          ]),
        )
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
        group: "project" | "tech" | "topic" | "group"
      }[]
    }, [formOptions])

    const [value, setValue] = useState<typeof options>([])
    const handleSubmit = useCallback(() => {
      const names: string[] = []
      const techTags: string[] = []
      const topicTags: string[] = []
      const groupTags: string[] = []
      for (const v of value) {
        switch (v.group) {
          case "project":
            names.push(v.value)
            break
          case "tech":
            techTags.push(v.value)
            break
          case "topic":
            topicTags.push(v.value)
            break
          case "group":
            groupTags.push(v.value)
            break
        }
      }
      onSubmit({ names, techTags, topicTags, groupTags })
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
