export type ProjectTechnology = { name: string; id: string };
export type ProjectTopic = { name: string; id: string };

export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  modifiedAt: string;
  technologies: ProjectTechnology[];
  topics: ProjectTopic[];
};

export type ProjectQuery = {
  name?: string;
  technologies?: string[];
  topics?: string[];
  status?: string;
  visibility?: string;
};
