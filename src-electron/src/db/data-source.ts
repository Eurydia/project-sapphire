import { Project } from './models/project.entity'
import { Topic } from './models/topic.entity'
import { Technology } from './models/technology.entity'
import { join } from 'path'
import { app } from 'electron'

// export const APP_DATA_SOURCE = new DataSource({
//   type: 'sqlite',
//   database: join(app.getPath('appData'), 'database', 'database.dev.sqlite'),
//   synchronize: true,
//   logging: false,
//   entities: [Project, Technology, Topic],
//   migrations: [],
//   subscribers: [],
// })
