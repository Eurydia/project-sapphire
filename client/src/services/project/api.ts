import type { Project } from '@/types/Project'
import { faker } from '@faker-js/faker'
import { matchSorter, rankings } from 'match-sorter'
import type { ProjectQuery } from './helper'

export const getProject = (id: string) => {
  return {
    id,
    name: faker.lorem.word({ length: { min: 100, max: 200 } }), // single random word
    description: faker.lorem.sentence(), // one random sentence
    updatedAt: faker.date.recent().toISOString(), // recent ISO timestamp
    createdAt: faker.date.past().toISOString(),
    tags: {
      technologies: faker.lorem.words(3).split(' '), // array of 3 fake technology names
      topics: faker.lorem
        .words({ min: 0, max: 6 })
        .split(' ')
        .filter((tag) => tag.trim().length > 0), // array of 3 fake topic names
      status: faker.lorem.word(), // random ProjectStatus enum
      priority: faker.lorem.word(), // random ProjectVisibility enum
    },
  } as Project
}

let projects: Project[] = []
if (localStorage.getItem('t_projects') === null) {
  projects = faker.helpers.multiple(() => getProject(faker.string.uuid()), {
    count: 50,
  })
  localStorage.setItem('t_projects', JSON.stringify(projects))
} else {
  projects = JSON.parse(localStorage.getItem('t_projects')!)
}

export const getProjectAll = async (query: ProjectQuery) => {
  // The query should be passed along to the backend
  // instead of loading every project and filter with match-sorter here
  // so this implementation is temporary
  let items = projects

  if (query.name !== undefined) {
    items = matchSorter(items, query.name, {
      keys: ['name'],
    })
  }

  if (query.status !== undefined) {
    items = matchSorter(items, query.status, {
      keys: ['tags.status'],
      threshold: rankings.EQUAL,
    })
  }

  if (query)
    if (query.technologies !== undefined && query.technologies.length > 0) {
      items = query.technologies.reduceRight((acc, tech) => {
        return matchSorter(acc, tech, {
          keys: ['tags.technologies'],
          threshold: rankings.EQUAL,
        })
      }, items)
    }

  if (query.topics !== undefined && query.topics.length > 0) {
    items = query.topics.reduceRight((acc, topic) => {
      return matchSorter(acc, topic, {
        keys: ['tags.topics'],
        threshold: rankings.EQUAL,
      })
    }, items)
  }

  return items
}
