import { StyledLink } from '@/components/StyledLink'
import { getProjectAll } from '@/services/project.api'
import { SearchRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Toolbar,
} from '@mui/material'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { matchSorter } from 'match-sorter'
import type { FC } from 'react'

const RouteComponent: FC = () => {
  const { items } = Route.useLoaderData()
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Box sx={{ maxWidth: 'lg', marginX: 'auto', padding: 4 }}>
      <Stack spacing={1}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(e)
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Field
              name="name"
              children={({ handleBlur, handleChange, state }) => (
                <TextField
                  fullWidth
                  defaultValue={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Search project"
                />
              )}
            />
            <Button
              type="submit"
              onClick={handleSubmit}
              startIcon={<SearchRounded />}
              variant="contained"
              disableElevation
            >
              Search
            </Button>
          </Toolbar>
        </form>
        {items.map((item) => {
          return (
            <Card variant="outlined" key={item.id}>
              <CardHeader title={<StyledLink to="/">{item.name}</StyledLink>} />
              <CardContent>{item.description}</CardContent>
            </Card>
          )
        })}
      </Stack>
    </Box>
  )
}

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async ({ location }) => {
    let items = await getProjectAll()
    const { query } = location.search
    if (query) {
      items = matchSorter(items, query, {
        keys: ['name'],
      })
    }
    return { items }
  },
  validateSearch: (search) => {
    return {
      query: String(search.query ?? ''),
    }
  },
})
