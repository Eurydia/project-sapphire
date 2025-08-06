import type { ProjectTag } from "#/models/project-tag/project-tag-entity"
import { Divider, Paper, Stack, Typography } from "@mui/material"
import { useNavigate } from "@tanstack/react-router"
import { memo, useCallback, type FC } from "react"
import { TypographyButton } from "../input/typography-button"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  tag: ProjectTag
}
export const TagCard: FC<Props> = memo(({ tag }) => {
  const navigate = useNavigate()
  const handleRedirectEdit = useCallback(() => {
    navigate({
      to: "/project-tags/$uuid/edit",
      params: { uuid: tag.uuid },
    })
  }, [tag, navigate])
  return (
    <Paper variant="outlined">
      <Stack spacing={2} divider={<Divider flexItem />}>
        <Stack spacing={2} direction="row">
          <TypographyButton onClick={handleRedirectEdit}>
            {`[EDIT]`}
          </TypographyButton>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="subtitle1">{tag.uuid}</Typography>
          <Typography variant="subtitle1">
            {tag.projects.length <= 1
              ? `${tag.projects.length} PROJECT`
              : `${tag.projects.length} PROJECTS`}
          </Typography>
          <StyledLink
            variant="h4"
            to="/project-tags/$uuid"
            params={{ uuid: tag.uuid }}
          >
            {tag.name}
          </StyledLink>
          {tag.description !== "" && (
            <Typography component="pre">
              {tag.description}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
})
