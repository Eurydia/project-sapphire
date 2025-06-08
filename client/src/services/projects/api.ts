import type { ProjectDirectory } from '@/types/Directory'
import type { Project } from '@/types/Project'
import { faker } from '@faker-js/faker'
import { matchSorter, rankings } from 'match-sorter'
import type { ProjectQuery } from './helper'

const _getProject = (id: string) => {
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
  projects = faker.helpers.multiple(() => _getProject(faker.string.uuid()), {
    count: 50,
  })
  localStorage.setItem('t_projects', JSON.stringify(projects))
} else {
  projects = JSON.parse(localStorage.getItem('t_projects')!)
}

export const getProject = (id: string) => {
  for (const project of projects) {
    if (project.id === id) {
      return project
    }
  }
  return null
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
export function generateFakeProjectDirectory(path: string): ProjectDirectory {
  const files = faker.helpers.multiple(() => faker.lorem.slug(), { count: 5 })
  const subdirectories = faker.helpers.multiple(() => faker.lorem.slug(), {
    count: 6,
  })
  const lastModified = faker.date.recent().toISOString()
  const lastSynchronized = faker.date.recent().toISOString()

  const name = faker.lorem.words({ min: 3, max: 10 })

  return {
    path,
    files,
    subdirectories,
    lastModified,
    lastSynchronized,
    indexFile: {
      content: `# Ultor hunc laesum viae agmine venis sumpsere

## Sub centum

Lorem markdownum, carinae terga **Palameden Typhoea**, levius. Vina leto,
squalentia Iovem parte satus; patrium tenuisset. Argo deique clivo thalamoque
tuta quoque. Ulvae stetit quam, qua patrem eodem umbram respiciens Augustum dat.
Simul violavit murmur, deos ignes nec criminis, verba exit illum facta, totas
mihi iugulati vivere.

- Tegebant et perit
- Diu patet illam habet letum
- Arces alii niveis parva
- Nata Solis addidit ipse violentam caeruleos rapior
- Monte Aurorae exsiluere augustae totas

At patrem tamen tutos antistita, ubi vitae qui Athis, cuique Alba. Ignibus *est
protinus* et dicere, ne morando Aglauros; **ponunt inquit** ait mihi tum honesta
adnuit gravitas miseram. Ferret trunci patruus tradere spectatas amantis
ignoscas tempora Ulixes, sibi, quidem.

## Ad ipse amens

Pecudes plumas harenis: ille lata flumine fine unda aequor disiectisque decus
conciperet belli, nec ratibus. Imago aliquis orbem, Appenninus restare ne silvas
in sidera canem ad. Flammas tenet litora morte; prior **famulas tune languore**
dependebat. Nactus hausit, **et temeraria** Nesseo pariter ignibus altera. Est
ira undas intellegat generi plectro disiecta tu *reddita petit* cum profectus
matris, sed *fuit* circumlitus **dulce domus**.

Tamen auris moram terga verso rector vincemur te premis latique fistula velle?
Infestaque maxima, contulerant, care, tendens fert carentem: ante saepe. Ipse
procul parte se impetus **qua** pictos damnans nymphas munere, et Athenae non,
levibus cernit.

Sic illis tergusque maius incautum territa inductaque rident gramina quibus
precibus? Et parte; habet est probat sonum! Sed *artus crimine tecta* pararis
corde pennis fusus quoque repugnas et marito, thalami ingens frontem? Sede minor
Belides ad robora et lanient nomine in Phyleus quid omnes. Phoce modo est
accipe, cacumine fores cohibentem molire deposuitque, humo iuvat asperitas
cumque.

Surgere heros sed Capysque amor tamen haerebat horrifer veneratus moriemur
Metione magna, rate metam, et maluit dixit cum. Frondibus **ubi quanto** eadem
casa: maiora manum, nec. Omnes sola, sunt non et socerque **vultuque** grates.
Vixque potest, matrem miseram pallam eat illam iam. Aquatica viderat sit nova
recessus invasit figuram: artibus quod par capiant, pro gurgite ferentes.
`,
      path: `${path}/${name}`,
      name,
    },
  }
}
