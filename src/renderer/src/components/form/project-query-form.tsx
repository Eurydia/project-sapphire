import { Autocomplete, TextField } from "@mui/material"
import { isRight } from "fp-ts/lib/Either"
import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react"
import type { ProjectQuery } from "~/db/models/project/dto/project-dto"
import { listProjects } from "~/db/projects"
import { listTech } from "~/db/technologies"
import { listTopic } from "~/db/topics"

type Props = { onSubmit: (query: ProjectQuery) => unknown }
export const ProjectQueryForm: FC<Props> = memo(
  ({ onSubmit }) => {
    const [topicOptions, setTopicOptions] = useState<string[]>(
      [],
    )
    const [techOptions, setTechOptions] = useState<string[]>([])
    const [projectOptions, setProjectOptions] = useState<
      string[]
    >([])

    const hasLoaded = useRef(false)
    const options = useMemo(() => {
      return techOptions
        .map((opt) => [
          {
            label: `tech:"${opt}"`,
            value: opt,
            group: "tech",
          },
        ])
        .concat(
          topicOptions.map((opt) => [
            {
              label: `topic:"${opt}"`,
              value: opt,
              group: "topic",
            },
          ]),
        )
        .concat(
          projectOptions.map((opt) => [
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
        group: "project" | "tech" | "topic"
      }[]
    }, [techOptions, topicOptions, projectOptions])

    const handleOpen = useCallback(async () => {
      if (!hasLoaded.current) {
        listTopic().then((res) =>
          setTopicOptions([
            ...new Set(res.map(({ name }) => name)),
          ]),
        )
        listTech().then((res) =>
          setTechOptions([
            ...new Set(res.map(({ name }) => name)),
          ]),
        )
        listProjects().then((result) => {
          if (isRight(result)) {
            setProjectOptions([
              ...new Set(result.right.map(({ name }) => name)),
            ])
          }
        })
        hasLoaded.current = true
      }
    }, [])

    const [value, setValue] = useState<typeof options>([])
    const handleSubmit = useCallback(() => {
      const names: string[] = []
      const techTags: string[] = []
      const topicTags: string[] = []
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
        }
      }
      onSubmit({ names, techTags, topicTags })
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
          onOpen={handleOpen}
          fullWidth
          options={options}
          renderInput={(param) => <TextField {...param} />}
        />
      </form>
    )
  },
)
