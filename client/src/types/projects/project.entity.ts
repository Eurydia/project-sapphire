export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  modifiedAt: string;
  tags: {
    technologies: string[];
    topics: string[];
  };
};

export type ProjectQuery = {
  name?: string;
  technologies?: string[];
  topics?: string[];
  status?: string;
  visibility?: string;
};
