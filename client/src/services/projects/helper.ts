export type ProjectQuery = {
  name?: string
  technologies?: string[]
  topics?: string[]
  status?: string
  visibility?: string
}
export class ProjectQueryBuilder {
  private name: string | undefined
  private technologies: string[] | undefined
  private topics: string[] | undefined
  private status: string | undefined
  private visibility: string | undefined

  public constructor() {}

  public withName(value: typeof this.name) {
    this.name = value
    return this
  }

  public withTechnologies(value: typeof this.technologies) {
    this.technologies = value
    return this
  }

  public withTopics(value: typeof this.topics) {
    this.topics = value
    return this
  }

  public withStatus(value: typeof this.status) {
    this.status = value
    return this
  }
  public withVisibility(value: typeof this.visibility) {
    this.visibility = value
    return this
  }

  public build(): ProjectQuery {
    return {
      name: this.name,
      technologies: this.technologies,
      topics: this.topics,
      status: this.status,
      visibility: this.visibility,
    }
  }
}
