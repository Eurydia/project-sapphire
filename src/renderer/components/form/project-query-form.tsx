import { Autocomplete, Stack, TextField } from "@mui/material"
import { uniq } from "lodash"
import { memo, useMemo, useRef, useState, type FC } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  formOptions: {
    tags: string[]
    projects: string[]
  }
}
export const ProjectQueryForm: FC<Props> = memo(
  ({ formOptions }) => {
    const options = useMemo(() => {
      return uniq(formOptions.tags)
        .map((opt) => [
          {
            label: `tag:"${opt}"`,
            value: `tag:${opt}`,
          },
        ])
        .concat(
          uniq(formOptions.projects).map((opt) => [
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
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    useHotkeys("ctrl+k", () => {
      if (searchInputRef.current === null) {
        return
      }
      searchInputRef.current.focus()
    })
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Autocomplete
          multiple
          value={value}
          onChange={(_, v) => setValue([...v])}
          disableClearable
          fullWidth
          options={options}
          renderInput={(param) => (
            <TextField
              {...param}
              inputRef={searchInputRef}
              placeholder={
                value.length === 0 ? "[CTRL] + [K]" : undefined
              }
            />
          )}
          popupIcon={false}
          slotProps={{
            paper: { sx: { padding: 0 } },
            chip: {
              size: "medium",
            },
          }}
        />
        <Stack spacing={2} direction={"row"}>
          <StyledLink
            to="/projects"
            search={{
              query: value.map(({ value }) => value),
            }}
          >
            {`[SEARCH]`}
          </StyledLink>
        </Stack>
      </Stack>
    )
  },
)
