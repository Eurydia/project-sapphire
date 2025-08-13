import type { ProjectPaginationQuery } from "#/models/project/dto/pagination-project.dto"
import { Autocomplete, Stack, TextField } from "@mui/material"
import { memo, useMemo, useState, type FC } from "react"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  search: ProjectPaginationQuery
  formOptions: {
    tags: string[]
    projects: string[]
  }
}
export const ProjectQueryForm: FC<Props> = memo(
  ({ formOptions, search }) => {
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

    return (
      <Stack spacing={2} alignItems="flex-start">
        <Autocomplete
          multiple
          value={value}
          onChange={(_, v) => setValue([...v])}
          disableClearable
          fullWidth
          options={options}
          renderInput={(param) => <TextField {...param} />}
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
              ...search,
              query: value.map(({ value }) => value),
            }}
          >
            {`[SEARCH]`}
          </StyledLink>
          <StyledLink to="/projects/create">{`[ADD]`}</StyledLink>
        </Stack>
      </Stack>
    )
  },
)
