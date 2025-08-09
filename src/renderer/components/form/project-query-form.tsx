import { Autocomplete, TextField } from "@mui/material"
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react"

type Props = {
  onSubmit: (query: string[]) => unknown
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
            value: `tag:${opt}`,
          },
        ])
        .concat(
          formOptions.projects.map((opt) => [
            {
              label: `name:"${opt}"`,
              value: `name:${opt}`,
            },
          ]),
        )
        .flat() as {
        label: string
        value: string
      }[]
    }, [formOptions])

    const [value, setValue] = useState<typeof options>([])
    const handleSubmit = useCallback(() => {
      onSubmit(value.map(({ value }) => value))
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
