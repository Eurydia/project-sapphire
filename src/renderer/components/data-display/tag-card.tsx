import type { ProjectTag } from "#/models/project-tag/project-tag-entity"
import { ProjectTagService } from "@/api/project-tag.service"
import { Divider, Paper, Stack, Typography } from "@mui/material"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { isRight } from "fp-ts/lib/Either"
import { useCallback, type FC } from "react"
import { TypographyButton } from "../input/typography-button"
import { StyledLink } from "../navigation/styled-link"

type Props = {
  tag: ProjectTag
}
export const TagCard: FC<Props> = ({ tag }) => {
  const navigate = useNavigate()
  const router = useRouter()
  const handleRedirectEdit = useCallback(() => {
    navigate({
      to: "/project-tags/$uuid/edit",
      params: { uuid: tag.uuid },
    })
  }, [tag, navigate])

  const handlePin = async () => {
    const result = await ProjectTagService.pin(tag.uuid)
    if (isRight(result)) {
      router.invalidate({ sync: true })
    }
  }
  const handleUnpin = async () => {
    const result = await ProjectTagService.unpin(tag.uuid)
    if (isRight(result)) {
      router.invalidate({ sync: true })
    }
  }

  const handleTogglePin = () => {
    if (tag.pinned) {
      handleUnpin()
    } else {
      handlePin()
    }
  }

  return (
    <Paper variant="outlined">
      <Stack spacing={2} divider={<Divider flexItem />}>
        <Stack spacing={2} direction="row">
          <TypographyButton onClick={handleTogglePin}>
            {tag.pinned ? `[UNPIN]` : `[PIN]`}
          </TypographyButton>
          <TypographyButton onClick={handleRedirectEdit}>
            {`[EDIT]`}
          </TypographyButton>
        </Stack>
        <Stack spacing={1}>
          <Stack>
            <Typography variant="subtitle1">
              {tag.uuid}
            </Typography>
            <Typography variant="subtitle1">
              {tag.projects.length <= 1
                ? `${tag.projects.length} PROJECT`
                : `${tag.projects.length} PROJECTS`}
            </Typography>
          </Stack>
          <StyledLink
            variant="h4"
            to="/project-tags/$uuid"
            params={{ uuid: tag.uuid }}
          >
            {tag.name}
          </StyledLink>
          {tag.description !== "" && (
            <Typography>{tag.description}</Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}
